import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { changelog } from "../data/changelog"
import { Link } from "react-router"
import { MoveUpRight } from "lucide-react"

const tagColors: Record<string, string> = {
    "new game": "text-(--green)",
    "update": "text-(--blue-base)",
    "fix": "text-(--red-base)",
    "site": "text-(--text-dim)",
}

function Log() {
    const [selected, setSelected] = useState<string | null>(null)

    return (
        <motion.main
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
        >
            <section className="px-[clamp(20px,_4vw,_1000px)] pt-24 pb-8">
                <span className="font-mono text-xs tracking-widest uppercase text-(--text-dim)">Log</span>
                <h1 className="font-bold text-[clamp(2rem,_5vw,_4rem)] tracking-tight leading-tight mt-2 mb-16">What changed.</h1>

                <div className="flex flex-col border-t border-(--border)">
                    {changelog.map((entry) => {
                        const isOpen = selected === entry.id

                        return (
                            <div
                                key={entry.id}
                                className="border-b border-(--border) cursor-pointer group"
                                onClick={() => setSelected(isOpen ? null : entry.id)}
                            >
                                {/* Row */}
                                <div className="flex items-center justify-between py-5 gap-4">
                                    <div className="flex items-center gap-4 sm:gap-8 min-w-0">
                                        <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) whitespace-nowrap shrink-0">{entry.date}</span>
                                        <span className={`font-mono text-[10px] tracking-widest uppercase whitespace-nowrap shrink-0 hidden sm:block ${tagColors[entry.tag]}`}>{entry.tag}</span>
                                        <span className="font-bold text-(--text) group-hover:text-(--text-muted) transition-colors duration-200 truncate">{entry.title}</span>
                                    </div>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-(--text-dim) text-xl leading-none shrink-0 w-4 text-center"
                                    >
                                        +
                                    </motion.span>
                                </div>

                                {/* Expanded */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-8 pt-1 sm:pl-[calc(theme(spacing.4)+theme(spacing.8)+6rem)] flex flex-col gap-4">
                                                <span className={`font-mono text-[10px] tracking-widest uppercase sm:hidden ${tagColors[entry.tag]}`}>{entry.tag}</span>
                                                <p className="font-mono text-sm text-(--text-dim) leading-loose max-w-lg">
                                                    {entry.description}
                                                </p>
                                                {entry.path && (
                                                    <Link
                                                        to={entry.path}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex items-center gap-2 font-mono text-xs text-(--text-dim) hover:text-(--text) transition-colors duration-200 w-fit"
                                                    >
                                                        <span>Play now</span> <MoveUpRight size={10} />
                                                    </Link>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </section>
        </motion.main>
    )
}

export default Log