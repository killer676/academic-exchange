'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { t, isRTL } = useLanguage();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (password.length < 6) {
            setError(t('auth.signUp.errors.passwordLength'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('auth.signUp.errors.passwordMismatch'));
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password);
            // FAMILY TESTING MODE: Redirect immediately to browse instead of showing verification message
            router.push('/browse');
        } catch (error: any) {
            if (error.message.includes('UTAS email')) {
                setError(t('auth.signUp.errors.invalidEmail'));
            } else if (error.code === 'auth/email-already-in-use') {
                setError(t('auth.signUp.errors.emailInUse'));
            } else if (error.code === 'auth/weak-password') {
                setError(t('auth.signUp.errors.weakPassword'));
            } else {
                setError(error.message || t('auth.signUp.errors.generic'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 transition-colors duration-300">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <Link href="/" className={`flex items-center justify-center gap-3 mb-8 group ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isRTL ? (
                            <>{t('common.appName')}</>
                        ) : (
                            <>Edu<span className="text-blue-600 dark:text-blue-400">Share</span></>
                        )}
                    </span>
                </Link>

                {/* Sign Up Form */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 transition-colors">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('auth.signUp.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">{t('auth.signUp.subtitle')}</p>

                    {success ? (
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl p-6 mb-6">
                            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="text-green-700 dark:text-green-400 font-semibold mb-2">{t('auth.signUp.success.title')}</h3>
                                    <p className="text-green-600 dark:text-green-300 text-sm mb-3">
                                        {t('auth.signUp.success.message')}
                                    </p>
                                    <p className="text-green-500 dark:text-green-400 text-xs">
                                        {t('auth.signUp.success.checkSpam')}
                                    </p>
                                </div>
                            </div>
                            <Link href="/login" className="block mt-6">
                                <button className="btn-primary w-full shadow-lg shadow-green-500/20">
                                    {t('auth.signUp.success.goToSignIn')}
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4">
                                    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                                    {t('auth.signUp.emailLabel')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.signUp.emailPlaceholder')}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${isRTL ? 'text-right' : ''}`}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                />
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                                    {t('auth.signUp.emailHelp')}
                                </p>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                                    {t('auth.signUp.passwordLabel')}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('auth.signUp.passwordPlaceholder')}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${isRTL ? 'text-right' : ''}`}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                                    {t('auth.signUp.confirmPasswordLabel')}
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t('auth.signUp.confirmPasswordPlaceholder')}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${isRTL ? 'text-right' : ''}`}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('auth.signUp.creatingAccount')}
                                    </span>
                                ) : (
                                    t('auth.signUp.submitBtn')
                                )}
                            </button>
                        </form>
                    )}

                    {/* Sign In Link */}
                    <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {t('auth.signUp.hasAccount')}{' '}
                            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-colors">
                                {t('auth.signUp.signInLink')}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        ← {t('auth.signUp.backToHome')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
