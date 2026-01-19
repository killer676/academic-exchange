'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot Password State
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState('');

    const { signIn, resetPassword } = useAuth();
    const { t, isRTL } = useLanguage();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            router.push('/browse');
        } catch (error: any) {
            if (error.message.includes('verify your email') || error.message.includes('clicking the link')) {
                setError(t('auth.signIn.errors.verifyEmail'));
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setError(t('auth.signIn.errors.invalidCredentials'));
            } else if (error.code === 'auth/invalid-credential') {
                setError(t('auth.signIn.errors.invalidCredentials'));
            } else if (error.code === 'auth/too-many-requests') {
                setError(t('auth.signIn.errors.tooManyAttempts'));
            } else {
                setError(error.message || t('auth.signIn.errors.generic'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError('');
        setResetLoading(true);

        try {
            await resetPassword(resetEmail);
            setResetSuccess(true);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                setResetError(t('auth.signIn.resetPassword.errors.userNotFound'));
            } else {
                setResetError(t('auth.signIn.resetPassword.errors.generic'));
            }
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <Link href="/" className={`flex items-center justify-center gap-3 mb-8 group ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">
                        {isRTL ? (
                            <>{t('common.appName')}</>
                        ) : (
                            <>UTA<span className="text-blue-600 dark:text-blue-400">Share</span></>
                        )}
                    </span>
                </Link>

                {/* Login Form */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 transition-colors">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('auth.signIn.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">{t('auth.signIn.subtitle')}</p>

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
                                {t('auth.signIn.emailLabel')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('auth.signIn.emailPlaceholder')}
                                required
                                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${isRTL ? 'text-right' : ''}`}
                                dir={isRTL ? 'rtl' : 'ltr'}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                                {t('auth.signIn.passwordLabel')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('auth.signIn.passwordPlaceholder')}
                                required
                                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${isRTL ? 'text-right' : ''}`}
                            />
                        </div>
                </div>

                {/* Forgot Password Link */}
                <div className={`flex justify-end ${isRTL ? 'justify-start' : ''}`}>
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                    >
                        {t('auth.signIn.forgotPassword')}
                    </button>
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
                            {t('auth.signIn.signingIn')}
                        </span>
                    ) : (
                        t('auth.signIn.submitBtn')
                    )}
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {t('auth.signIn.noAccount')}{' '}
                    <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-colors">
                        {t('auth.signIn.signUpLink')}
                    </Link>
                </p>
            </div>
        </div>

                {/* Back to Home */ }
    <div className="mt-6 text-center">
        <Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center justify-center gap-2">
            ← {t('auth.signIn.backToHome')}
        </Link>
    </div>
            </div >

        {/* Forgot Password Modal */ }
    {
        showForgotPassword && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('auth.signIn.resetPassword.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">{t('auth.signIn.resetPassword.subtitle')}</p>

                    {resetSuccess ? (
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl p-4 mb-6">
                            <p className="text-green-600 dark:text-green-400 text-center font-medium">
                                {t('auth.signIn.resetPassword.success')}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {resetError && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-3">
                                    <p className="text-red-600 dark:text-red-400 text-sm">{resetError}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">
                                    {t('auth.signIn.resetPassword.emailLabel')}
                                </label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder={t('auth.signIn.resetPassword.emailPlaceholder')}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${isRTL ? 'text-right' : ''}`}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="btn-primary w-full"
                            >
                                {resetLoading ? t('auth.signIn.resetPassword.sending') : t('auth.signIn.resetPassword.submitBtn')}
                            </button>
                        </form>
                    )}

                    <button
                        onClick={() => {
                            setShowForgotPassword(false);
                            setResetSuccess(false);
                            setResetError('');
                            setResetEmail('');
                        }}
                        className="mt-6 w-full py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium transition-colors"
                    >
                        {t('auth.signIn.resetPassword.backToSignIn')}
                    </button>
                </div>
            </div>
        )
    }
        </div >
    );
}
