export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
    phoneNumber: string | null;
    university: string;
    isVerifiedStudent: boolean;
    createdAt: Date;
}

export interface Book {
    id: string;
    title: string;
    description: string;
    price: number; // in OMR
    condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
    university: string;
    major: string;
    imageUrl: string;
    sellerId: string;
    sellerName: string;
    sellerPhone: string;
    sellerPhotoURL: string | null;
    createdAt: Date;
    updatedAt: Date;
    isAvailable: boolean;
}

export interface BookFilters {
    university?: string;
    major?: string;
    condition?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    searchQuery?: string;
}
