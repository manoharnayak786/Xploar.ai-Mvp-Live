// src/middleware/rateLimit.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting (use Redis in production)
const requests = new Map();

export function rateLimit(request: NextRequest) {
    const ip = request.ip || 'anonymous';
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    const maxRequests = 100; // Max requests per minute

    if (!requests.has(ip)) {
        requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
        );
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);

    return NextResponse.next();
}

export default rateLimit;