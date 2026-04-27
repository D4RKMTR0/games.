import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Nav from "../components/NavBar"
import Footer from "../components/Footer"
import { motion } from "framer-motion"
import SearchBar from "../components/SearchBar"
import { games } from "../data/games"
import GameCard from "../components/GameCard"
import { fuzzyMatch } from "../utils/fuzzy"

function Library() {
    const finishedGames = games.filter(g => g.status === 'live')
    const indevGames = games.filter(g => g.status === 'in-development')
    const allGames = [...finishedGames, ...indevGames]
    
    const filters = ["ALL", "LIVE", "IN DEVELOPMENT"]
    const [currentFilter, setCurrentFilter] = useState("ALL")

    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const filteredGames = allGames.filter((game) => {
        const matchesQuery = query === "" || fuzzyMatch(query, game.title)

        const matchesFilter =
            currentFilter === "ALL" ||
            (currentFilter === "LIVE" && game.status === "live") ||
            (currentFilter === "IN DEVELOPMENT" && game.status === "in-development")

        return matchesQuery && matchesFilter
    })

    const toggleDropdownMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <motion.main
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
        >
            <span className="pt-20 block text-lg md:hidden font-mono tracking-[5px] uppercase transition-colors duration-200 ml-[clamp(20px,_4vw,_1000px)] text-(--text-muted) hover:text-(--text)">Library</span>
            <div className="flex items-center justify-between border-b border-(--border) pb-3 mx-[clamp(20px,_4vw,_1000px)] md:pt-20">
                <span className="hidden md:inline font-mono text-xs tracking-widest uppercase transition-colors duration-200 text-(--text-dim) hover:text-(--text-muted)">Library</span>
                <div className="flex justify-between md:justify-start flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex gap-2 font-mono text-sm md:text-xs text-(--text-dim) items-center">
                        <span className="leading-none">FILTER:</span>
                        <div className="relative flex items-center justify-center"> 
                            <button
                                className="flex items-center gap-1 cursor-pointer transition-colors duration-200 hover:text-(--text) z-45 outline-none leading-none group"
                                onClick={() => toggleDropdownMenu()}
                            >
                                <span className="sm:hidden">{currentFilter === "IN DEVELOPMENT" ? "IN DEV" : currentFilter}</span>
                                <span className="hidden sm:inline">{currentFilter}</span>
                                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "-rotate-180 group-hover:-translate-y-[1px]" : "rotate-0 group-hover:translate-y-[1px]"}`}/>
                            </button>

                            {isOpen && (
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setIsOpen(false)} 
                                />
                            )}

                            <ul className={`
                                absolute min-w-25 z-50 top-full left-1/2 -translate-x-1/2 mt-2 sm:min-w-35
                                bg-(--bg) overflow-hidden 
                                transition-[max-height,opacity] duration-500 ease-in-out
                                ${isOpen 
                                    ? "max-h-60 opacity-100 border border-(--border)" 
                                    : "max-h-0 opacity-0 border-transparent pointer-events-none"
                                }
                            `}>
                                <li key="ALL" className="list-none">
                                    <button
                                        onClick={() => { setCurrentFilter("ALL"); setIsOpen(false); }}
                                        className="w-full text-left px-3 py-2 font-mono text-sm md:text-xs uppercase tracking-tighter transition-colors hover:bg-(--border) hover:text-(--text) outline-none"
                                    >
                                        ALL
                                    </button>
                                </li>
                                <li key="LIVE" className="list-none">
                                    <button
                                        onClick={() => { setCurrentFilter("LIVE"); setIsOpen(false); }}
                                        className="w-full text-left px-3 py-2 font-mono text-sm md:text-xs uppercase tracking-tighter transition-colors hover:bg-(--border) hover:text-(--text) outline-none"
                                    >
                                        LIVE
                                    </button>
                                </li>
                                <li key="IN DEVELOPMENT" className="list-none">
                                    <button
                                        onClick={() => { setCurrentFilter("IN DEVELOPMENT"); setIsOpen(false); }}
                                        className="w-full text-left px-3 py-2 font-mono text-sm md:text-xs uppercase tracking-tighter transition-colors hover:bg-(--border) hover:text-(--text) outline-none"
                                    >
                                        <span className="md:hidden">IN DEV</span>
                                        <span className="hidden md:inline">IN DEVELOPMENT</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <SearchBar searchTerm={query} setSearchTerm={setQuery}/>
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 border-l border-(--border) mx-[clamp(20px,_4vw,_1000px)] mt-16">
                {filteredGames.map((game) => (
                    <GameCard gameId={game.id}/>
                ))}
            </div>
        </motion.main>
    )
}

export default Library