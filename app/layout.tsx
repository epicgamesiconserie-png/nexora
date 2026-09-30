import type { Metadata } from "next";
import "./globals.css";
import {
  Inter,
  Poppins,
  Montserrat,
  Playfair_Display,
  Roboto,
  Lora,
  Space_Grotesk,
  DM_Sans,
  Nunito,
  Bebas_Neue,
  Cinzel,
  Orbitron,
  Bungee,
  UnifrakturCook,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
  display: "swap",
});
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
  display: "swap",
});
const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
  display: "swap",
});
const fraktur = UnifrakturCook({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-fraktur",
  display: "swap",
});

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
    <html
      lang="en"
      className={`
        ${inter.variable}
        ${poppins.variable}
        ${montserrat.variable}
        ${playfair.variable}
        ${roboto.variable}
        ${lora.variable}
        ${spaceGrotesk.variable}
        ${dmSans.variable}
        ${nunito.variable}
        ${bebas.variable}
        ${cinzel.variable}
        ${orbitron.variable}
        ${bungee.variable}
        ${fraktur.variable}
      `}
    >
      <body className="bg-[#0a0a0f] text-white antialiased">{children}</body>
    </html>
  );
}