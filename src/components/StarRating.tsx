'use client';

import React from 'react';

interface StarRatingProps {
    /** Current user's rating (1-5) or 0 if not rated */
    userRating: number;
    /** Average rating from all users */
    averageRating: number;
    /** Total number of ratings */
    totalRatings: number;
    /** Callback when user clicks a star */
    onRate?: (rating: number) => void;
    /** Whether the component is read-only (no clicking) */
    readonly?: boolean;
    /** Whether a rating action is in progress */
    loading?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
    userRating,
    averageRating,
    totalRatings,
    onRate,
    readonly = false,
    loading = false,
    size = 'md',
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = React.useState(0);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const displayRating = hoverRating || userRating || averageRating;

    const handleClick = (rating: number) => {
        if (readonly || loading || !onRate) return;
        onRate(rating);
    };

    return (
        <div className="flex items-center gap-3">
            {/* Stars */}
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= displayRating;
                    const isHovered = !readonly && hoverRating > 0;
                    const isUserRated = userRating > 0;

                    return (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleClick(star)}
                            onMouseEnter={() => !readonly && setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            disabled={readonly || loading}
                            className={`transition-all ${readonly
                                    ? 'cursor-default'
                                    : loading
                                        ? 'cursor-wait opacity-50'
                                        : 'cursor-pointer hover:scale-110'
                                }`}
                            title={readonly ? '' : `Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                            <svg
                                className={`${sizeClasses[size]} transition-colors ${isFilled
                                        ? isHovered
                                            ? 'text-yellow-400'
                                            : isUserRated
                                                ? 'text-yellow-500'
                                                : 'text-yellow-400'
                                        : 'text-slate-300 dark:text-slate-600'
                                    }`}
                                fill={isFilled ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={isFilled ? 0 : 1.5}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                        </button>
                    );
                })}
            </div>

            {/* Rating Info */}
            <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-900 dark:text-white">
                    {averageRating > 0 ? averageRating.toFixed(1) : '—'}
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                    ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
                </span>
            </div>

            {/* User's rating indicator */}
            {userRating > 0 && !readonly && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full font-medium">
                    Your rating: {userRating}
                </span>
            )}
        </div>
    );
}
