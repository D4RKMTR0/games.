import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    
    advanced: {
        useSecureCookies: true,
        crossSubdomainCookies: {
            enabled: true,
        },
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
        },
    },

    verification: {
        storeInDatabase: true,
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: ["http://localhost:5173", "https://games-d4rk.vercel.app"],
});