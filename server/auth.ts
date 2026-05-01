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
            sameSiteStrict: false,
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

    databaseHooks: {
        user: {
            create: {
                before: async (user, ctx) => {
                    const firstName = user.name?.split(" ")[0] ?? user.name
                    const generatedUsername = user?.name?.toLowerCase().replace(/\s+/g, "") ?? "user"
                    return {
                        data: {
                            ...user,
                            name: firstName,
                            username: (user as any).username ?? generatedUsername,
                            image: null,
                        },
                    };
                },
            },
        },
    },

    user: {
        additionalFields: {
            theme: {
                type: "string",
                required: false,
                defaultValue: "dark",
            },
            username: {
                type: "string",
                required: false,
            }
        }
    },

    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: ["http://localhost:5173", "https://games-d4rk.vercel.app"],
});