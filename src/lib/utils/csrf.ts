// src/lib/utils/csrf.ts
import { randomBytes } from 'crypto';

export function generateCSRFToken(): string {
    return randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
    if (!token || !sessionToken) return false;
    return token === sessionToken;
}

export function createCSRFTokenCookie(): string {
    const token = generateCSRFToken();
    return `csrf-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`;
}

export default {
    generateCSRFToken,
    validateCSRFToken,
    createCSRFTokenCookie
};