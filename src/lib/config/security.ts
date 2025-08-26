// src/lib/config/security.ts

export const securityConfig = {
    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },

    // CORS configuration
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? ['https://xploar-web-5igf7haig-manoharnayakbarmavaths-projects.vercel.app']
            : ['http://localhost:3000'],
        credentials: true
    },

    // Session configuration
    session: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict'
    },

    // Password policy
    passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    },

    // Input validation
    inputLimits: {
        maxNameLength: 100,
        maxEmailLength: 254,
        maxPasswordLength: 128,
        maxTextLength: 10000
    }
};

export default securityConfig;