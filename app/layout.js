import "./globals.css";

export const metadata = {
  title: "My Website",
  description: "Una pagina semplice",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
