'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { t, isRTL } = useLanguage();

    return (
        <footer className="relative bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className={`flex items-center gap-3 mb-6 group ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
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
                            <span className="text-xl font-bold text-slate-800 dark:text-white">
                                {isRTL ? (
                                    <>{t('common.appName')}</>
                                ) : (
                                    <><>UTA<span className="text-blue-600 dark:text-blue-400">Share</span></></>
                                )}
                            </span>
                        </Link>
                        <p className={`text-slate-600 dark:text-slate-400 max-w-md leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="text-slate-900 dark:text-white font-semibold mb-6">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/browse" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {t('nav.browse')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/share" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {t('nav.share')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/requests" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {t('nav.requests')}
                                </Link>
                            </li>
                            <li>
                                <Link href="#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {t('nav.howItWorks')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Universities */}
                    <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="text-slate-900 dark:text-white font-semibold mb-6">{t('footer.universities')}</h3>
                        <ul className="space-y-4">
                            <li>
                                <span className="text-slate-600 dark:text-slate-400">{isRTL ? 'جامعة السلطان قابوس' : 'Sultan Qaboos University'}</span>
                            </li>
                            <li>
                                <span className="text-slate-600 dark:text-slate-400">GUtech</span>
                            </li>
                            <li>
                                <span className="text-slate-600 dark:text-slate-400">{isRTL ? 'جامعة نزوى' : 'University of Nizwa'}</span>
                            </li>
                            <li>
                                <span className="text-slate-600 dark:text-slate-400">{isRTL ? '+ المزيد من الجامعات' : '+ More Universities'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        © {currentYear} {t('common.appName')}. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                    </p>
                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                            {t('footer.privacy')}
                        </Link>
                        <Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                            {t('footer.terms')}
                        </Link>
                    </div>
                </div>

                {/* Made with love */}
                <div className="mt-8 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {t('footer.madeWith')} ❤️ {t('footer.forStudents')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
