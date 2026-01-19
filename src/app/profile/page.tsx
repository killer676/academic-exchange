'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, doc, deleteDoc, orderBy, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resource, Request } from '@/types';
import { UNIVERSITIES, RESOURCE_TYPES } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileTypeIcon } from '@/utils/fileIcons';

export default function ProfilePage() {
    // 👇 1. أضف هذه الدالة هنا
    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        // إذا كان Timestamp من فايربيس
        if (typeof date.toDate === 'function') {
            return date.toDate().toLocaleDateString('en-US');
        }
        // إذا كان Date عادي أو String
        return new Date(date).toLocaleDateString('en-US');
    };
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [myResources, setMyResources] = useState<Resource[]>([]);
    const [myRequests, setMyRequests] = useState<Request[]>([]);
    const [savedResources, setSavedResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'uploads' | 'requests' | 'saved'>('uploads');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchUserData();
        }
    }, [user, authLoading, router]);

    const fetchUserData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Fetch My Resources
            const resourcesQuery = query(
                collection(db, 'resources'),
                where('authorId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const resourcesSnapshot = await getDocs(resourcesQuery);
            const resourcesData = resourcesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Resource[];
            setMyResources(resourcesData);

            // Fetch My Requests
            const requestsQuery = query(
                collection(db, 'requests'),
                where('authorId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const requestsSnapshot = await getDocs(requestsQuery);
            const requestsData = requestsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Request[];
            setMyRequests(requestsData);

            // Fetch Saved Resources
            if (user.savedResourceIds && user.savedResourceIds.length > 0) {
                const savedPromises = user.savedResourceIds.map(async (resourceId: string) => {
                    try {
                        const resourceDoc = await getDoc(doc(db, 'resources', resourceId));
                        if (resourceDoc.exists()) {
                            return { id: resourceDoc.id, ...resourceDoc.data() } as Resource;
                        }
                        return null;
                    } catch {
                        return null;
                    }
                });
                const savedData = (await Promise.all(savedPromises)).filter((r): r is Resource => r !== null);
                setSavedResources(savedData);
            } else {
                setSavedResources([]);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResource = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this resource? This cannot be undone.')) {
            try {
                await deleteDoc(doc(db, 'resources', id));
                setMyResources(prev => prev.filter(item => item.id !== id));
            } catch (error) {
                console.error('Error deleting resource:', error);
                alert('Failed to delete resource');
            }
        }
    };

    const handleDeleteRequest = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this_request?')) {
            try {
                await deleteDoc(doc(db, 'requests', id));
                setMyRequests(prev => prev.filter(item => item.id !== id));
            } catch (error) {
                console.error('Error deleting request:', error);
                alert('Failed to delete request');
            }
        }
    };

    const getTypeBadge = (typeId: string) => {
        const type = RESOURCE_TYPES.find(t => t.id === typeId);
        return type ? { name: type.name, color: type.color } : { name: typeId, color: 'bg-gray-500/20 text-gray-400' };
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen gradient-bg text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="glass rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full ring-4 ring-purple-500/30 overflow-hidden bg-slate-200 dark:bg-slate-800">
                                {user.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt={user.displayName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-purple-600 to-blue-600">
                                        {user.displayName?.charAt(0) || 'S'}
                                    </div>
                                )}
                            </div>
                            {user.isVerifiedStudent && (
                                <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-sm" title="Verified Student">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">{user.displayName}</h1>
                            <div className="text-slate-500 dark:text-slate-400 mb-4 flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {UNIVERSITIES.find(u => u.id === user.university)?.name || user.university}
                                </span>
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {user.email}
                                </span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                            <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-4 text-center border border-slate-200 dark:border-white/10 min-w-[140px]">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{myResources.length}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Contributions</div>
                            </div>
                            <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-4 text-center border border-slate-200 dark:border-white/10 min-w-[140px]">
                                <div className="text-3xl font-bold text-orange-500 dark:text-orange-400 mb-1">{myRequests.filter(r => !r.isFulfilled).length}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">Active Requests</div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/10 mb-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('uploads')}
                            className={`pb-4 px-2 text-lg font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'uploads' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            My Uploads
                            {activeTab === 'uploads' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 dark:bg-purple-500 rounded-t-full"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`pb-4 px-2 text-lg font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'requests' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            My Requests
                            {activeTab === 'requests' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 dark:bg-purple-500 rounded-t-full"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`pb-4 px-2 text-lg font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'saved' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            Saved Resources
                            {activeTab === 'saved' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 dark:bg-purple-500 rounded-t-full"></div>
                            )}
                        </button>
                    </div>

                    {activeTab === 'uploads' && (
                        /* My Uploads Content */
                        myResources.length === 0 ? (
                            <div className="text-center py-20 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 border-dashed">
                                <svg className="w-20 h-20 text-slate-400 dark:text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No uploads yet</h3>
                                <p className="text-slate-500 dark:text-gray-400 mb-6">Start sharing your resources to help the community.</p>
                                <Link href="/share" className="btn-primary inline-flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Share Resource
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myResources.map((resource) => {
                                    const typeBadge = getTypeBadge(resource.type);
                                    return (
                                        <div key={resource.id} className="glass p-6 rounded-2xl group relative hover:border-purple-500/50 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeBadge.color}`}>
                                                    {typeBadge.name}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteResource(resource.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Resource"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <FileTypeIcon filename={resource.fileName || resource.fileUrl || resource.title} />
                                                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm font-bold">{resource.courseCode}</span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 line-clamp-1 text-slate-900 dark:text-white">{resource.title}</h3>
                                            <div className="text-slate-500 dark:text-gray-400 text-sm mb-4">
                                                {formatDate(resource.createdAt)}
                                            </div>
                                            <Link
                                                href={`/resources/${resource.id}`}
                                                className="block w-full text-center py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors text-sm font-semibold text-slate-700 dark:text-white"
                                            >
                                                View Resource
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}

                    {activeTab === 'requests' && (
                        /* My Requests Content */
                        myRequests.length === 0 ? (
                            <div className="text-center py-20 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 border-dashed">
                                <svg className="w-20 h-20 text-slate-400 dark:text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No active requests</h3>
                                <p className="text-slate-500 dark:text-gray-400 mb-6">Need something specific? Create a request for the community.</p>
                                <Link href="/requests" className="btn-primary inline-flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Request
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myRequests.map((request) => (
                                    <div key={request.id} className="glass p-6 rounded-2xl flex items-center justify-between group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold border border-orange-200 dark:border-orange-500/30">
                                                    {request.courseCode}
                                                </span>
                                                {request.isFulfilled && (
                                                    <span className="px-2 py-1 bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs font-bold flex items-center gap-1 border border-green-200 dark:border-green-500/30">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Fulfilled
                                                    </span>
                                                )}
                                                <span className="text-slate-500 dark:text-gray-500 text-xs">
                                                    {formatDate(request.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-lg font-medium text-slate-900 dark:text-white">{request.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteRequest(request.id)}
                                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Request"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {activeTab === 'saved' && (
                        /* Saved Resources Content */
                        savedResources.length === 0 ? (
                            <div className="text-center py-20 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 border-dashed">
                                <svg className="w-20 h-20 text-slate-400 dark:text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No saved resources</h3>
                                <p className="text-slate-500 dark:text-gray-400 mb-6">Save resources you find useful to access them quickly later.</p>
                                <Link href="/browse" className="btn-primary inline-flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Browse Resources
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedResources.map((resource) => {
                                    const typeBadge = getTypeBadge(resource.type);
                                    return (
                                        <div key={resource.id} className="glass p-6 rounded-2xl group relative hover:border-purple-500/50 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeBadge.color}`}>
                                                    {typeBadge.name}
                                                </span>
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <FileTypeIcon filename={resource.fileName || resource.fileUrl || resource.title} />
                                                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm font-bold">{resource.courseCode}</span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 line-clamp-1 text-slate-900 dark:text-white">{resource.title}</h3>
                                            <div className="text-slate-500 dark:text-gray-400 text-sm mb-4">
                                                {formatDate(resource.createdAt)}
                                            </div>
                                            <Link
                                                href={`/resources/${resource.id}`}
                                                className="block w-full text-center py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors text-sm font-semibold text-slate-700 dark:text-white"
                                            >
                                                View Resource
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
