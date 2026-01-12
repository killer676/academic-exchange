import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Academic Exchange | Buy & Sell Textbooks in Oman",
    description: "The trusted marketplace for Omani university students to buy and sell used textbooks. Verified students only with .edu.om email addresses.",
    keywords: ["textbooks", "Oman", "university", "students", "buy", "sell", "academic", "books"],
    authors: [{ name: "Academic Exchange" }],
    openGraph: {
        title: "Academic Exchange | Buy & Sell Textbooks in Oman",
        description: "The trusted marketplace for Omani university students to buy and sell used textbooks.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.variable} antialiased`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
