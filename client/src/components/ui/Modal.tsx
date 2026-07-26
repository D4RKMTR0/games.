import { AnimatePresence, motion } from "framer-motion"
import type { ReactNode } from "react"

interface ModalProps {
    open: boolean
    onClose: () => void
    children: ReactNode
}

function Modal({ open, onClose, children }: ModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 bg-(--bg)/80 backdrop-blur-sm flex items-center justify-center px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm border border-(--border) bg-(--bg) p-8 flex flex-col gap-4 text-center"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Modal