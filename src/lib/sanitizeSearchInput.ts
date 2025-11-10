export const sanitizeSearchInput = (input: string): string => {
    // Keep only alphanumeric characters and whitespace
    return input.replace(/[^a-zA-Z0-9\s]/g, "");
};

export const token = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null : null;