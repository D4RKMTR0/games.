import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router"
import { authClient } from "../lib/auth-client"

function Auth() {
    const location = useLocation()
    const mode = location.pathname.includes("login") ? "login" : "signup"
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const toggleMode = () => {
        const next = mode === "signup" ? "login" : "signup"
        setError(null)
        navigate(`/auth/${next}`)
    }

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)
        try {
            if (mode === "signup") {
                await authClient.signUp.email({ name, email, password })
            } else {
                await authClient.signIn.email({ email, password })
            }
        } catch (e: any) {
            setError(e.message ?? "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        await authClient.signIn.social({ provider: "google" })
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
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">
                        {mode === "signup" ? "Create account" : "Welcome back"}
                    </span>
                    <h1 className="font-bold text-2xl text-(--text)">
                        {mode === "signup" ? "Sign up" : "Log in"}
                    </h1>
                </div>

                <button
                    onClick={handleGoogle}
                    className="w-full border border-(--border) py-2.5 font-mono text-xs tracking-widest uppercase text-(--text-dim) hover:text-(--text) hover:border-(--text-dim) transition-all duration-200"
                >
                    Continue with Google
                </button>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-(--border)" />
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">or</span>
                    <div className="flex-1 h-px bg-(--border)" />
                </div>

                <div className="flex flex-col gap-4">
                    {mode === "signup" && (
                        <div className="flex flex-col gap-1.5">
                            <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text) outline-none focus:border-(--text-dim) transition-colors duration-200 w-full"
                                placeholder="your name"
                            />
                        </div>
                    )}
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
                    <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text) outline-none focus:border-(--text-dim) transition-colors duration-200 w-full"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <span className="font-mono text-xs text-(--red-base)">{error}</span>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-(--text) text-(--bg) py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200 disabled:opacity-40"
                >
                    {loading ? "..." : mode === "signup" ? "Create account" : "Log in"}
                </button>

                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) text-center">
                    {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={toggleMode}
                        className="text-(--text) hover:text-(--text-muted) transition-colors duration-200"
                    >
                        {mode === "signup" ? "Log in" : "Sign up"}
                    </button>
                </span>

            </div>
        </motion.div>
    )
}

export default Auth