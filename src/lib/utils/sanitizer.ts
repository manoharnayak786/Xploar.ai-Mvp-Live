// src/lib/utils/sanitizer.ts

export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .trim();
}

export function sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';

    // Basic email validation and sanitization
    const sanitized = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(sanitized) ? sanitized : '';
}

export function sanitizePassword(password: string): boolean {
    if (!password || typeof password !== 'string') return false;

    // Check password strength
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength &&
           hasUpperCase &&
           hasLowerCase &&
           hasNumbers &&
           hasSpecialChar;
}

export function sanitizeSQL(input: string): string {
    if (!input || typeof input !== 'string') return '';

    // Basic SQL injection prevention
    return input
        .replace(/['"]/g, '')
        .replace(/;/g, '')
        .replace(/--/g, '')
        .replace(/\//g, '')
        .trim();
}

const sanitizer = {
    sanitizeInput,
    sanitizeEmail,
    sanitizePassword,
    sanitizeSQL
};

export default sanitizer;