import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    
    advanced: {
        useSecureCookies: true,
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            partitioned: true,
        },
    },

    verification: {
        storeInDatabase: true,
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await resend.emails.send({
            from: "noreply@games-d4rk-api.xyz",
            to: user.email,
            subject: "Reset your password",
            html: `
                <div style="background-color:#0a0a0a; padding:40px 20px; font-family:'Geist','Helvetica Neue',Arial,sans-serif;">
                    <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; background-color:#111214; border:1px solid #2a2a2e; border-radius:8px; overflow:hidden;">
                        <tr>
                            <td style="padding:32px;">
                                <p style="font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#6b6b70; margin:0 0 16px;">
                                Games. / D4RK
                                </p>
                                <h1 style="font-size:20px; font-weight:700; color:#f2f2f2; margin:0 0 12px;">
                                Reset your password
                                </h1>
                                <p style="font-size:14px; color:#a1a1a6; line-height:1.6; margin:0 0 24px;">
                                Click below to choose a new password. This link expires shortly for security.
                                </p>
                                <a href="${url}" style="display:inline-block; background-color:#3b6bd8; color:#ffffff; font-family:'Geist Mono',monospace; font-size:12px; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:12px 24px; border-radius:4px;">
                                Reset password
                                </a>
                                <p style="font-size:11px; color:#6b6b70; line-height:1.6; margin:24px 0 0;">
                                If you didn't request this, you can ignore this email.
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
            `,
            });
        },
    },

    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await resend.emails.send({
                from: "noreply@games-d4rk-api.xyz",
                to: user.email,
                subject: "Verify your email",
                html: `
                <div style="background-color:#0a0a0a; padding:40px 20px; font-family: 'Geist', 'Helvetica Neue', Arial, sans-serif;">
                    <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; background-color:#111214; border:1px solid #2a2a2e; border-radius:8px; overflow:hidden;">
                        <tr>
                            <td style="padding:32px;">
                            <p style="font-family:'Geist Mono', monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#6b6b70; margin:0 0 16px;">
                                Games. / D4RK
                            </p>
                            <h1 style="font-size:20px; font-weight:700; color:#f2f2f2; margin:0 0 12px;">
                                Verify your email
                            </h1>
                            <p style="font-size:14px; color:#a1a1a6; line-height:1.6; margin:0 0 24px;">
                                Hi ${user.name ?? "there"}, click below to confirm this is your email address.
                            </p>
                            <a href="${url}" style="display:inline-block; background-color:#3b6bd8; color:#ffffff; font-family:'Geist Mono', monospace; font-size:12px; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:12px 24px; border-radius:4px;">
                                Verify email
                            </a>
                            <p style="font-size:11px; color:#6b6b70; line-height:1.6; margin:24px 0 0;">
                                If you didn't create this account, you can ignore this email.
                            </p>
                            </td>
                        </tr>
                    </table>
                </div>
                `,
            });
            
        },
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
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