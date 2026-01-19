'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, orderBy, serverTimestamp, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Request as RequestType } from '@/types';
import { UNIVERSITIES } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function RequestsPage() {
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const { t, isRTL } = useLanguage();

    const [formData, setFormData] = useState({
        courseCode: '',
        description: '',
        university: '',
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const requestsQuery = query(
                collection(db, 'requests'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(requestsQuery);
            const requestsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as RequestType[];
            setRequests(requestsData);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError(isRTL ? 'يجب تسجيل الدخول لإضافة طلب' : 'You must be logged in to add a request');
            return;
        }

        if (!formData.courseCode.trim()) {
            setError(isRTL ? 'رمز المقرر مطلوب' : 'Course code is required');
            return;
        }
        if (!formData.description.trim()) {
            setError(isRTL ? 'الوصف مطلوب' : 'Description is required');
            return;
        }
        if (!formData.university) {
            setError(isRTL ? 'الجامعة مطلوبة' : 'University is required');
            return;
        }

        setSubmitting(true);

        try {
            const requestData = {
                courseCode: formData.courseCode.trim().toUpperCase(),
                description: formData.description.trim(),
                university: formData.university,
                authorId: user.uid,
                authorName: user.displayName || 'Student',
                createdAt: serverTimestamp(),
                isFulfilled: false,
            };

            await addDoc(collection(db, 'requests'), requestData);
            setFormData({ courseCode: '', description: '', university: '' });
            setShowForm(false);
            fetchRequests();
        } catch (err: any) {
            console.error('Error adding request:', err);
            setError(isRTL ? 'فشل إضافة الطلب' : 'Failed to add request');
        } finally {
            setSubmitting(false);
        }
    };

    const getUniversityName = (id: string) => {
        const uni = UNIVERSITIES.find(u => u.id === id);
        return uni?.name || id;
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString(isRTL ? 'ar-OM' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const activeRequests = requests.filter(r => !r.isFulfilled);
    const fulfilledRequests = requests.filter(r => r.isFulfilled);

    return (
        <div className="min-h-screen gradient-bg text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            {isRTL ? 'لوحة' : 'Request'} <span className="gradient-text">{isRTL ? 'الطلبات' : 'Board'}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                            {isRTL
                                ? 'اطلب موارد دراسية تحتاجها أو ساعد زملاءك بتلبية طلباتهم'
                                : 'Request study resources you need or help your peers by fulfilling their requests'}
                        </p>
                    </div>

                    {/* Add Request Button */}
                    <div className="flex justify-center mb-8">
                        {user ? (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                                </svg>
                                {showForm
                                    ? (isRTL ? 'إلغاء' : 'Cancel')
                                    : (isRTL ? 'إضافة طلب' : 'Add Request')}
                            </button>
                        ) : (
                            <Link href="/login" className="btn-primary">
                                {isRTL ? 'سجل دخولك لإضافة طلب' : 'Sign in to add a request'}
                            </Link>
                        )}
                    </div>

                    {/* Add Request Form */}
                    {showForm && (
                        <div className="glass rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                                {isRTL ? 'طلب مورد جديد' : 'Request a Resource'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                            {isRTL ? 'رمز المقرر' : 'Course Code'} <span className="text-red-500 dark:text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.courseCode}
                                            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                            className={`w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 uppercase ${isRTL ? 'text-right' : ''}`}
                                            placeholder="MATH1200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                            {isRTL ? 'الجامعة' : 'University'} <span className="text-red-500 dark:text-red-400">*</span>
                                        </label>
                                        <select
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/20 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="">{isRTL ? 'اختر الجامعة' : 'Select university'}</option>
                                            {UNIVERSITIES.map((uni) => (
                                                <option key={uni.id} value={uni.id}>{uni.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                        {isRTL ? 'ماذا تحتاج؟' : 'What do you need?'} <span className="text-red-500 dark:text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className={`w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none ${isRTL ? 'text-right' : ''}`}
                                        placeholder={isRTL ? 'مثال: أحتاج ملخص للفصل الخامس' : 'e.g., Need a summary for Chapter 5'}
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-200 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full btn-primary disabled:opacity-50"
                                >
                                    {submitting
                                        ? (isRTL ? 'جاري الإضافة...' : 'Submitting...')
                                        : (isRTL ? 'إرسال الطلب' : 'Submit Request')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                        <div className="glass rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">{activeRequests.length}</div>
                            <div className="text-slate-500 dark:text-gray-400 text-sm">{isRTL ? 'طلبات نشطة' : 'Active Requests'}</div>
                        </div>
                        <div className="glass rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-500 dark:text-green-400">{fulfilledRequests.length}</div>
                            <div className="text-slate-500 dark:text-gray-400 text-sm">{isRTL ? 'تم تلبيتها' : 'Fulfilled'}</div>
                        </div>
                    </div>

                    {/* Requests List */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="glass rounded-xl p-6 animate-pulse">
                                    <div className="h-6 bg-white/10 rounded w-1/4 mb-3"></div>
                                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : activeRequests.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center">
                            <svg className="w-20 h-20 text-slate-400 dark:text-gray-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                {isRTL ? 'لا توجد طلبات بعد' : 'No Requests Yet'}
                            </h3>
                            <p className="text-slate-500 dark:text-gray-400 mb-6">
                                {isRTL
                                    ? 'كن أول من يطلب مورداً دراسياً!'
                                    : 'Be the first to request a study resource!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeRequests.map((request) => (
                                <div key={request.id} className="glass rounded-xl p-6 hover:border-purple-500/50 transition-all group">
                                    <div className={`flex flex-col md:flex-row md:items-start md:justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
                                                    {request.courseCode}
                                                </span>
                                                <span className="text-slate-500 dark:text-gray-500 text-sm">
                                                    {getUniversityName(request.university)}
                                                </span>
                                            </div>
                                            <p className={`text-slate-900 dark:text-white text-lg mb-3 ${isRTL ? 'text-right' : ''}`}>
                                                {request.description}
                                            </p>
                                            <div className={`flex items-center gap-4 text-sm text-slate-500 dark:text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {request.authorName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(request.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Fulfill Button */}
                                        {user && (
                                            <Link
                                                href={`/share?courseCode=${encodeURIComponent(request.courseCode)}&university=${encodeURIComponent(request.university)}`}
                                                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all shadow-lg shadow-green-500/20"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                                {isRTL ? 'تلبية الطلب' : 'Fulfill Request'}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Fulfilled Requests Section */}
                    {fulfilledRequests.length > 0 && (
                        <div className="mt-12">
                            <h2 className={`text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {isRTL ? 'الطلبات المُلباة' : 'Fulfilled Requests'}
                            </h2>
                            <div className="space-y-3">
                                {fulfilledRequests.map((request) => (
                                    <div key={request.id} className="glass rounded-xl p-4 opacity-70">
                                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                                                ✓ {request.courseCode}
                                            </span>
                                            <span className="text-slate-500 dark:text-gray-400 text-sm line-through">
                                                {request.description}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
