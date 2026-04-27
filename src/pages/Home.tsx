import { useState, useRef, useEffect } from "react"
import { ArrowRight, MoveUpRight } from "lucide-react"
import { games } from "../data/games"
import { motion } from "framer-motion"
import TicTacToePreview from "../components/previews/TicTacToePreview"
import { Link } from "react-router"

const isTouchDevice = window.matchMedia("(hover: none)").matches

function Home() {

    const latest = games.find(g => g.status === "live")
    const inDev = games.find(g => g.status === "in-development")
    const [hovered, setHovered] = useState(false)
    
    const [inView, setInView] = useState(false)
    const cardRef = useRef<HTMLAnchorElement>(null)
    const isActive = isTouchDevice ? inView : hovered

    useEffect(() => {
        if (!isTouchDevice) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting)
            },
            { threshold: 0.5 }
        )

        if (cardRef.current) observer.observe(cardRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <motion.main
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
        >
            <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[40dvh] px-[clamp(30px,_4.5%,_100px)] py-24 border-b border-(--border)">
                <div className="flex items-center justify-center sm:items-start sm:justify-start">
                    <div className="flex flex-col">
                        <span className="text-(--text-dim) font-mono text-xs tracking-widest uppercase mt-5 mb-3 ml-1">A Game Collection</span>
                        <h1 className="font-bold tracking-tight leading-[0.93] text-[clamp(2.8rem,_7vw,_6rem)] mt-4">
                            Small games,<br />
                            <span className="text-(--text-dim)">built from</span><br />
                            <span className="text-(--text-dim)">scratch.</span>
                        </h1>
                    </div>
                </div>
                <div className="hidden sm:flex items-baseline justify-between lg:flex-col justify-end">
                    <div className="flex-1 flex items-center lg: ml-auto">
                        <p className="font-mono text-sm text-(--text-dim) leading-loose sm:mt-5 lg:text-right lg:mb-[clamp(10px,_2vw,_100px)] xl:mb-[clamp(10px,_4vw,_100px)]">
                            Each game is built from zero.<br />
                            Each line written by hand.<br />
                            Nothing borrowed. Nothing generated.
                        </p>
                    </div>
                    <div className="flex gap-8 sm:mt-auto mb-2 lg:ml-auto">
                        {[["00", "games"], ["—", "avg. plays"], ["∞", "replays"]].map(([value, label]) => (
                            <div className="flex flex-col items-end gap-1 group">
                                <span className="text-xl font-bold text-(--text-muted) group-hover:text-(--text) transition-colors duration-200">{value}</span>
                                <span className="font-mono text-[9px] tracking-widest text-(--text-dim) uppercase">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section>
                <div className="flex justify-between items-center pt-15 pb-2 border-b border-(--border) mx-[clamp(20px,_4vw,_1000px)] mb-8">
                    <span className="font-mono text-xs tracking-widest uppercase text-(--text-dim)">Games</span>
                    <Link to="/library" className="font-mono text-xs tracking-widest uppercase text-(--text-dim) flex items-center hover:text-(--text) group transition-colors duration-200 cursor-pointer">More <ArrowRight size={15} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-200"/></Link>
                </div>
                <div className="flex flex-col md:grid grid-cols-[1.5fr_1fr] mx-[clamp(20px,_4vw,_1000px)]">
                    <Link to={latest?.path ?? "#"}
                        ref={cardRef}
                        className="flex flex-col justify-between p-8 border border-(--border) min-h-[400px] group cursor-pointer"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Latest Release</span>
                            <span className="text-(--text-dim) group-hover:text-(--text) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"><MoveUpRight size={10} /></span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <TicTacToePreview isHovered={isActive} className="w-32 h-32" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-lg text-(--text)">{latest?.title ?? "No games yet"}</span>
                            <span className="font-mono text-xs text-(--text-dim)">{latest?.description ?? "—"}</span>
                        </div>
                    </Link>
                    <div className="flex flex-col justify-between p-8 min-h-[400px] border-b border-r border-(--border) border-l md:border-l-0 md:border-t">
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">In Development</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-32 h-32 border border-dashed border-(--border) flex items-center justify-center text-[10px] text-(--text-dim) uppercase">
                                No Preview
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-lg text-(--text-muted)">{inDev?.title ?? "Untitled"}</span>
                            <span className="font-mono text-xs text-(--text-dim)">{inDev?.description ?? "coming soon"}</span>
                        </div>
                    </div>
                </div>
            </section>
        </motion.main>
    )
}

export default Home