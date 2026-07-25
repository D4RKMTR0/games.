import Tooltip from "../components/ui/Tooltip"
import { motion } from "framer-motion"

const questions = [
    { q: "Who made this?", content: <span className="text-(--text-muted)">A <span className="text-(--text)">student</span> with too much free time.</span>, x: "8%", y: "12%" },
    { q: "Why games?", content: <span className="text-(--text-muted)">Games are the <span className="text-(--text)">purest form of interactive design.</span></span>, x: "55%", y: "8%" },
    { q: "Why from scratch?", content: <span className="text-(--text-muted)">Borrowing code is <span className="underline underline-offset-4 decoration-(--text-dim)">borrowing</span> <span className="text-(--text)">someone else's understanding.</span></span>, x: "72%", y: "35%" },
    { q: "What's the stack?", content: <span className="flex flex-col gap-1 text-(--text-muted)"><span className="text-(--text)">React</span><span>Typescript</span><span>React Router</span><span className="text-(--text)">Tailwind</span><span>Framer Motion</span><span>Lucide Icons</span></span>, x: "15%", y: "42%" },
    { q: "Nothing generated?", content: <span className="text-(--text-muted)"><span className="text-(--text)">Every line</span> <span className="underline underline-offset-4 decoration-(--text-dim)">written by hand.</span> This site included.</span>, x: "60%", y: "58%" },
    { q: "How long per game?", content: <span className="text-(--text-muted)">Anywhere from <span className="text-(--text)">a weekend</span> to <span className="text-(--text)">a month.</span></span>, x: "30%", y: "68%" },
    { q: "What's next?", content: <span className="text-(--text-muted)">Whatever feels <span className="text-(--text)">interesting.</span> No roadmap.</span>, x: "5%", y: "78%" },
    { q: "Why a portfolio?", content: <span className="text-(--text-muted)">To have <span className="text-(--text)">something to point at.</span></span>, x: "70%", y: "80%" },
    { q: "Is this finished?", content: <span className="text-(--text-muted)">It <span className="text-(--text)">never</span> is.</span>, x: "40%", y: "88%" },
]

function About() {
    return (
        <motion.main
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
        >
            <div className="hidden md:block relative w-full h-screen">
                {questions.map(({ q, content, x, y }) => (
                    <div key={q} className="absolute" style={{ left: x, top: y }}>
                        <Tooltip content={content}>
                            <span className="font-mono text-xs tracking-widest uppercase text-(--text-dim) hover:text-(--text) transition-colors duration-200 cursor-default p-4">
                                {q}
                            </span>
                        </Tooltip>
                    </div>
                ))}
            </div>

            <div className="flex md:hidden flex-col gap-6 px-[clamp(30px,4.5%,100px)] pt-24">
                {questions.map(({ q, content }) => (
                    <div key={q} className="flex flex-col gap-1 border-b border-(--border) pb-6">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">{q}</span>
                        <div className="font-mono text-sm text-(--text) mt-1">{content}</div>
                    </div>
                ))}
            </div>
        </motion.main>
    )
}

export default About