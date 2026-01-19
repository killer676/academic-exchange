'use client';

import { Suspense, useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UNIVERSITIES, RESOURCE_TYPES } from '@/lib/constants';
import { UploadButton } from '@/lib/uploadthing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ShareContent() {
    const { user } = useAuth();
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    // Initialize form with URL params (for fulfilling requests)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        university: 'utas', // Hardcoded for UTAS pivot
        courseCode: searchParams.get('courseCode') || '',
        type: '',
        link: '',
    });

    // Update form when URL params change
    useEffect(() => {
        const courseCode = searchParams.get('courseCode');
        const university = searchParams.get('university');
        if (courseCode || university) {
            setFormData(prev => ({
                ...prev,
                courseCode: courseCode || prev.courseCode,
                university: university || prev.university,
            }));
        }
    }, [searchParams]);

    // SECURITY: Redirect unauthenticated users
    useEffect(() => {
        if (user === null) {
            router.push('/login?redirect=/share');
        }
    }, [user, router]);

    // Show loading while checking auth
    if (user === undefined) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Check if user is logged in
        if (!user) {
            setError(isRTL ? 'يجب تسجيل الدخول لمشاركة مورد.' : 'You must be logged in to share a resource.');
            return;
        }

        // Validate required fields
        if (!formData.title.trim()) {
            setError(isRTL ? 'العنوان مطلوب' : 'Title is required');
            return;
        }
        if (!formData.university) {
            setError(isRTL ? 'الجامعة مطلوبة' : 'University is required');
            return;
        }
        if (!formData.courseCode.trim()) {
            setError(isRTL ? 'رمز المقرر مطلوب' : 'Course code is required');
            return;
        }
        if (!formData.type) {
            setError(isRTL ? 'نوع المورد مطلوب' : 'Resource type is required');
            return;
        }

        // Either uploaded file or external link is required
        if (!uploadedFileUrl && !formData.link.trim()) {
            setError(isRTL ? 'يرجى رفع ملف أو إدخال رابط خارجي' : 'Please upload a file or enter an external link');
            return;
        }

        // Validate external link format if provided
        if (formData.link.trim() && !uploadedFileUrl) {
            try {
                new URL(formData.link);
            } catch {
                setError(isRTL ? 'الرابط غير صالح. يرجى إدخال رابط كامل.' : 'Invalid link. Please enter a complete URL.');
                return;
            }
        }

        setUploading(true);

        try {
            const resourceData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                university: formData.university,
                courseCode: formData.courseCode.trim().toUpperCase(),
                type: formData.type,
                link: uploadedFileUrl || formData.link.trim(), // Use uploaded file URL or external link
                fileUrl: uploadedFileUrl || null, // Store UploadThing URL separately
                fileName: uploadedFileName || null, // Store original filename for icon detection
                authorId: user.uid,
                authorName: user.displayName || 'Student',
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'resources'), resourceData);
            router.push('/browse');
        } catch (err: any) {
            console.error('Error sharing resource:', err);
            setError(isRTL ? 'فشل مشاركة المورد. حاول مرة أخرى.' : 'Failed to share resource. Please try again.');
            setUploading(false);
        }
    };

    return (
        <main className="min-h-screen gradient-bg text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {isRTL ? 'شارك' : 'Share a'} <span className="gradient-text">{isRTL ? 'مورد' : 'Resource'}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 text-lg">
                            {isRTL
                                ? 'ساعد زملاءك الطلاب بمشاركة ملخصاتك وملاحظاتك'
                                : 'Help fellow students by sharing your summaries, notes, and past exams'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="glass rounded-3xl p-8">
                        {/* Title */}
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                {isRTL ? 'العنوان' : 'Title'} <span className="text-red-500 dark:text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${isRTL ? 'text-right' : ''}`}
                                placeholder={isRTL ? 'مثال: ملخص الرياضيات - الفصل الأول' : 'e.g., Calculus 1 Final Revision'}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                {isRTL ? 'الوصف' : 'Description'}
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className={`w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none ${isRTL ? 'text-right' : ''}`}
                                placeholder={isRTL ? 'وصف مختصر للمحتوى...' : 'Brief description of what this resource covers...'}
                            />
                        </div>

                        {/* University and Course Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* University Selection - Removed for single uni pivot */}
                            {/* <div>
                                <label htmlFor="university" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                    {isRTL ? 'الجامعة' : 'University'} <span className="text-red-500 dark:text-red-400">*</span>
                                </label>
                                <select
                                    id="university"
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                    className="hidden"
                                    required
                                >
                                    <option value="utas">UTAS</option>
                                </select>
                            </div> */}

                            <div>
                                <label htmlFor="courseCode" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                    {isRTL ? 'رمز المقرر' : 'Course Code'} <span className="text-red-500 dark:text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="courseCode"
                                    value={formData.courseCode}
                                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                    className={`w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 uppercase ${isRTL ? 'text-right' : ''}`}
                                    placeholder={isRTL ? 'مثال: MATH1200' : 'e.g., MATH1200'}
                                    required
                                />
                            </div>
                        </div>

                        {/* Resource Type */}
                        <div className="mb-6">
                            <label htmlFor="type" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                {isRTL ? 'نوع المورد' : 'Resource Type'} <span className="text-red-500 dark:text-red-400">*</span>
                            </label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/20 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                                required
                            >
                                <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                    {isRTL ? 'اختر النوع' : 'Select type'}
                                </option>
                                {RESOURCE_TYPES.map((type) => (
                                    <option key={type.id} value={type.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                        {isRTL ? type.nameAr : type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* File Upload Section */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                {isRTL ? 'رفع ملف' : 'Upload File'} <span className="text-slate-500 dark:text-gray-500 font-normal">{isRTL ? '(اختياري)' : '(Optional)'}</span>
                            </label>

                            {uploadedFileUrl ? (
                                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-green-300 font-medium">{isRTL ? 'تم رفع الملف بنجاح!' : 'File uploaded successfully!'}</p>
                                                <p className="text-green-400/70 text-sm truncate max-w-xs">{uploadedFileName}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUploadedFileUrl(null);
                                                setUploadedFileName(null);
                                            }}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="upload-button-wrapper">
                                    <UploadButton
                                        endpoint="resourceUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res && res[0]) {
                                                setUploadedFileUrl(res[0].ufsUrl);
                                                setUploadedFileName(res[0].name);
                                                setError('');
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            setError(isRTL ? `خطأ في الرفع: ${error.message}` : `Upload error: ${error.message}`);
                                        }}
                                        appearance={{
                                            button: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30",
                                            allowedContent: "text-gray-400 text-sm mt-2",
                                        }}
                                        content={{
                                            button({ ready }) {
                                                if (ready) return isRTL ? "اختر ملف للرفع" : "Choose file to upload";
                                                return isRTL ? "جاري التجهيز..." : "Getting ready...";
                                            },
                                            allowedContent({ ready, isUploading }) {
                                                if (!ready) return "";
                                                if (isUploading) return isRTL ? "جاري الرفع..." : "Uploading...";
                                                return isRTL ? "PDF, DOC, DOCX, PPT, PPTX, صور (حتى 8MB)" : "PDF, DOC, DOCX, PPT, PPTX, Images (up to 8MB)";
                                            }
                                        }}
                                        className="ut-allowed-content:text-slate-500 dark:ut-allowed-content:text-gray-400"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-gray-400">{isRTL ? 'أو' : 'OR'}</span>
                            </div>
                        </div>

                        {/* External Resource Link */}
                        <div className="mb-6">
                            <label htmlFor="link" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                {isRTL ? 'رابط خارجي' : 'External Link'} <span className="text-slate-500 dark:text-gray-500 font-normal">{isRTL ? '(اختياري)' : '(Optional)'}</span>
                            </label>
                            <input
                                type="url"
                                id="link"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                disabled={!!uploadedFileUrl}
                                className={`w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : ''}`}
                                placeholder="https://drive.google.com/..."
                            />
                            <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                                {isRTL
                                    ? 'الصق رابط Google Drive أو OneDrive أو أي خدمة تخزين سحابي'
                                    : 'Paste a Google Drive, OneDrive, or any cloud storage link'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading
                                    ? (isRTL ? 'جاري المشاركة...' : 'Sharing...')
                                    : (isRTL ? 'مشاركة المورد' : 'Share Resource')}
                            </button>
                            <Link
                                href="/browse"
                                className="px-6 py-3 border border-slate-200 dark:border-white/20 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
                            >
                                {isRTL ? 'إلغاء' : 'Cancel'}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}

export default function SharePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div></div>}>
            <ShareContent />
        </Suspense>
    );
}
