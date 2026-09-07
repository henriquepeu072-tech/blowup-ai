import "./globals.css";

export const metadata = {
  title: "Blow Up AI — Roteiros virais em segundos",
  description:
    "Gere roteiros de vídeo curto prontos para gravar: gancho, corpo, chamada para ação e direção visual.",
  manifest: "/manifest.json",
  themeColor: "#0B0E14",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0E14",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
