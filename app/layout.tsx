import type { Metadata } from "next";
import { Cairo, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hyper Reach Academy | أكاديمية هايبر ريتش",
  description:
    "منصة عربية حديثة للتعلّم أونلاين: مسارات عملية، محتوى عالي الجودة، وتعلّم مرن.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(900px_420px_at_70%_10%,rgba(47,123,255,0.35),transparent_60%),radial-gradient(700px_360px_at_15%_20%,rgba(47,123,255,0.18),transparent_55%)]" />
        <Navbar />
        <main className="relative flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
