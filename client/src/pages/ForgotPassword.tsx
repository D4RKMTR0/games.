import { useState } from "react"
import { motion } from "framer-motion"
import { authClient } from "../lib/auth-client"
import { Link } from "react-router"

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleRequestReset = async () => {
        setLoading(true)
        setError(null)
        try {
            await authClient.requestPasswordReset({
                email,
                redirectTo: "/auth/reset-password",
            })
            setSent(true)
        } catch (e) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
            >
                <div className="w-full max-w-sm border border-(--border) p-8 flex flex-col gap-4 mt-20 text-center">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Check your inbox</span>
                    <h1 className="font-bold text-xl text-(--text)">Reset link sent</h1>
                    <p className="font-mono text-xs text-(--text-dim) leading-relaxed">
                        If an account exists for <span className="text-(--text)">{email}</span>, a reset link is on its way.
                    </p>
                    <Link to="/" className="w-full bg-(--text) text-(--bg) mt-2 py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200 disabled:opacity-40">
                        Back Home
                    </Link>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
        >
            <div className="w-full max-w-sm border border-(--border) p-8 flex flex-col gap-6 mt-20">
                <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Reset password</span>
                    <h1 className="font-bold text-2xl text-(--text)">Forgot password</h1>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text) outline-none focus:border-(--text-dim) transition-colors duration-200 w-full"
                        placeholder="you@example.com"
                    />
                </div>

                {error && <span className="font-mono text-xs text-(--red-base)">{error}</span>}

                <button
                    onClick={handleRequestReset}
                    disabled={loading}
                    className="w-full bg-(--text) text-(--bg) py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200 disabled:opacity-40"
                >
                    {loading ? "..." : "Send reset link"}
                </button>
            </div>
        </motion.div>
    )
}

export default ForgotPassword