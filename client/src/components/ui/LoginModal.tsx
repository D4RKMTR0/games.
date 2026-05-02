import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

function LoginModal({ open, onClose }: LoginModalProps) {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* Center container */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                            }}
                            className="
                                relative
                                w-full 
                                max-w-md 
                                sm:max-w-sm
                                border border-(--border) 
                                bg-(--bg) 
                                p-5 sm:p-6 
                                font-mono
                            "
                        >
                            {/* X button */}
                            <button
                                onClick={onClose}
                                className="
                                    absolute top-3 right-3
                                    text-(--text-dim) 
                                    hover:text-(--text)
                                    transition-colors
                                "
                            >
                                <X size={16} />
                            </button>

                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] tracking-widest uppercase text-(--text-dim)">
                                    Access restricted
                                </span>

                                <h2 className="text-sm text-(--text)">
                                    You need to be logged in to play
                                </h2>

                                <p className="text-xs text-(--text-dim)">
                                    Sign in to track stats, leaderboard progress, and save your games.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <button
                                        className="px-3 py-1.5 text-xs border border-(--border) text-(--text) w-full sm:w-auto"
                                        onClick={() => {
                                            navigate("/");
                                            onClose();
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="px-3 py-1.5 text-xs bg-(--text) text-(--bg) w-full sm:w-auto"
                                        onClick={() => {
                                            navigate("/auth/login");
                                            onClose();
                                        }}
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default LoginModal;