import { Geist } from "next/font/google";
import { PreferencesProvider } from "@/context/PreferencesContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://expense-tracker-taksh.vercel.app"),
  title: {
    default: "Expense Tracker | Personal Finance Dashboard",
    template: "%s | Expense Tracker",
  },
  description:
    "Track expenses, income, balances, categories, and recent transactions with a simple personal finance dashboard.",
  applicationName: "Expense Tracker",
  keywords: [
    "expense tracker",
    "personal finance",
    "budget tracker",
    "income tracker",
    "transaction dashboard",
    "money management app",
    "daily expense manager",
    "finance dashboard",
    "spending tracker",
    "expense manager",
    "budget planner",
    "track expenses online",
    "income and expense tracker",
    "personal budget app",
    "financial analytics",
  ],
  authors: [{ name: "Expense Tracker" }],
  creator: "Expense Tracker",
  publisher: "Expense Tracker",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Expense Tracker",
    title: "Expense Tracker | Personal Finance Dashboard",
    description:
      "Track expenses, income, balances, categories, and recent transactions with a simple personal finance dashboard.",
  },
  twitter: {
    card: "summary",
    title: "Expense Tracker | Personal Finance Dashboard",
    description:
      "Track expenses, income, balances, categories, and recent transactions with a simple personal finance dashboard.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "0tBrmiGlRZPSHiHcdwV7S8EzxM2Jh-1gA0DI4NEsTDE",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
