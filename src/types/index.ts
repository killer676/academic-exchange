export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
    phoneNumber: string | null;
    university: string;
    isVerifiedStudent: boolean;
    createdAt: Date;
    savedResourceIds?: string[]; // For bookmarks feature
}

export interface Resource {
    id: string;
    title: string;
    university: string;
    courseCode: string;
    type: 'summary' | 'past-exam' | 'notes' | 'project';
    description: string;
    link: string; // External Drive/OneDrive link
    fileUrl?: string; // UploadThing file URL (optional)
    fileName?: string; // Original file name for icon detection
    authorId: string;
    authorName: string;
    createdAt: Date;
    ratings?: { [userId: string]: number }; // For 5-star rating system
}

export interface Request {
    id: string;
    courseCode: string;
    description: string;
    university: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    isFulfilled: boolean;
    fulfilledBy?: string;
    fulfilledAt?: Date;
}

export interface Comment {
    id: string;
    text: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    createdAt: Date;
}

export interface ResourceFilters {
    university?: string;
    courseCode?: string;
    type?: string;
    searchQuery?: string;
}
