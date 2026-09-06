// server.js
// Backend Express para o "Blow Up AI" — gera roteiros virais com a API do Gemini.
//
// IMPORTANTE: o pacote @google/generative-ai (o que você pediu) foi descontinuado
// pela Google em favor do novo SDK unificado @google/genai. A API e os métodos
// mudaram um pouco, então este arquivo já usa o pacote atual para não te entregar
// código que a Google vai desativar em breve. Instale com:
//   npm install @google/genai express cors dotenv express-rate-limit

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const { GoogleGenAI } = require("@google/genai");
const { SYSTEM_PROMPT } = require("./systemPrompt");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "1mb" }));

// Limite de requisições simples — importante porque cada chamada custa tokens
// da API do Gemini e este projeto vai ser usado por terceiros (clientes).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // 30 gerações por IP a cada 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Aguarde alguns minutos e tente novamente." },
});
app.use("/api/generate", limiter);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Schema estrutural que forçamos na resposta do modelo (JSON mode nativo do Gemini,
// mais confiável do que pedir "responda só em JSON" no prompt e torcer).
const responseSchema = {
  type: "object",
  properties: {
    roteiros: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          titulo_interno: { type: "string" },
          hook: { type: "string" },
          body: { type: "string" },
          cta: { type: "string" },
          visual_directions: { type: "string" },
        },
        required: ["titulo_interno", "hook", "body", "cta", "visual_directions"],
        propertyOrdering: ["titulo_interno", "hook", "body", "cta", "visual_directions"],
      },
    },
  },
  required: ["roteiros"],
};

function montarPrompt({ nicho, objetivo, tom, quantidade, plataforma }) {
  return `
Nicho/assunto do cliente: ${nicho}
Objetivo principal: ${objetivo || "crescimento de perfil"}
Tom de voz desejado: ${tom || "natural, autêntico, brasileiro"}
Plataforma principal: ${plataforma || "Instagram Reels / TikTok"}
Quantidade de roteiros a gerar: ${quantidade || 3}

Gere os roteiros seguindo rigorosamente o formato JSON definido.
`.trim();
}

app.post("/api/generate", async (req, res) => {
  try {
    const { nicho, objetivo, tom, quantidade, plataforma } = req.body || {};

    if (!nicho || typeof nicho !== "string" || !nicho.trim()) {
      return res.status(400).json({ error: "Informe o nicho/assunto do cliente." });
    }

    const qtd = Math.min(Math.max(parseInt(quantidade, 10) || 3, 1), 6);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // rápido e barato — ideal para baixo custo de infra
      contents: montarPrompt({ nicho, objetivo, tom, quantidade: qtd, plataforma }),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.9,
      },
    });

    const texto = response.text;
    let dados;
    try {
      dados = JSON.parse(texto);
    } catch (parseErr) {
      console.error("Falha ao parsear JSON do modelo:", texto);
      return res.status(502).json({ error: "A IA retornou um formato inesperado. Tente novamente." });
    }

    return res.json(dados);
  } catch (err) {
    console.error("Erro ao gerar conteúdo:", err);
    return res.status(500).json({ error: "Erro ao gerar o conteúdo. Tente novamente em instantes." });
  }
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Blow Up AI backend rodando na porta ${PORT}`);
});
