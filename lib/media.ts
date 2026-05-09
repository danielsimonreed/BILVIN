export const runWhenIdle = (callback: () => void, timeout = 1500): (() => void) => {
    if (typeof window === 'undefined') {
        callback();
        return () => undefined;
    }

    if ('requestIdleCallback' in window) {
        const idleId = window.requestIdleCallback(callback, { timeout });
        return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(callback, 1);
    return () => globalThis.clearTimeout(timeoutId);
};

export const prefetchAudio = (src: string): HTMLAudioElement | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = src;
    audio.load();
    return audio;
};
