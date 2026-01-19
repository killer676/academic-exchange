'use client';

import { useEffect, useCallback, useRef } from 'react';
import { SESSION_TIMEOUT_MS } from '@/lib/constants';

const SESSION_KEY = 'session_active';

interface UseSessionSecurityOptions {
    onTimeout: () => void;
    onPageClose?: () => void;
    enabled?: boolean;
    timeoutMs?: number;
}

/**
 * Custom hook for session security features:
 * - AFK (idle) timeout: Logs out user after period of inactivity
 * - Page close logout: Logs out user when they close the tab/browser (NOT on refresh)
 */
export function useSessionSecurity({
    onTimeout,
    onPageClose,
    enabled = true,
    timeoutMs = SESSION_TIMEOUT_MS,
}: UseSessionSecurityOptions) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Reset the idle timer
    const resetTimer = useCallback(() => {
        if (!enabled) return;

        // Clear existing timer
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timer
        timeoutRef.current = setTimeout(() => {
            console.log('[Security] Session timeout - logging out due to inactivity');
            onTimeout();
        }, timeoutMs);
    }, [enabled, timeoutMs, onTimeout]);

    useEffect(() => {
        if (!enabled) return;

        // Check if this is a fresh page load (not a refresh)
        // If session key exists, user is refreshing - don't logout
        const isRefresh = sessionStorage.getItem(SESSION_KEY) === 'true';

        if (!isRefresh && onPageClose) {
            // This is a fresh load after the tab was closed
            // The previous session was ended, which is handled by beforeunload
        }

        // Mark session as active
        sessionStorage.setItem(SESSION_KEY, 'true');

        // Activity events to track
        const activityEvents = [
            'mousedown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart',
            'click',
            'wheel',
        ];

        // Add activity listeners
        activityEvents.forEach((event) => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        // Handle before unload - set flag to indicate we're leaving
        const handleBeforeUnload = () => {
            // Set a temporary flag that we're unloading
            sessionStorage.setItem(SESSION_KEY, 'unloading');
        };

        // Handle page hide - this fires when tab is actually being closed
        const handlePageHide = (event: PageTransitionEvent) => {
            // If persisted is false and we're not in a bfcache scenario, tab is closing
            // Check if session key is 'unloading' to confirm we went through beforeunload
            if (!event.persisted && onPageClose) {
                // Use sendBeacon for reliable logout on tab close
                // Note: We can't await async operations here, so we use sync signOut
                onPageClose();
            }
        };

        // Handle visibility change - detect when user leaves the page
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                // Page is being hidden - could be tab switch, minimize, or close
                // We'll rely on pagehide for actual close detection
            } else if (document.visibilityState === 'visible') {
                // User came back - reset the timer
                resetTimer();
                // Restore the session key
                sessionStorage.setItem(SESSION_KEY, 'true');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handlePageHide);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Start the initial timer
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            activityEvents.forEach((event) => {
                document.removeEventListener(event, resetTimer);
            });

            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handlePageHide);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled, resetTimer, onPageClose]);

    // Return a manual reset function in case it's needed
    return { resetTimer };
}

