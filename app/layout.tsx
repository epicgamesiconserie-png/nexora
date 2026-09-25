import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "smokez.lol — Your link, your world",
  description: "The clean, modern link-in-bio platform. Build your own at smokez.lol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-white antialiased">{children}</body>
    </html>
  );
}