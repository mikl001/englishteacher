import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const TITLE = "Английский — личный курс с AI-репетитором";
const DESCRIPTION =
  "Карточки с интервальным повторением, чтение с переводом, грамматика по темам и чат с AI-репетитором. Без аккаунта, всё в браузере.";

export const metadata: Metadata = {
  metadataBase: new URL("https://englishteacher-beta.vercel.app"),
  title: {
    default: TITLE,
    template: "%s · Английский",
  },
  description: DESCRIPTION,
  applicationName: "Английский",
  keywords: [
    "английский язык",
    "учить английский",
    "карточки",
    "spaced repetition",
    "AI-репетитор",
    "Next.js",
    "portfolio",
  ],
  authors: [{ name: "kapitalistm" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "ru_RU",
    siteName: "Английский",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${jetBrainsMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="font-sans min-h-screen flex flex-col">
        <Nav />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
