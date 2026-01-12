'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

interface OpenLibraryBook {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    subject?: string[];
    ebook_access?: string;
}

const CATEGORIES = [
    { id: 'computer_science', name: 'Computer Science', query: 'computer programming' },
    { id: 'mathematics', name: 'Mathematics', query: 'mathematics' },
    { id: 'physics', name: 'Physics', query: 'physics' },
    { id: 'chemistry', name: 'Chemistry', query: 'chemistry' },
    { id: 'biology', name: 'Biology', query: 'biology' },
    { id: 'engineering', name: 'Engineering', query: 'engineering' },
    { id: 'business', name: 'Business', query: 'business administration' },
    { id: 'literature', name: 'Literature', query: 'literature' },
];

export default function LibraryPage() {
    const [books, setBooks] = useState<OpenLibraryBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        // Load initial books
        fetchBooks('textbooks free');
    }, []);

    const fetchBooks = async (query: string) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&has_fulltext=true&limit=24`
            );
            const data = await response.json();
            setBooks(data.docs || []);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchBooks(searchQuery);
        }
    };

    const handleCategoryClick = (query: string, categoryId: string) => {
        setSelectedCategory(categoryId);
        setSearchQuery('');
        fetchBooks(query);
    };

    const getCoverUrl = (coverId?: number) => {
        if (!coverId) return null;
        return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    };

    const getBookUrl = (key: string) => {
        return `https://openlibrary.org${key}`;
    };

    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-400 font-semibold text-sm">100% Free Resources</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Free <span className="gradient-text">Library</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Access thousands of free educational textbooks and resources from Open Library
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="glass rounded-2xl p-6 mb-8">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for free textbooks..."
                                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                            />
                            <button
                                type="submit"
                                className="btn-primary px-8"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Categories */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Browse by Subject</h2>
                        <div className="flex flex-wrap gap-3">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.query, category.id)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedCategory === category.id
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Books Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                                    <div className="bg-white/10 h-64 rounded-xl mb-4" />
                                    <div className="bg-white/10 h-6 rounded mb-2" />
                                    <div className="bg-white/10 h-4 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="text-2xl font-bold text-white mb-2">No books found</h3>
                            <p className="text-gray-400 mb-6">Try searching for something else</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-400 mb-6">
                                {books.length} free {books.length === 1 ? 'book' : 'books'} available
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {books.map((book) => (
                                    <Link
                                        key={book.key}
                                        href={getBookUrl(book.key)}
                                        target="_blank"
                                        className="feature-card group"
                                    >
                                        {/* Book Cover */}
                                        <div className="relative h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4 overflow-hidden">
                                            {getCoverUrl(book.cover_i) ? (
                                                <img
                                                    src={getCoverUrl(book.cover_i)!}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                            )}
                                            {book.ebook_access === 'public' && (
                                                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Free
                                                </div>
                                            )}
                                        </div>

                                        {/* Book Info */}
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                            {book.title}
                                        </h3>
                                        {book.author_name && (
                                            <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                                                by {book.author_name[0]}
                                            </p>
                                        )}
                                        {book.first_publish_year && (
                                            <p className="text-gray-500 text-xs mb-3">
                                                Published: {book.first_publish_year}
                                            </p>
                                        )}

                                        {/* Action */}
                                        <div className="pt-3 border-t border-white/10">
                                            <div className="flex items-center justify-between text-purple-400 group-hover:text-purple-300 transition-colors">
                                                <span className="text-sm font-semibold">Read Online</span>
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Info Section */}
                    <div className="mt-16 glass rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">About Open Library</h3>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Open Library is an open, editable library catalog, building towards a web page for every book ever published.
                            All books available here are free to read online and are in the public domain or have been made available by publishers.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://openlibrary.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            >
                                Visit Open Library →
                            </a>
                            <a
                                href="https://archive.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            >
                                Internet Archive →
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
