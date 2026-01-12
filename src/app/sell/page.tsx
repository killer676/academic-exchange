'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { storage, db, auth } from '@/lib/firebase';
import { UNIVERSITIES, MAJORS, BOOK_CONDITIONS } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SellPage() {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        university: '',
        major: '',
        condition: '',
        phoneNumber: '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    if (loading) {
        return (
            <main className="min-h-screen gradient-bg text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </main>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            setSelectedFile(file);
            setError(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setUploading(true);

        try {
            // Validate form
            if (!formData.title.trim()) {
                throw new Error('Title is required');
            }
            if (!formData.description.trim()) {
                throw new Error('Description is required');
            }
            if (!formData.price || parseFloat(formData.price) <= 0) {
                throw new Error('Valid price is required');
            }
            if (!formData.university) {
                throw new Error('University is required');
            }
            if (!formData.major) {
                throw new Error('Major is required');
            }
            if (!formData.condition) {
                throw new Error('Condition is required');
            }
            if (!formData.phoneNumber.trim()) {
                throw new Error('Phone number is required for WhatsApp contact');
            }
            if (!selectedFile) {
                throw new Error('Please upload a book photo');
            }

            // Upload image to Firebase Storage
            const imageRef = ref(storage, `books/${user.uid}/${Date.now()}_${selectedFile.name}`);
            await uploadBytes(imageRef, selectedFile);
            const imageUrl = await getDownloadURL(imageRef);

            // Save book data to Firestore
            const bookData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                university: formData.university,
                major: formData.major,
                condition: formData.condition,
                imageUrl,
                sellerId: user.uid,
                sellerName: user.displayName || 'Student',
                sellerPhone: formData.phoneNumber.trim(),
                sellerPhotoURL: user.photoURL,
                isAvailable: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'books'), bookData);

            // Redirect to browse page
            router.push('/browse');
        } catch (err: any) {
            console.error('Error submitting listing:', err);
            setError(err.message || 'Failed to create listing. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <main className="min-h-screen gradient-bg text-white">
            <Navbar />

            <div className="pt-24 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            List a <span className="gradient-text">Book</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Share your textbook with other students and help them save money
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        {/* Photo Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                Book Photo <span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-col items-center justify-center w-full">
                                {previewUrl ? (
                                    <div className="relative w-full max-w-md mb-4">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-64 object-cover rounded-lg border border-white/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewUrl(null);
                                                setSelectedFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-12 h-12 mb-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
                                Book Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                placeholder="e.g., Introduction to Algorithms"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
                                Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                                placeholder="Describe the book's condition, edition, any highlights or notes..."
                                required
                            />
                        </div>

                        {/* Price and Condition */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Price (OMR) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    step="0.1"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="condition" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Condition <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="condition"
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer hover:bg-slate-700 transition-colors"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    required
                                >
                                    <option value="" className="bg-slate-800 text-white">Select condition</option>
                                    {BOOK_CONDITIONS.map((cond) => (
                                        <option key={cond.id} value={cond.id} className="bg-slate-800 text-white">
                                            {cond.name} - {cond.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* University and Major */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="university" className="block text-sm font-semibold text-gray-300 mb-2">
                                    University <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="university"
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer hover:bg-slate-700 transition-colors"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    required
                                >
                                    <option value="" className="bg-slate-800 text-white">Select university</option>
                                    {UNIVERSITIES.map((uni) => (
                                        <option key={uni.id} value={uni.name} className="bg-slate-800 text-white">
                                            {uni.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="major" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Major <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="major"
                                    value={formData.major}
                                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer hover:bg-slate-700 transition-colors"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    required
                                >
                                    <option value="" className="bg-slate-800 text-white">Select major</option>
                                    {MAJORS.map((major) => (
                                        <option key={major} value={major} className="bg-slate-800 text-white">
                                            {major}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="mb-6">
                            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-300 mb-2">
                                Phone Number (for WhatsApp) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                placeholder="e.g., 96812345678"
                                required
                            />
                            <p className="mt-2 text-xs text-gray-400">
                                Include country code (968 for Oman). Buyers will contact you via WhatsApp using this number.
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
                                {uploading ? 'Creating Listing...' : 'Create Listing'}
                            </button>
                            <Link
                                href="/browse"
                                className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}
