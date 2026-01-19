'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resource, Comment, User } from '@/types';
import { UNIVERSITIES, RESOURCE_TYPES } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { FileTypeIcon } from '@/utils/fileIcons';
import StarRating from '@/components/StarRating';

export default function ResourceDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const { user } = useAuth();
    const { isRTL } = useLanguage();

    const [resource, setResource] = useState<Resource | null>(null);
    const [author, setAuthor] = useState<User | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savingBookmark, setSavingBookmark] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [savingRating, setSavingRating] = useState(false);



    const handleShare = () => {
        const text = `Check out this resource: ${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const docRef = doc(db, 'resources', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Resource;
                    setResource({ ...data, id: docSnap.id });

                    // Set user's existing rating if any
                    if (data.ratings && user) {
                        setUserRating(data.ratings[user.uid] || 0);
                    }

                    // Fetch author details
                    if (data.authorId) {
                        try {
                            const authorRef = doc(db, 'users', data.authorId);
                            const authorSnap = await getDoc(authorRef);
                            if (authorSnap.exists()) {
                                setAuthor(authorSnap.data() as User);
                            }
                        } catch (err) {
                            console.error('Error fetching author:', err);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching resource:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResource();

        // Realtime listener for comments
        const commentsQuery = query(
            collection(db, `resources/${id}/comments`),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Comment[];
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [id]);

    // Fetch bookmark status
    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            if (!user) {
                setIsSaved(false);
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsSaved((userData.savedResourceIds || []).includes(id));
                }
            } catch (error) {
                console.error('Error fetching bookmark status:', error);
            }
        };
        fetchBookmarkStatus();
    }, [user, id]);

    // Toggle bookmark
    const toggleBookmark = async () => {
        if (!user) return;
        setSavingBookmark(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            if (isSaved) {
                await updateDoc(userRef, {
                    savedResourceIds: arrayRemove(id)
                });
                setIsSaved(false);
            } else {
                await updateDoc(userRef, {
                    savedResourceIds: arrayUnion(id)
                });
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        } finally {
            setSavingBookmark(false);
        }
    };

    // Handle rating submission
    const handleRating = async (rating: number) => {
        if (!user || !resource) return;
        setSavingRating(true);
        try {
            const resourceRef = doc(db, 'resources', id);
            await updateDoc(resourceRef, {
                [`ratings.${user.uid}`]: rating
            });
            setUserRating(rating);
            // Update local resource state with new rating
            setResource(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    ratings: {
                        ...(prev.ratings || {}),
                        [user.uid]: rating
                    }
                };
            });
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setSavingRating(false);
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setSubmittingComment(true);
        try {
            await addDoc(collection(db, `resources/${id}/comments`), {
                text: newComment.trim(),
                userId: user.uid,
                userName: user.displayName || 'User',
                userAvatar: user.photoURL || null,
                createdAt: serverTimestamp(),
            });
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    // Delete own comment
    const handleDeleteComment = async (commentId: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, `resources/${id}/comments`, commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    const getTypeBadge = (typeId: string) => {
        const type = RESOURCE_TYPES.find(t => t.id === typeId);
        return type ? { name: type.name, color: type.color } : { name: typeId, color: 'bg-gray-500/20 text-gray-400' };
    };

    const getUniversityName = (id: string) => {
        return UNIVERSITIES.find(u => u.id === id)?.name || id;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-slate-900">
                    <h1 className="text-3xl font-bold mb-4">Resource not found</h1>
                    <Link href="/browse" className="btn-primary">Back to Browse</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const typeBadge = getTypeBadge(resource.type);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-8 text-sm">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/browse" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Browse</Link>
                        <span>/</span>
                        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">{resource.title}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-4 py-2 rounded-xl font-bold ${typeBadge.color}`}>
                                        {typeBadge.name}
                                    </span>
                                    <span className="text-sm text-slate-400">
                                        {new Date((resource.createdAt as any)?.toDate ? (resource.createdAt as any).toDate() : resource.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-start gap-4 mb-4">
                                    <FileTypeIcon filename={resource.fileName || resource.fileUrl || resource.link || resource.title} className="flex-shrink-0 mt-2" />
                                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white flex-1">
                                        {resource.title}
                                    </h1>
                                    {user && (
                                        <button
                                            onClick={toggleBookmark}
                                            disabled={savingBookmark}
                                            className={`p-3 rounded-xl transition-all flex-shrink-0 ${isSaved
                                                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                                : 'text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-slate-200 dark:border-slate-700'
                                                } ${savingBookmark ? 'opacity-50' : ''}`}
                                            title={isSaved ? (isRTL ? 'إزالة من المحفوظات' : 'Remove from saved') : (isRTL ? 'حفظ لاحقاً' : 'Save for later')}
                                        >
                                            {isSaved ? (
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-4 mb-8">
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="font-medium">{getUniversityName(resource.university)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                        <span className="text-blue-500 font-bold">#</span>
                                        <span className="font-medium">{resource.courseCode}</span>
                                    </div>
                                </div>

                                {/* Star Rating */}
                                <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                                        {isRTL ? 'تقييم المورد' : 'Rate this Resource'}
                                    </h3>
                                    <StarRating
                                        userRating={userRating}
                                        averageRating={
                                            resource.ratings
                                                ? Object.values(resource.ratings).reduce((a, b) => a + b, 0) / Object.values(resource.ratings).length
                                                : 0
                                        }
                                        totalRatings={resource.ratings ? Object.keys(resource.ratings).length : 0}
                                        onRate={handleRating}
                                        readonly={!user}
                                        loading={savingRating}
                                        size="lg"
                                    />
                                    {!user && (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                            {isRTL ? 'سجل دخولك لتقييم هذا المورد' : 'Sign in to rate this resource'}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 py-6 border-t border-b border-slate-100 dark:border-slate-800 mb-8">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        {author?.photoURL ? (
                                            <Image
                                                src={author.photoURL}
                                                alt={author.displayName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                {author?.displayName?.charAt(0) || resource.authorName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Shared by</div>
                                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {author?.displayName || resource.authorName}
                                            {author?.isVerifiedStudent && (
                                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Description</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-8">
                                    {resource.description}
                                </p>

                                <a
                                    href={resource.fileUrl || resource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full md:w-auto text-lg px-12 py-4 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:shadow-blue-500/30"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    {resource.fileUrl ? 'Download File' : 'Open Link'}
                                </a>

                                {/* Share Section */}
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        Share this resource
                                    </h3>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleShare}
                                            className="flex-1 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all group"
                                        >
                                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            WhatsApp
                                        </button>
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all hover:text-slate-900 dark:hover:text-white"
                                        >
                                            {copied ? (
                                                <>
                                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-green-600 dark:text-green-400">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Discussion */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 h-full flex flex-col shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                    Discussion
                                </h3>

                                <div className="flex-1 overflow-y-auto max-h-[500px] space-y-4 mb-6 pr-2">
                                    {comments.length === 0 ? (
                                        <div className="text-center py-10 text-slate-400">
                                            No comments yet. Be the first to ask a question!
                                        </div>
                                    ) : (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                                                        {comment.userAvatar ? (
                                                            <Image
                                                                src={comment.userAvatar}
                                                                alt={comment.userName}
                                                                width={32}
                                                                height={32}
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold">
                                                                {comment.userName.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-slate-900 dark:text-white">{comment.userName}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            {(comment.createdAt as any)?.toDate
                                                                ? (comment.createdAt as any).toDate().toLocaleDateString()
                                                                : 'Just now'}
                                                        </div>
                                                    </div>
                                                    {user && user.uid === comment.userId && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                            title={isRTL ? 'حذف التعليق' : 'Delete comment'}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 text-sm ml-11">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {user ? (
                                    <form onSubmit={handlePostComment} className="mt-auto">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Ask a question or say thanks..."
                                            rows={2}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none text-sm mb-3 transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submittingComment || !newComment.trim()}
                                            className="w-full btn-primary py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submittingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-100 dark:border-slate-700">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Sign in to join the discussion</p>
                                        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-colors">
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
