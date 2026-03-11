import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TEMPO — Partenaires Sportifs",
  description:
    "TEMPO te permet de rencontrer des partenaires sportifs pour t'entraîner, progresser et partager tes activités sportives.",
  icons: {
    icon: "/tempo-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
