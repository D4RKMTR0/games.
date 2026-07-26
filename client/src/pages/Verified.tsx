import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router"
import { authClient } from "../lib/auth-client"

function Verified() {
    const navigate = useNavigate()
    const location = useLocation()
    const { data: session, isPending } = authClient.useSession()

    const linkError = new URLSearchParams(location.search).get("error")

    if (isPending) {
        return (
            <motion.div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
                <span className="font-mono text-xs text-(--text-dim)">Loading...</span>
            </motion.div>
        )
    }

    const isVerified = session?.user?.emailVerified && !linkError

    if (!isVerified) {
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
                    <h1 className="font-bold text-xl text-(--text)">This verification link is invalid</h1>
                    <p className="font-mono text-xs text-(--text-dim) leading-relaxed">
                        It may have expired, already been used, or you're not signed in. Please log in or request a new link.
                    </p>
                    <button
                        onClick={() => navigate("/auth/login")}
                        className="w-full bg-(--text) text-(--bg) py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200 disabled:opacity-40"
                    >
                        Go to login
                    </button>
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
            <div className="w-full max-w-sm border border-(--border) p-8 flex flex-col gap-4 mt-20 text-center">
                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Success</span>
                <h1 className="font-bold text-xl text-(--text)">You're verified</h1>
                <p className="font-mono text-xs text-(--text-dim) leading-relaxed">
                    You're logged in as <span className="text-(--text)">{session.user.name}</span> and your email is verified.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="w-full bg-(--text) text-(--bg) py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200 mt-2"
                >
                    Go to home
                </button>
            </div>
        </motion.div>
    )
}

export default Verified