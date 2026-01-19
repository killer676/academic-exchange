import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

import { Providers } from "@/components/Providers";

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    weight: ["400", "600", "700"],
    variable: "--font-cairo",
});

export const metadata: Metadata = {
    title: "EduShare | Share Study Resources in Oman",
    description: "The trusted platform for Omani university students to share and discover study resources. Summaries, notes, past exams, and projects from verified students.",
    keywords: ["resources", "Oman", "university", "students", "study", "summaries", "notes", "exams", "education", "learning", "EduShare"],
    authors: [{ name: "EduShare" }],
    openGraph: {
        title: "EduShare | Share Study Resources in Oman",
        description: "The trusted platform for Omani university students to share and discover study resources.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body className={`${cairo.variable} font-sans antialiased`}>
                <Providers>
                    <LanguageProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </LanguageProvider>
                </Providers>
            </body>
        </html>
    );
}
