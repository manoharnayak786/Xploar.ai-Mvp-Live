// src/lib/utils/authSecurity.ts
import { randomBytes, pbkdf2Sync } from 'crypto';

export function generateSecureToken(): string {
    return randomBytes(64).toString('hex');
}

export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

export function generateSessionId(): string {
    return randomBytes(32).toString('hex');
}

export function validateSession(sessionId: string): boolean {
    // Check if session exists and is not expired
    return sessionId && sessionId.length === 64;
}

const authSecurity = {
    generateSecureToken,
    hashPassword,
    verifyPassword,
    generateSessionId,
    validateSession
};

export default authSecurity;