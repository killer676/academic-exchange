'use client';

// Client Component for Navigation Bar

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

import { useTheme } from 'next-themes';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { user, loading, signOut } = useAuth();
    const { language, setLanguage, t, isRTL } = useLanguage();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) return null;

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsProfileMenuOpen(false);
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            Edu<span className="text-blue-600 dark:text-blue-400">Share</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/browse"
                            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
                        >
                            {t('nav.browse')}
                        </Link>
                        <Link
                            href="/requests"
                            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm flex items-center gap-1"
                        >
                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            {t('nav.requests')}
                        </Link>
                        {user && (
                            <Link
                                href="/share"
                                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
                            >
                                {t('nav.share')}
                            </Link>
                        )}
                        <Link
                            href="/#how-it-works"
                            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
                        >
                            {t('nav.howItWorks')}
                        </Link>
                    </div>

                    {/* CTA Buttons / User Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                        >
                            {language === 'ar' ? (
                                <>🇺🇸 EN</>
                            ) : (
                                <>🇴🇲 عربي</>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center gap-3 px-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                >
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                            {user.displayName?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <span className="text-slate-700 dark:text-slate-200 font-medium hidden lg:block text-sm">{user.displayName}</span>
                                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                            <p className="text-slate-800 dark:text-white font-semibold text-sm">{user.displayName}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{user.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                {t('nav.myResources')}
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-colors text-sm"
                                            >
                                                {t('nav.signOut')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-4 py-2 text-sm"
                                >
                                    {t('nav.signIn')}
                                </Link>
                                <Link href="/signup" className="btn-primary text-sm">
                                    {t('nav.signUp')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Mobile Menu (Updated with Translations) */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-b-2xl absolute left-0 right-0 top-full px-4 animate-in slide-in-from-top-5">
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/browse"
                                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('nav.browse')} {/* ✅ تم التعريب */}
                                </Link>
                                <Link
                                    href="/requests"
                                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 flex items-center gap-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    {t('nav.requests')} {/* ✅ تم التعريب */}
                                </Link>

                                {/* رابط المشاركة للموبايل */}
                                {user && (
                                    <Link
                                        href="/share"
                                        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t('nav.share')}
                                    </Link>
                                )}

                                <Link
                                    href="/#how-it-works"
                                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('nav.howItWorks')} {/* ✅ تم التعريب */}
                                </Link>

                                {/* Language Toggle - Mobile */}
                                <button
                                    onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                                    className="flex items-center gap-2 py-2 text-slate-600 dark:text-slate-300 font-medium"
                                >
                                    {language === 'ar' ? (
                                        <>🇺🇸 Switch to English</>
                                    ) : (
                                        <>🇴🇲 التبديل للعربية</>
                                    )}
                                </button>

                                <hr className="border-slate-100 dark:border-slate-800 my-1" />

                                {user ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {t('nav.myResources')} {/* ✅ تم التوحيد مع الكمبيوتر */}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="text-left text-red-500 hover:text-red-600 transition-colors font-medium py-2"
                                        >
                                            {t('nav.signOut')} {/* ✅ تم التعريب */}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {t('nav.signIn')}
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="btn-primary text-center text-sm mt-2 justify-center"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {t('nav.signUp')}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}