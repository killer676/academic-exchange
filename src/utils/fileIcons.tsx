'use client';

import React from 'react';

export interface FileIconInfo {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

/**
 * Returns icon component, color, and background color based on file extension
 */
export function getFileTypeIcon(filename: string): FileIconInfo {
    const extension = filename.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
        // PDF files - Red
        case 'pdf':
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-6 4h6" />
                    </svg>
                ),
                color: 'text-red-500',
                bgColor: 'bg-red-50 dark:bg-red-900/20',
            };

        // Word documents - Blue
        case 'doc':
        case 'docx':
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                ),
                color: 'text-blue-500',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            };

        // Images - Purple
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
        case 'svg':
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                ),
                color: 'text-purple-500',
                bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            };

        // PowerPoint - Orange
        case 'ppt':
        case 'pptx':
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h3a2 2 0 110 4H9V9z" />
                    </svg>
                ),
                color: 'text-orange-500',
                bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            };

        // Excel - Green
        case 'xls':
        case 'xlsx':
        case 'csv':
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                ),
                color: 'text-green-500',
                bgColor: 'bg-green-50 dark:bg-green-900/20',
            };

        // Default - Gray
        default:
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                ),
                color: 'text-slate-500 dark:text-slate-400',
                bgColor: 'bg-slate-100 dark:bg-slate-800',
            };
    }
}

/**
 * FileTypeIcon component for convenience
 */
export function FileTypeIcon({ filename, className = '' }: { filename: string; className?: string }) {
    const { icon, color, bgColor } = getFileTypeIcon(filename);

    return (
        <div className={`inline-flex items-center justify-center p-2 rounded-lg ${bgColor} ${color} ${className}`}>
            {icon}
        </div>
    );
}
