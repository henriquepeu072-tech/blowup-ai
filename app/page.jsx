"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const OBJETIVOS = [
  { value: "crescimento", label: "Crescer o perfil" },
  { value: "venda", label: "Gerar vendas" },
  { value: "ambos", label: "Crescer e vender" },
];

const PLATAFORMAS = ["Instagram Reels", "TikTok", "YouTube Shorts"];

const SECOES = [
  { key: "hook", label: "Gancho", sub: "0–3s", border: "border-coral", dot: "bg-coral" },
  { key: "body", label: "Corpo", sub: "desenvolvimento", border: "border-mist/40", dot: "bg-mist" },
  { key: "cta", label: "Chamada para ação", sub: "conversão", border: "border-amber", dot: "bg-amber" },
  {
    key: "visual_directions",
    label: "Direção visual",
    sub: "gravação e edição",
    border: "border-violet border-dashed",
    dot: "bg-violet",
  },
];

export default function Home() {
  const [nicho, setNicho] = useState("");
  const [objetivo, setObjetivo] = useState("ambos");
  const [plataforma, setPlataforma] = useState(PLATAFORMAS[0]);
  const [quantidade, setQuantidade] = useState(3);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [roteiros, setRoteiros] = useState([]);
  const [copiadoId, setCopiadoId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nicho.trim()) {
      setErro("Digite o nicho ou assunto do cliente antes de gerar.");
      return;
    }
    setErro("");
    setLoading(true);
    setRoteiros([]);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicho, objetivo, plataforma, quantidade }),
      });
      const dados = await res.json();

      if (!res.ok) {
        setErro(dados.error || "Não deu para gerar os roteiros agora. Tente de novo.");
        return;
      }
      setRoteiros(dados.roteiros || []);
    } catch (err) {
      setErro("Não consegui falar com o servidor. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function copiarRoteiro(roteiro, idx) {
    const texto = `GANCHO: ${roteiro.hook}\n\nCORPO: ${roteiro.body}\n\nCTA: ${roteiro.cta}\n\nDIREÇÃO VISUAL: ${roteiro.visual_directions}`;
    navigator.clipboard.writeText(texto);
    setCopiadoId(idx);
    setTimeout(() => setCopiadoId(null), 1800);
  }

  return (
    <main className="min-h-screen lg:flex">
      {/* Painel de input */}
      <aside className="lg:w-[380px] lg:min-h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-border px-6 py-8 lg:py-10 bg-panel/40">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ivory">
            Blow Up <span className="text-coral">AI</span>
          </h1>
          <p className="mt-2 text-sm text-mist leading-relaxed">
            Descreva o cliente, escolha o objetivo, e receba roteiros prontos
            para gravar — gancho, corpo, CTA e direção de gravação.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nicho" className="block text-sm text-ivory mb-1.5">
              Nicho ou assunto do cliente
            </label>
            <textarea
              id="nicho"
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              placeholder="Ex: confeitaria caseira em Curitiba, especializada em bolos de casamento"
              rows={3}
              className="w-full rounded-lg bg-ink border border-border px-3 py-2.5 text-sm text-ivory placeholder:text-mist/60 focus:border-coral outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="objetivo" className="block text-sm text-ivory mb-1.5">
              Objetivo do conteúdo
            </label>
            <select
              id="objetivo"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full rounded-lg bg-ink border border-border px-3 py-2.5 text-sm text-ivory focus:border-coral outline-none"
            >
              {OBJETIVOS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="plataforma" className="block text-sm text-ivory mb-1.5">
                Plataforma
              </label>
              <select
                id="plataforma"
                value={plataforma}
                onChange={(e) => setPlataforma(e.target.value)}
                className="w-full rounded-lg bg-ink border border-border px-3 py-2.5 text-sm text-ivory focus:border-coral outline-none"
              >
                {PLATAFORMAS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quantidade" className="block text-sm text-ivory mb-1.5">
                Quantidade
              </label>
              <input
                id="quantidade"
                type="number"
                min={1}
                max={6}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full rounded-lg bg-ink border border-border px-3 py-2.5 text-sm text-ivory focus:border-coral outline-none"
              />
            </div>
          </div>

          {erro && (
            <p className="text-sm text-coral bg-coral/10 border border-coral/30 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-coral text-ink font-display font-semibold text-sm py-3 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? "Gerando roteiros..." : "Gerar roteiros"}
          </button>
        </form>
      </aside>

      {/* Resultado */}
      <section className="flex-1 px-6 py-8 lg:py-10 lg:px-10 max-w-3xl">
        {roteiros.length === 0 && !loading && (
          <div className="text-mist text-sm border border-dashed border-border rounded-xl px-6 py-14 text-center">
            Os roteiros gerados vão aparecer aqui, prontos para copiar e gravar.
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: Number(quantidade) || 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl border border-border bg-panel/40 animate-pulse"
              />
            ))}
          </div>
        )}

        <div className="space-y-6">
          {roteiros.map((roteiro, idx) => (
            <article
              key={idx}
              className="rounded-xl border border-border bg-panel/60 overflow-hidden"
            >
              <header className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs text-ink bg-ivory rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                    {idx + 1}
                  </span>
                  <h2 className="font-display text-sm text-ivory">
                    {roteiro.titulo_interno || "Roteiro"}
                  </h2>
                </div>
                <button
                  onClick={() => copiarRoteiro(roteiro, idx)}
                  className="text-xs text-mist hover:text-ivory transition-colors"
                >
                  {copiadoId === idx ? "Copiado" : "Copiar"}
                </button>
              </header>

              <div className="divide-y divide-border">
                {SECOES.map((secao) => (
                  <div key={secao.key} className={`px-5 py-4 border-l-2 ${secao.border}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${secao.dot}`} />
                      <span className="text-xs text-mist">
                        {secao.label} · {secao.sub}
                      </span>
                    </div>
                    <p className="text-sm text-ivory leading-relaxed whitespace-pre-line">
                      {roteiro[secao.key]}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
