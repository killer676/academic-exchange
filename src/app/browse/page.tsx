'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resource, ResourceFilters } from '@/types';
import { UNIVERSITIES, RESOURCE_TYPES } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { FileTypeIcon } from '@/utils/fileIcons';

export default function BrowsePage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ResourceFilters>({});
    const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
    const [savingResourceId, setSavingResourceId] = useState<string | null>(null);
    const { user } = useAuth();
    const { t, isRTL } = useLanguage();

    useEffect(() => {
        fetchResources();
    }, []);

    // Fetch user's saved resources
    useEffect(() => {
        const fetchSavedResources = async () => {
            if (!user) {
                setSavedResourceIds([]);
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setSavedResourceIds(userData.savedResourceIds || []);
                }
            } catch (error) {
                console.error('Error fetching saved resources:', error);
            }
        };
        fetchSavedResources();
    }, [user]);

    // Toggle bookmark
    const toggleBookmark = async (resourceId: string) => {
        if (!user) return;
        setSavingResourceId(resourceId);
        try {
            const userRef = doc(db, 'users', user.uid);
            const isSaved = savedResourceIds.includes(resourceId);

            if (isSaved) {
                await updateDoc(userRef, {
                    savedResourceIds: arrayRemove(resourceId)
                });
                setSavedResourceIds(prev => prev.filter(id => id !== resourceId));
            } else {
                await updateDoc(userRef, {
                    savedResourceIds: arrayUnion(resourceId)
                });
                setSavedResourceIds(prev => [...prev, resourceId]);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        } finally {
            setSavingResourceId(null);
        }
    };

    const fetchResources = async () => {
        try {
            const resourcesQuery = query(
                collection(db, 'resources'),
                orderBy('createdAt', 'desc'),
                limit(50)
            );
            const snapshot = await getDocs(resourcesQuery);
            const resourcesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Resource[];
            setResources(resourcesData);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = resources.filter(resource => {
        if (filters.university && resource.university !== filters.university) return false;
        if (filters.type && resource.type !== filters.type) return false;
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            if (!resource.title.toLowerCase().includes(query) &&
                !resource.description.toLowerCase().includes(query) &&
                !resource.courseCode.toLowerCase().includes(query)) return false;
        }
        return true;
    });

    const getTypeBadge = (type: string) => {
        const typeInfo = RESOURCE_TYPES.find(t => t.id === type);
        return typeInfo || { name: type, nameAr: type, color: 'bg-gray-500' };
    };

    const getUniversityName = (id: string) => {
        const uni = UNIVERSITIES.find(u => u.id === id);
        return uni?.name || id;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            {isRTL ? 'تصفح' : 'Browse'} <span className="gradient-text">{isRTL ? 'الموارد' : 'Resources'}</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                            {isRTL
                                ? 'اكتشف ملخصات وملاحظات وامتحانات سابقة من زملائك الطلاب'
                                : 'Discover summaries, notes, and past exams shared by fellow students'}
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 mb-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    value={filters.searchQuery || ''}
                                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                    placeholder={isRTL ? 'ابحث بالعنوان أو رمز المقرر...' : 'Search by title or course code...'}
                                    className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${isRTL ? 'text-right' : ''}`}
                                />
                            </div>

                            {/* University Filter - Removed for single uni pivot */}
                            {/* <select
                                value={filters.university || ''}
                                onChange={(e) => setFilters({ ...filters, university: e.target.value || undefined })}
                                className="hidden" 
                            >
                                <option value="">{isRTL ? 'جميع الجامعات' : 'All Universities'}</option>
                            </select> */}

                            {/* Type Filter */}
                            <select
                                value={filters.type || ''}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                                className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23334155' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="">{isRTL ? 'جميع الأنواع' : 'All Types'}</option>
                                {RESOURCE_TYPES.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {isRTL ? type.nameAr : type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-slate-500 dark:text-slate-400">
                            {filteredResources.length} {isRTL ? 'مورد متاح' : 'resources found'}
                        </p>
                    </div>

                    {/* Resources Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse">
                                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-4 w-3/4"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-1/2"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                            <svg className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                {isRTL ? 'لا توجد موارد بعد' : 'No Resources Yet'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                {isRTL
                                    ? 'كن أول من يشارك ملخصاً أو ملاحظات!'
                                    : 'Be the first to share a summary or notes!'}
                            </p>
                            {user && (
                                <Link href="/share" className="btn-primary inline-flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {isRTL ? 'شارك مورداً' : 'Share a Resource'}
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResources.map((resource) => {
                                const typeBadge = getTypeBadge(resource.type);
                                return (
                                    <div key={resource.id} className="feature-card group block hover:-translate-y-1">
                                        {/* Type Badge, Course Code & Bookmark */}
                                        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${typeBadge.color}`}>
                                                {isRTL ? typeBadge.nameAr : typeBadge.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 font-mono text-sm font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                                    {resource.courseCode}
                                                </span>
                                                {user && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleBookmark(resource.id);
                                                        }}
                                                        disabled={savingResourceId === resource.id}
                                                        className={`p-1.5 rounded-lg transition-all ${savedResourceIds.includes(resource.id)
                                                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                                            : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                            } ${savingResourceId === resource.id ? 'opacity-50' : ''}`}
                                                        title={savedResourceIds.includes(resource.id) ? (isRTL ? 'إزالة من المحفوظات' : 'Remove from saved') : (isRTL ? 'حفظ لاحقاً' : 'Save for later')}
                                                    >
                                                        {savedResourceIds.includes(resource.id) ? (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Title with File Icon */}
                                        <div className={`flex items-start gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <FileTypeIcon filename={resource.fileUrl || resource.link || resource.title} />
                                            <h3 className={`text-xl font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${isRTL ? 'text-right' : ''}`}>
                                                {resource.title}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        {resource.description && (
                                            <p className={`text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
                                                {resource.description}
                                            </p>
                                        )}

                                        {/* University & Author */}
                                        <div className={`flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <svg className="w-4 h-4 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span>{getUniversityName(resource.university)}</span>
                                        </div>

                                        <div className={`flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <svg className="w-4 h-4 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>{resource.authorName}</span>
                                        </div>

                                        {/* View Resource Button */}
                                        <Link
                                            href={`/resources/${resource.id}`}
                                            className="w-full btn-secondary flex items-center justify-center gap-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            {isRTL ? 'عرض المورد' : 'View Resource'}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* CTA for non-logged in users */}
                    {!user && (
                        <div className="mt-16 bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    {isRTL ? 'تريد مشاركة مواردك؟' : 'Want to share your resources?'}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    {isRTL
                                        ? 'سجل دخولك ببريدك الجامعي لمشاركة ملخصاتك وملاحظاتك'
                                        : 'Sign in with your university email to share your summaries and notes'}
                                </p>
                                <Link href="/signup" className="btn-primary inline-block">
                                    {isRTL ? 'ابدأ الآن' : 'Get Started'}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
