import type { Metadata } from "next";
import { Cinzel, Lexend } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Virtual DM Screen - Pro Edition",
    template: "%s | Virtual DM Screen",
  },
  description: "The ultimate Virtual DM Screen for Tabletop RPGs. Manage encounters, roll dice, track initiative, and generate NPCs on the fly with a beautiful Neobrutalism design.",
  keywords: ["D&D", "DM Screen", "Virtual DM Screen", "Tabletop RPG", "Dungeon Master", "TTRPG", "Initiative Tracker", "Dice Roller", "NPC Generator"],
  authors: [{ name: "Dungeon Master" }],
  creator: "DM Screen",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dmscreen.vercel.app", // Replace with actual production URL
    title: "Virtual DM Screen - Pro Edition",
    description: "The ultimate Virtual DM Screen for Tabletop RPGs. Manage encounters, roll dice, track initiative, and generate NPCs on the fly.",
    siteName: "Virtual DM Screen",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual DM Screen - Pro Edition",
    description: "The ultimate Virtual DM Screen for Tabletop RPGs. Manage encounters, roll dice, track initiative, and generate NPCs on the fly.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${cinzel.variable} ${lexend.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
