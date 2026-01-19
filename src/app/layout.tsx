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
    title: "UTAShare | Student Academic Exchange",
    description: "The dedicated platform for UTAS students to share and discover study resources. Summaries, notes, past exams, and projects from verified students.",
    keywords: ["resources", "UTAS", "university", "students", "study", "summaries", "notes", "exams", "education", "learning", "UTAShare"],
    authors: [{ name: "UTAShare" }],
    openGraph: {
        title: "UTAShare | Student Academic Exchange",
        description: "The dedicated platform for UTAS students to share and discover study resources.",
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
