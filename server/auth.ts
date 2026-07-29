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
            from: "Games <noreply@games-d4rk-api.xyz>",
            replyTo: "support@games-d4rk-api.xyz",
            to: user.email,
            subject: "Reset your password",
            text: `
                Hi ${user.name ?? "there"},

                Someone is attempting to reset the password for your account. If this was you, please visit the link below to choose a new password:

                ${url}

                If you didn't request a password reset, you can safely ignore this letter. No further action is required and your password will remain unchanged.

                Sincerely,
                Games. Team (d4rk)`,
            html: `
                <div style="background-color:#0a0a0a; padding:40px 20px; font-family:'Geist', 'Helvetica Neue', Arial, sans-serif;">
                    <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; background-color:#111214; border:1px solid #2a2a2e; overflow:hidden;">
                        <tr>
                            <td style="padding:32px;">
                                <p style="font-family:'Geist Mono', monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#6b6b70; margin:0 0 16px;">
                                <span style="color:#ffffff;">Games.</span> / d4rk
                                </p>
                                <h1 style="font-size:20px; font-weight:700; color:#f2f2f2; margin:0 0 12px;">
                                Reset your password
                                </h1>
                                <p style="font-size:14px; color:#a1a1a6; line-height:1.6; margin:0 0 16px;">
                                Hi ${user.name ?? "there"},
                                </p>
                                <p style="font-size:14px; color:#a1a1a6; line-height:1.6; margin:0 0 24px;">
                                Someone is attempting to reset the password for your account. If this was you, please click the button below to choose a new password:
                                </p>
                                <div style="margin:0 0 24px;">
                                <a href="${url}" style="display:inline-block; background-color:#ffffff; color:#090909; font-family:'Geist Mono', monospace; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:12px 24px;">
                                    Reset password
                                </a>
                                </div>
                                <p style="font-size:12px; color:#88888d; line-height:1.6; margin:0 0 12px;">
                                Having trouble clicking the button? Copy and paste this link into your web browser:
                                </p>
                                <p style="font-family:'Geist Mono', monospace; font-size:11px; color:#3b6bd8; word-break:break-all; margin:0 0 24px; padding:12px; background-color:#0a0a0a; border:1px solid #1a1a1e;">
                                ${url}
                                </p>
                                <hr style="border:none; border-top:1px solid #2a2a2e; margin:24px 0;" />
                                <p style="font-size:12px; color:#a1a1a6; line-height:1.6; margin:0 0 16px;">
                                If you didn't request a password reset, you can safely ignore this letter. No further action is required and your password will remain unchanged.
                                </p>
                                <p style="font-size:12px; color:#6b6b70; line-height:1.6; margin:16px 0 0;">
                                Sincerely,<br />
                                <strong style="color:#a1a1a6;">Games. Team (d4rk)</strong>
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
                from: "Games <noreply@games-d4rk-api.xyz>",
                replyTo: "support@games-d4rk-api.xyz",
                to: user.email,
                subject: "Verify your email",
                text: `
                    Hi ${user.name ?? "there"},

                    Someone is attempting to verify your account. If this was you, please visit the link below to confirm your email address and complete registration:

                    ${url}

                    If you didn't attempt to sign up or verify an account, you can safely ignore this letter. No further action is required and your email address will not be accessible unless verified.

                    Sincerely,
                    Games. Team (d4rk)
                `,
                html: `
                    <div style="background-color:#0a0a0a; padding:40px 20px; font-family:'Geist', 'Helvetica Neue', Arial, sans-serif;">
                        <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; background-color:#111214; border:1px solid #2a2a2e; overflow:hidden;">
                            <tr>
                            <td style="padding:32px;">
                                <p style="font-family:'Geist Mono', monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#6b6b70; margin:0 0 16px;">
                                <span style="color:#ffffff;">Games.</span> / d4rk
                                </p>
                                <h1 style="font-size:20px; font-weight:700; color:#f2f2f2; margin:0 0 12px;">
                                Verify your email address
                                </h1>
                                <p style="font-size:14px; color:#a1a1a6; line-height:1.6; margin:0 0 16px;">
                                Hi ${user.name ?? "there"},
                                </p>
                                <p style="font-size:14px; color:#a1a1a6; line-height:1.6; margin:0 0 24px;">
                                Someone is attempting to verify your account. If this was you, please click the button below to confirm your email address and complete registration:
                                </p>
                                <div style="margin:0 0 24px;">
                                <a href="${url}" style="display:inline-block; background-color:#ffffff; color:#090909; font-family:'Geist Mono', monospace; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:12px 24px;">
                                    Verify email address
                                </a>
                                </div>
                                <p style="font-size:12px; color:#88888d; line-height:1.6; margin:0 0 12px;">
                                Having trouble clicking the button? Copy and paste this link into your web browser:
                                </p>
                                <p style="font-family:'Geist Mono', monospace; font-size:11px; color:#3b6bd8; word-break:break-all; margin:0 0 24px; padding:12px; background-color:#0a0a0a; border:1px solid #1a1a1e;">
                                ${url}
                                </p>
                                <hr style="border:none; border-top:1px solid #2a2a2e; margin:24px 0;" />
                                <p style="font-size:12px; color:#a1a1a6; line-height:1.6; margin:0 0 16px;">
                                If you didn't attempt to sign up or verify an account, you can safely ignore this letter. No further action is required and your email address will not be accessible unless verified.
                                </p>
                                <p style="font-size:12px; color:#6b6b70; line-height:1.6; margin:16px 0 0;">
                                Sincerely,<br />
                                <strong style="color:#a1a1a6;">Games. Team (d4rk)</strong>
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