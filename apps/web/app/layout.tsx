import type { Metadata } from "next";
import { Poppins, Inter, Lora } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/seo/site";

// Brand type system — see DOC/REQUIREMENTS_ANALYSIS.md § 12 (Design System)
// and DOC/FRONTEND_ARCHITECTURE.md § 4. Self-hosted via next/font, exposed as
// CSS custom properties for Tailwind's theme (see globals.css @theme block).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Distance MBA College",
  description:
    "Honest advisory platform for Distance, Online, Executive, and Correspondence MBA programmes from accredited private universities in India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${inter.variable} ${lora.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
