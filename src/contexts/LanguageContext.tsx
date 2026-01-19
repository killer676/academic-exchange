'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en, ar, Locale, LocaleKey } from '@/lib/locales';

interface LanguageContextType {
    language: LocaleKey;
    setLanguage: (lang: LocaleKey) => void;
    t: (key: string) => string;
    isRTL: boolean;
    locale: Locale;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
    t: () => '',
    isRTL: false,
    locale: en,
});

export const useLanguage = () => useContext(LanguageContext);

const locales: Record<LocaleKey, Locale> = { en, ar };

// Helper function to get nested property by dot notation
const getNestedValue = (obj: any, path: string): string => {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return path; // Return key if not found
        }
    }

    return typeof result === 'string' ? result : path;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<LocaleKey>('ar'); // Default to Arabic for family testing
    const [mounted, setMounted] = useState(false);

    // Load saved language preference
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as LocaleKey;
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            setLanguageState(savedLang);
        }
        setMounted(true);
    }, []);

    // Update HTML dir attribute when language changes
    useEffect(() => {
        if (mounted) {
            const dir = language === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.setAttribute('dir', dir);
            document.documentElement.setAttribute('lang', language);
            localStorage.setItem('language', language);
        }
    }, [language, mounted]);

    const setLanguage = (lang: LocaleKey) => {
        setLanguageState(lang);
    };

    const t = (key: string): string => {
        const currentLocale = locales[language];
        return getNestedValue(currentLocale, key);
    };

    const isRTL = language === 'ar';
    const locale = locales[language];

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <LanguageContext.Provider value={{ language: 'en', setLanguage, t: (key) => getNestedValue(en, key), isRTL: false, locale: en }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, locale }}>
            {children}
        </LanguageContext.Provider>
    );
}
