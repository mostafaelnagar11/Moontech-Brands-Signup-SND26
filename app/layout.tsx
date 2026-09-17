import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

/* Figtree is the typeface used across the MoonTech store assets, so the web
   flow and the App Store listing share one voice. */
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoonTech — Sign up",
  description: "MoonTech signup flow with the Saudi National Day seasonal theme.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>{children}</body>
    </html>
  );
}
