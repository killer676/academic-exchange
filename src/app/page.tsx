'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resource } from '@/types';
import { UNIVERSITIES } from '@/lib/constants';

export default function Home() {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentResources, setRecentResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentResources();
    }, []);

    const fetchRecentResources = async () => {
        try {
            const q = query(
                collection(db, 'resources'),
                orderBy('createdAt', 'desc'),
                limit(3)
            );
            const snapshot = await getDocs(q);
            const resources = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Handle Firestore Timestamp or standard Date
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now())
                };
            }) as Resource[];
            setRecentResources(resources);
        } catch (error) {
            console.error('Error fetching recent resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const getUniversityName = (id: string) => {
        const uni = UNIVERSITIES.find(u => u.id === id);
        return uni?.name || id;
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl text-slate-600" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTUsIDIzLCA0MiwgMC4wNSkiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                        <span className="block mb-2">{t('home.heroTitle')}</span>
                        <span className="gradient-text">{t('home.heroTitleHighlight')}</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {t('home.heroSubtitle')}
                    </p>

                    {/* Search Input */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md">
                                <svg className={`w-5 h-5 text-slate-400 ml-4 ${isRTL ? 'order-last mr-4 ml-0' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('home.searchPlaceholder')}
                                    className={`w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 px-4 py-3 text-base ${isRTL ? 'text-right' : ''}`}
                                />
                                <button
                                    type="submit"
                                    className="hidden sm:block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                        <Link href="/share" className="btn-primary w-full sm:w-auto text-lg px-8 py-3">
                            {t('home.browseBtn')}
                        </Link>
                        <Link
                            href="/requests"
                            className="btn-secondary w-full sm:w-auto text-lg px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                            {t('home.requestsBtn')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Uploads Section */}
            <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            {t('home.recentUploads')}
                        </h3>
                        <Link href="/browse" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                            View all
                            <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                            ))
                        ) : recentResources.length > 0 ? (
                            recentResources.map((resource) => (
                                <Link
                                    href={`/resources/${resource.id}`}
                                    key={resource.id}
                                    className="feature-card group block hover:-translate-y-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl transition-all"
                                >
                                    <div className={`flex flex-col h-full ${isRTL ? 'items-end text-right' : ''}`}>
                                        <div className="flex items-center gap-2 mb-3 w-full">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 truncate">
                                                {resource.courseCode}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1 text-right">
                                                {getUniversityName(resource.university)}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {resource.title}
                                        </h4>
                                        <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700 w-full flex items-center justify-between text-xs text-slate-400">
                                            <span>{resource.createdAt.toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                No resources uploaded yet. Be the first!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase text-xs mb-2 block">
                            {t('home.features.title')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                            {isRTL ? 'مصمم لـ' : 'Designed for '} <span className="gradient-text">{t('home.features.titleHighlight')}</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            {t('home.features.subtitle')}
                        </p>
                    </div>

                    <div className={`grid md:grid-cols-3 gap-8 ${isRTL ? 'rtl-grid' : ''}`}>
                        {/* Direct Uploads */}
                        <div className="feature-card text-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl transition-all hover:shadow-lg dark:shadow-slate-900/50">
                            <div className="w-14 h-14 mx-auto rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('home.features.direct.title')}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('home.features.direct.description')}
                            </p>
                        </div>

                        {/* Request Board */}
                        <div className="feature-card text-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl transition-all hover:shadow-lg dark:shadow-slate-900/50">
                            <div className="w-14 h-14 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('home.features.requests.title')}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('home.features.requests.description')}
                            </p>
                        </div>

                        {/* Free Forever */}
                        <div className="feature-card text-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl transition-all hover:shadow-lg dark:shadow-slate-900/50">
                            <div className="w-14 h-14 mx-auto rounded-xl bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('home.features.free.title')}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('home.features.free.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works (Simplified) */}
            <section className="py-24 bg-white dark:bg-slate-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            {t('home.howItWorks.title')} <span className="gradient-text">{t('home.howItWorks.titleHighlight')}</span>
                        </h2>
                    </div>

                    <div className={`grid md:grid-cols-3 gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="p-6 text-center relative">
                                <div className="w-12 h-12 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white mb-6 shadow-lg shadow-blue-600/20">
                                    {step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t(`home.howItWorks.step${step}.title`)}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{t(`home.howItWorks.step${step}.description`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
