import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false 
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
        },
    },

    trustedOrigins: ["http://localhost:5173", "https://games-d4rk.vercel.app"],
});