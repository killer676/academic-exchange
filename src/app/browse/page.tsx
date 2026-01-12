'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Book, BookFilters } from '@/types';
import { UNIVERSITIES, MAJORS, BOOK_CONDITIONS, PRICE_RANGES } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function BrowsePage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<BookFilters>({});
    const { user } = useAuth();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const booksQuery = query(
                collection(db, 'books'),
                orderBy('createdAt', 'desc'),
                limit(50)
            );
            const snapshot = await getDocs(booksQuery);
            const booksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Book[];
            setBooks(booksData);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book => {
        if (filters.university && book.university !== filters.university) return false;
        if (filters.major && book.major !== filters.major) return false;
        if (filters.condition && book.condition !== filters.condition) return false;
        if (filters.priceRange) {
            if (book.price < filters.priceRange.min || book.price > filters.priceRange.max) return false;
        }
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            if (!book.title.toLowerCase().includes(query) &&
                !book.description.toLowerCase().includes(query)) return false;
        }
        return book.isAvailable;
    });

    const openWhatsApp = (phone: string, bookTitle: string) => {
        const message = encodeURIComponent(`Hi! I'm interested in buying "${bookTitle}" from Academic Exchange.`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Browse <span className="gradient-text">Textbooks</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Find the perfect textbook for your courses from verified students
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="glass rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Search by title or description..."
                                    value={filters.searchQuery || ''}
                                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                                />
                            </div>

                            {/* University Filter */}
                            <div className="relative">
                                <select
                                    value={filters.university || ''}
                                    onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-500 transition-all"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '20px'
                                    }}
                                >
                                    <option value="" className="bg-slate-900">All Universities</option>
                                    {UNIVERSITIES.map(uni => (
                                        <option key={uni.id} value={uni.id} className="bg-slate-900">{uni.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Major Filter */}
                            <div className="relative">
                                <select
                                    value={filters.major || ''}
                                    onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-500 transition-all"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '20px'
                                    }}
                                >
                                    <option value="" className="bg-slate-900">All Majors</option>
                                    {MAJORS.map(major => (
                                        <option key={major} value={major} className="bg-slate-900">{major}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Condition Filter */}
                            <div className="relative">
                                <select
                                    value={filters.condition || ''}
                                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-500 transition-all"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '20px'
                                    }}
                                >
                                    <option value="" className="bg-slate-900">Any Condition</option>
                                    {BOOK_CONDITIONS.map(cond => (
                                        <option key={cond.id} value={cond.id} className="bg-slate-900">{cond.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active Filters & Clear */}
                        {(filters.university || filters.major || filters.condition || filters.searchQuery) && (
                            <div className="mt-4 flex items-center gap-2 flex-wrap">
                                <span className="text-gray-400 text-sm">Active filters:</span>
                                {filters.university && (
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm flex items-center gap-2">
                                        {UNIVERSITIES.find(u => u.id === filters.university)?.name}
                                        <button onClick={() => setFilters({ ...filters, university: undefined })} className="hover:text-white">×</button>
                                    </span>
                                )}
                                {filters.major && (
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm flex items-center gap-2">
                                        {filters.major}
                                        <button onClick={() => setFilters({ ...filters, major: undefined })} className="hover:text-white">×</button>
                                    </span>
                                )}
                                {filters.condition && (
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm flex items-center gap-2">
                                        {BOOK_CONDITIONS.find(c => c.id === filters.condition)?.name}
                                        <button onClick={() => setFilters({ ...filters, condition: undefined })} className="hover:text-white">×</button>
                                    </span>
                                )}
                                <button
                                    onClick={() => setFilters({})}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium ml-2"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Results Count */}
                    <p className="text-gray-400 mb-6">
                        {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
                    </p>

                    {/* Books Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                                    <div className="bg-white/10 h-48 rounded-xl mb-4" />
                                    <div className="bg-white/10 h-6 rounded mb-2" />
                                    <div className="bg-white/10 h-4 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-white mb-2">No books found</h3>
                            <p className="text-gray-400 mb-6">Try adjusting your filters or check back later</p>
                            {user && (
                                <Link href="/sell" className="btn-primary inline-block">
                                    Be the first to list a book
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBooks.map((book) => (
                                <div key={book.id} className="feature-card group overflow-hidden">
                                    {/* Book Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4 overflow-hidden">
                                        {book.imageUrl ? (
                                            <Image
                                                src={book.imageUrl}
                                                alt={book.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Condition Badge */}
                                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full glass text-white text-xs font-semibold">
                                            {BOOK_CONDITIONS.find(c => c.id === book.condition)?.name}
                                        </div>
                                    </div>

                                    {/* Book Info */}
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{book.title}</h3>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{book.description}</p>

                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span>{UNIVERSITIES.find(u => u.id === book.university)?.name || book.university}</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                        <div>
                                            <div className="text-3xl font-bold gradient-text">{book.price} OMR</div>
                                        </div>
                                        <button
                                            onClick={() => openWhatsApp(book.sellerPhone, book.title)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full transition-all duration-300 group-hover:scale-105"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-147 3-.883-1.503-1.644-2.682-.78-1.179.859-1.815 1.449-2.03 1.649-.215.198-.353.224-.682.075-.33-.15-1.12-.413-2.13-1.315-.788-.7-1.319-1.564-1.473-1.862-.154-.298-.017-.461.13-.611.134-.133.297-.347.446-.521.149-.174.198-.297.298-.497.099-.198.049-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            <span className="text-sm font-semibold">WhatsApp</span>
                                        </button>
                                    </div>

                                    {/* Seller Info */}
                                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                                        {book.sellerPhotoURL ? (
                                            <Image
                                                src={book.sellerPhotoURL}
                                                alt={book.sellerName}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                                {book.sellerName.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white text-sm font-medium">{book.sellerName}</p>
                                            <p className="text-gray-500 text-xs">Seller</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA for non-logged-in users */}
                    {!user && !loading && (
                        <div className="mt-16 text-center glass rounded-2xl p-12">
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Want to sell your textbooks?
                            </h3>
                            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                                Sign in with your university email (.edu.om) to start listing your books and earning money
                            </p>
                            <Link href="/signup" className="btn-primary inline-block">
                                Get Started Free
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
