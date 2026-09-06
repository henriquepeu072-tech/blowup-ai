# Blow Up AI (clone pessoal)

Gera roteiros de vídeo curto (hook, body, cta, visual_directions) com a API
do Gemini, para uso pessoal e para cobrar um valor simbólico de pequenos
clientes.

## Estrutura

```
backend/    → Node.js + Express + Gemini (@google/genai). Roda em qualquer
              host Node (Render, Railway, Fly.io — todos têm free tier).
frontend/   → Next.js 14 (App Router) + Tailwind. Deploy a custo zero na Vercel.
```

## Por que troquei @google/generative-ai por @google/genai

Você pediu `@google/generative-ai`, mas esse pacote foi **descontinuado**
pela Google e substituído pelo SDK unificado `@google/genai`. Usei o pacote
atual para o código não ficar obsoleto no lançamento. A troca é só na forma
de chamar a API — o restante da arquitetura é a que você pediu.

## Rodando local

### Backend
```bash
cd backend
cp .env.example .env      # cole sua GEMINI_API_KEY (grátis em aistudio.google.com/apikey)
npm install
npm run dev                # http://localhost:3001
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                # http://localhost:3000
```

## Deploy a custo zero

- **Frontend → Vercel**: conecte o repositório, aponte a raiz do projeto
  para `frontend/`, e defina `NEXT_PUBLIC_API_URL` como a URL pública do
  backend.
- **Backend → Render ou Railway (free tier)**: aponte a raiz para `backend/`,
  defina `GEMINI_API_KEY` e `FRONTEND_URL` (a URL da Vercel) nas variáveis
  de ambiente.
- O Gemini 2.5 Flash tem uma cota gratuita generosa — para o volume de
  "amigos e pequenos clientes" isso deve cobrir o uso sem custo, mas vale
  acompanhar o consumo no Google AI Studio.

## PWA no celular

O `manifest.json` já está pronto em `frontend/public/`. Falta só adicionar
os ícones `icon-192.png` e `icon-512.png` na mesma pasta (qualquer gerador
de ícone PWA resolve) para o "Adicionar à tela inicial" funcionar no
Android/iOS.

## Cobrando dos clientes

Como é você quem paga a chave da API, considere: (1) manter o rate limit já
configurado no backend (30 gerações/15min por IP) para evitar abuso, e
(2) se for cobrar por uso pesado, seria fácil adicionar um controle simples
de créditos por cliente depois — não incluí isso agora para manter o MVP
enxuto conforme pedido.
