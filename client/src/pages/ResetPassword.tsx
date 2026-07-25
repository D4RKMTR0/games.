import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router"
import { authClient } from "../lib/auth-client"

function ResetPassword() {
    const navigate = useNavigate()
    const location = useLocation()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const token = new URLSearchParams(location.search).get("token")

    const handleReset = async () => {
        setError(null)

        if (!token) {
            setError("This reset link is invalid or missing a token.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setLoading(true)
        try {
            const result = await authClient.resetPassword({
                newPassword: password,
                token,
            })

            if (result.error) {
                setError(result.error.message || "This reset link is invalid or has expired.")
                return
            }

            setSuccess(true)
            setTimeout(() => navigate("/auth/login"), 2000)
        } catch (e) {
            setError("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
            >
                <div className="w-full max-w-sm border border-(--border) p-8 flex flex-col gap-4 mt-20 text-center">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Invalid link</span>
                    <h1 className="font-bold text-xl text-(--text)">This reset link is invalid</h1>
                    <p className="font-mono text-xs text-(--text-dim) leading-relaxed">
                        Please request a new password reset link.
                    </p>
                    <button
                        onClick={() => navigate("/auth/forgot-password")}
                        className="font-mono text-xs tracking-widest uppercase text-(--text-muted) hover:text-(--text) transition-colors duration-200"
                    >
                        Request new link
                    </button>
                </div>
            </motion.div>
        )
    }

    if (success) {
        return (
            <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
            >
                <div className="w-full max-w-sm border border-(--border) p-8 flex flex-col gap-4 mt-20 text-center">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Success</span>
                    <h1 className="font-bold text-xl text-(--text)">Password reset</h1>
                    <p className="font-mono text-xs text-(--text-dim) leading-relaxed">
                        Redirecting you to log in...
                    </p>
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
                    <h1 className="font-bold text-2xl text-(--text)">Choose a new password</h1>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">New password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text) outline-none focus:border-(--text-dim) transition-colors duration-200 w-full"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Confirm password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text) outline-none focus:border-(--text-dim) transition-colors duration-200 w-full"
                        placeholder="••••••••"
                    />
                </div>

                {error && <span className="font-mono text-xs text-(--red-base)">{error}</span>}

                <button
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full bg-(--text) text-(--bg) py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200 disabled:opacity-40"
                >
                    {loading ? "..." : "Reset password"}
                </button>
            </div>
        </motion.div>
    )
}

export default ResetPassword