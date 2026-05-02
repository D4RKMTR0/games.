import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router"
import { api } from "../lib/api"

interface GameMeta {
    id: string
    title: string
    description: string
    longDescription: string
    status: "available" | "coming_soon"
}

interface LeaderboardEntry {
    username: string
    name: string
    image: string | null
    won: number
    lost: number
    drew: number
}

const GAMES: Record<string, GameMeta> = {
    tictactoe: {
        id: "tictactoe",
        title: "Tic Tac Toe",
        description: "Classic 3×3 grid. X vs O. First to three wins.",
        longDescription: "The timeless game of Tic Tac Toe. Place your mark, block your opponent, and claim three in a row — horizontally, vertically, or diagonally. Simple rules, sharp minds.",
        status: "available",
    },
}

function GamePage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const game = id ? GAMES[id] : null

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [leaderboardLoading, setLeaderboardLoading] = useState(true)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        if (!id) return
        setLeaderboardLoading(true)
        api.get(`/api/stats/leaderboard/${id}`)
            .then(data => setLeaderboard(Array.isArray(data) ? data : []))
            .catch(() => setLeaderboard([]))
            .finally(() => setLeaderboardLoading(false))
    }, [id])

    if (!game) {
        return (
            <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                className="flex justify-center items-start mt-15 min-h-[calc(100vh-4rem)] px-[clamp(20px,_4vw,_100px)]"
            >
                <div className="w-full max-w-4xl mt-10 border border-(--border) p-8 flex flex-col gap-2">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">404</span>
                    <h2 className="font-bold text-xl text-(--text)">Game not found</h2>
                    <button onClick={() => navigate("/library")} className="w-fit mt-4 font-mono text-xs tracking-widest uppercase text-(--text-muted) hover:text-(--text) transition-colors duration-200">
                        ← Back to library
                    </button>
                </div>
            </motion.div>
        )
    }

    const totalGames = leaderboard.reduce((acc, e) => acc + e.won + e.lost + e.drew, 0)

    return (
        <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="flex justify-center items-start mt-15 min-h-[calc(100vh-4rem)] px-[clamp(20px,_4vw,_100px)]"
        >
            <div className="w-full max-w-4xl mt-10 mb-10 flex flex-col border border-(--border)">

                {/* Hero */}
                <div className="flex flex-col md:flex-row md:items-end gap-6 p-8 border-b border-(--border)">
                    <div className="flex flex-col gap-3 flex-1">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Game / {game.id}</span>
                        <h1 className="font-bold text-3xl text-(--text)">{game.title}</h1>
                        <p className="font-mono text-xs text-(--text-dim) leading-relaxed max-w-md">{game.longDescription}</p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                        {game.status === "available" ? (
                            <button
                                onClick={() => setPlaying(true)}
                                className="bg-(--text) text-(--bg) px-8 py-3 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200"
                            >
                                Play now
                            </button>
                        ) : (
                            <button disabled className="border border-(--border) text-(--text-dim) px-8 py-3 font-mono text-xs tracking-widest uppercase opacity-40 cursor-not-allowed">
                                Coming soon
                            </button>
                        )}
                        <span className="font-mono text-[10px] text-(--text-dim) text-center">{totalGames} games played</span>
                    </div>
                </div>

                {/* Play area */}
                {playing && (
                    <div className="flex flex-col gap-4 p-8 border-b border-(--border)">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Play</span>
                                <h2 className="font-bold text-lg text-(--text)">vs AI</h2>
                            </div>
                            <button
                                onClick={() => setPlaying(false)}
                                className="font-mono text-xs tracking-widest uppercase text-(--text-muted) hover:text-(--text) transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>

                        {/* Game board placeholder — will be replaced with actual game */}
                        <div className="flex items-center justify-center border border-(--border) h-64">
                            <span className="font-mono text-xs text-(--text-dim)">Game board loading...</span>
                        </div>
                    </div>
                )}

                {/* Leaderboard */}
                <div className="flex flex-col p-8 gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Leaderboard</span>
                        <h2 className="font-bold text-lg text-(--text)">Top players</h2>
                    </div>

                    {leaderboardLoading ? (
                        <span className="font-mono text-xs text-(--text-dim)">Loading...</span>
                    ) : leaderboard.length === 0 ? (
                        <span className="font-mono text-xs text-(--text-dim)">No games played yet. Be the first!</span>
                    ) : (
                        <div className="flex flex-col border-t border-(--border)">
                            {/* Header */}
                            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 py-2 border-b border-(--border)">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-6">#</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Player</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-10 text-right">W</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-10 text-right">L</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-10 text-right">D</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-14 text-right">WR%</span>
                            </div>

                            {leaderboard.map((entry, i) => {
                                const total = entry.won + entry.lost + entry.drew
                                const wr = total > 0 ? Math.round((entry.won / total) * 100) : 0
                                const isTop = i === 0

                                return (
                                    <div
                                        key={entry.username}
                                        onClick={() => navigate(`/user/${entry.username}`)}
                                        className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center py-3 border-b border-(--border) cursor-pointer hover:bg-(--bg-subtle) transition-colors duration-150 ${isTop ? "bg-(--bg-subtle)" : ""}`}
                                    >
                                        <span className={`font-mono text-xs w-6 ${isTop ? "text-(--text)" : "text-(--text-dim)"}`}>
                                            {i === 0 ? "—" : i + 1}
                                        </span>

                                        <div className="flex items-center gap-3 min-w-0">
                                            {entry.image ? (
                                                <img src={entry.image} alt={entry.name} className="w-6 h-6 border border-(--border) object-cover shrink-0" />
                                            ) : (
                                                <div className="w-6 h-6 border border-(--border) flex items-center justify-center font-bold text-[10px] text-(--text-muted) shrink-0">
                                                    {entry.name?.[0]?.toUpperCase() ?? "?"}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <span className={`font-bold text-sm truncate ${isTop ? "text-(--text)" : "text-(--text)"}`}>{entry.name}</span>
                                                <span className="font-mono text-[10px] text-(--text-dim)">@{entry.username}</span>
                                            </div>
                                        </div>

                                        <span className="font-mono text-sm text-(--green-base) w-10 text-right">{entry.won}</span>
                                        <span className="font-mono text-sm text-(--red-base) w-10 text-right">{entry.lost}</span>
                                        <span className="font-mono text-sm text-(--text-muted) w-10 text-right">{entry.drew}</span>
                                        <span className={`font-mono text-sm w-14 text-right ${isTop ? "text-(--text) font-bold" : "text-(--text-dim)"}`}>{wr}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    )
}

export default GamePage