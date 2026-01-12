'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Book } from '@/types';
import { UNIVERSITIES } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [myListings, setMyListings] = useState<Book[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        displayName: '',
        phoneNumber: '',
        university: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        } else if (user) {
            setEditForm({
                displayName: user.displayName || '',
                phoneNumber: user.phoneNumber || '',
                university: user.university || '',
            });
            fetchMyListings();
        }
    }, [user, authLoading, router]);

    const fetchMyListings = async () => {
        if (!user) return;

        try {
            const q = query(
                collection(db, 'books'),
                where('sellerId', '==', user.uid)
            );
            const snapshot = await getDocs(q);
            const books = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Book[];
            setMyListings(books);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                displayName: editForm.displayName,
                phoneNumber: editForm.phoneNumber,
                university: editForm.university,
            });
            alert('Profile updated successfully!');
            setIsEditing(false);
            window.location.reload(); // Reload to get updated data
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="glass rounded-3xl p-8 md:p-12 mb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Profile Picture */}
                            <div className="relative">
                                {user.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt={user.displayName}
                                        width={120}
                                        height={120}
                                        className="rounded-full ring-4 ring-purple-500/50"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold ring-4 ring-purple-500/50">
                                        {user.displayName?.charAt(0) || 'U'}
                                    </div>
                                )}
                                {user.isVerifiedStudent && (
                                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-slate-900">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-gray-400 text-sm mb-2 block">Display Name</label>
                                            <input
                                                type="text"
                                                value={editForm.displayName}
                                                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                                                className="w-full max-w-md px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-400 text-sm mb-2 block">Phone Number (for WhatsApp)</label>
                                            <input
                                                type="tel"
                                                value={editForm.phoneNumber}
                                                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                                placeholder="e.g., +96891234567"
                                                className="w-full max-w-md px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-400 text-sm mb-2 block">University</label>
                                            <select
                                                value={editForm.university}
                                                onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                                                className="w-full max-w-md px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                                            >
                                                <option value="" className="bg-slate-900">Select University</option>
                                                {UNIVERSITIES.map(uni => (
                                                    <option key={uni.id} value={uni.id} className="bg-slate-900">{uni.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleUpdateProfile}
                                                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-all"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                                            <h1 className="text-3xl md:text-4xl font-bold text-white">{user.displayName}</h1>
                                            {user.isVerifiedStudent && (
                                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                                                    Verified Student
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 mb-4">{user.email}</p>

                                        <div className="space-y-2 mb-6">
                                            {user.university && (
                                                <div className="flex items-center gap-2 text-gray-300 justify-center md:justify-start">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <span>{UNIVERSITIES.find(u => u.id === user.university)?.name || user.university}</span>
                                                </div>
                                            )}
                                            {user.phoneNumber && (
                                                <div className="flex items-center gap-2 text-gray-300 justify-center md:justify-start">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span>{user.phoneNumber}</span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn-primary text-sm"
                                        >
                                            Edit Profile
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 md:gap-6 md:flex-col">
                                <div className="text-center">
                                    <div className="text-3xl font-bold gradient-text">{myListings.length}</div>
                                    <div className="text-gray-400 text-sm">Listings</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold gradient-text">{myListings.filter(b => b.isAvailable).length}</div>
                                    <div className="text-gray-400 text-sm">Active</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* My Listings */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-white">My Listings</h2>
                            <Link href="/sell" className="btn-primary text-sm">
                                + New Listing
                            </Link>
                        </div>

                        {myListings.length === 0 ? (
                            <div className="glass rounded-2xl p-16 text-center">
                                <svg className="w-20 h-20 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="text-2xl font-bold text-white mb-2">No listings yet</h3>
                                <p className="text-gray-400 mb-6">Start selling your textbooks to help fellow students</p>
                                <Link href="/sell" className="btn-primary inline-block">
                                    Create Your First Listing
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myListings.map(book => (
                                    <div key={book.id} className="feature-card">
                                        <div className="relative h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4">
                                            {book.imageUrl && (
                                                <Image
                                                    src={book.imageUrl}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover rounded-xl"
                                                />
                                            )}
                                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${book.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {book.isAvailable ? 'Active' : 'Sold'}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{book.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{book.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-bold gradient-text">{book.price} OMR</div>
                                            <button className="text-gray-400 hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
