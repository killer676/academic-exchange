'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Book } from '@/types';
import { BOOK_CONDITIONS } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function BookDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchBook();
        }
    }, [params.id]);

    const fetchBook = async () => {
        try {
            const bookDoc = await getDoc(doc(db, 'books', params.id as string));
            if (bookDoc.exists()) {
                const data = bookDoc.data();
                setBook({
                    id: bookDoc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Book);
            } else {
                router.push('/browse');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching book:', error);
            setLoading(false);
        }
    };

    const handleWhatsAppClick = () => {
        if (!book) return;
        const message = encodeURIComponent(
            `Hi! I'm interested in your book "${book.title}" listed for ${book.price} OMR on Academic Exchange.`
        );
        window.open(getWhatsAppUrl(book.sellerPhone, message), '_blank');
    };

    if (loading) {
        return (
            <main className="min-h-screen gradient-bg text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </main>
        );
    }

    if (!book) {
        return (
            <main className="min-h-screen gradient-bg text-white">
                <Navbar />
                <div className="pt-32 pb-16 text-center">
                    <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
                    <Link href="/browse" className="btn-primary inline-block">
                        Browse Books
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const condition = BOOK_CONDITIONS.find((c) => c.id === book.condition);

    return (
        <main className="min-h-screen gradient-bg text-white">
            <Navbar />

            <div className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Browse
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Book Image */}
                        <div className="relative">
                            <div className="relative w-full aspect-[3/4] bg-slate-800 rounded-2xl overflow-hidden border border-white/10">
                                {book.imageUrl ? (
                                    <Image
                                        src={book.imageUrl}
                                        alt={book.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                        <svg
                                            className="w-24 h-24 text-gray-400"
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
                                )}
                            </div>
                        </div>

                        {/* Book Details */}
                        <div className="space-y-6">
                            {/* Title and Price */}
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold mb-4">{book.title}</h1>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-3xl font-bold text-purple-400">
                                        {book.price} <span className="text-xl text-gray-400">OMR</span>
                                    </div>
                                    {!book.isAvailable && (
                                        <span className="px-4 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 font-semibold">
                                            Sold
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Condition Badge */}
                            <div className="flex items-center gap-2">
                                <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-300 font-semibold">
                                    {condition?.name || book.condition}
                                </span>
                                {condition?.description && (
                                    <span className="text-gray-400 text-sm">({condition.description})</span>
                                )}
                            </div>

                            {/* Book Info */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="text-gray-300"><strong className="text-white">University:</strong> {book.university}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span className="text-gray-300"><strong className="text-white">Major:</strong> {book.major}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-300">
                                        <strong className="text-white">Listed:</strong>{' '}
                                        {book.createdAt.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Description</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{book.description}</p>
                            </div>

                            {/* Seller Info */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4">Seller Information</h3>
                                <div className="flex items-center gap-4">
                                    {book.sellerPhotoURL ? (
                                        <Image
                                            src={book.sellerPhotoURL}
                                            alt={book.sellerName}
                                            width={60}
                                            height={60}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-15 h-15 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                                            {book.sellerName[0]?.toUpperCase() || 'S'}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-white">{book.sellerName}</p>
                                        <p className="text-sm text-gray-400">Verified Student</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {book.isAvailable && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleWhatsAppClick}
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold text-lg"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Chat on WhatsApp
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
