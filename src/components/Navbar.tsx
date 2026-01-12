'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, loading, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/20'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
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
                        <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                            Academic<span className="text-purple-400">Exchange</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/browse"
                            className="text-gray-300 hover:text-white transition-colors font-medium"
                        >
                            Browse Books
                        </Link>
                        <Link
                            href="/library"
                            className="text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-1"
                        >
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Free Library
                        </Link>
                        {user && (
                            <Link
                                href="/sell"
                                className="text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                Sell a Book
                            </Link>
                        )}
                        <Link
                            href="/#how-it-works"
                            className="text-gray-300 hover:text-white transition-colors font-medium"
                        >
                            How It Works
                        </Link>
                    </div>

                    {/* CTA Buttons / User Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-white/10 transition-all"
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
                                    <span className="text-white font-medium hidden lg:block">{user.displayName}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-white font-semibold">{user.displayName}</p>
                                            <p className="text-gray-400 text-sm truncate">{user.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/my-listings"
                                                className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                My Listings
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white transition-colors font-medium px-4 py-2"
                                >
                                    Sign In
                                </Link>
                                <Link href="/signup" className="btn-primary text-sm">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/browse"
                                className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Browse Books
                            </Link>
                            <Link
                                href="/library"
                                className="text-gray-300 hover:text-white transition-colors font-medium py-2 flex items-center gap-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Free Library
                            </Link>
                            {user && (
                                <Link
                                    href="/sell"
                                    className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sell a Book
                                </Link>
                            )}
                            <Link
                                href="/#how-it-works"
                                className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                How It Works
                            </Link>
                            <hr className="border-white/10" />
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/my-listings"
                                        className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Listings
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-left text-red-400 hover:text-red-300 transition-colors font-medium py-2"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="btn-primary text-center text-sm"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
