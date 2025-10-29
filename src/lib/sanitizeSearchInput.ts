export const sanitizeSearchInput = (input: string): string => {
    // Keep only alphanumeric characters and whitespace
    return input.replace(/[^a-zA-Z0-9\s]/g, "");
};