import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router"
import { api } from "../lib/api"
import { authClient } from "../lib/auth-client"
import { games, type GameSettings } from "../data/games"
import { PREVIEW_COMPONENTS } from "../components/previews/previewregistry"
import SegmentedControl from "../components/ui/SegmentedControl"
import { useOutletContext } from "react-router"
import { Circle, X } from "lucide-react"

interface LeaderboardEntry {
    username: string
    name: string
    image: string | null
    won: number
    lost: number
    drew: number
    win_rate: number
}

function GamePage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const game = games.find(g => g.id === id)

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [leaderboardLoading, setLeaderboardLoading] = useState(true)
    const [playing, setPlaying] = useState(false)
    const [previewHovered, setPreviewHovered] = useState(false)
    const [isGameActive, setIsGameActive] = useState(false)

    const PreviewComponent = id ? PREVIEW_COMPONENTS[id] : null
    const GameComponent = game?.component

    const [settings, setSettings] = useState<GameSettings>(
        game?.defaultSettings ?? {
            difficulty: "easy",
            mode: "ai",
            side: "X",
        }
    );

    

    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const { setLoginOpen } = useOutletContext<any>()

    useEffect(() => {
        if (!id) return
        setLeaderboardLoading(true)
        api.get(`/api/stats/leaderboard/${id}`)
            .then(data => setLeaderboard(Array.isArray(data) ? data : []))
            .catch(() => setLeaderboard([]))
            .finally(() => setLeaderboardLoading(false))
    }, [id])

    useEffect(() => {
        authClient.getSession()
            .then((res) => {
                setUser(res?.data?.user ?? null);
            })
            .finally(() => setAuthLoading(false));
    }, []);

    const isLoggedIn = !!user;

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
                <div className="flex flex-col md:flex-row gap-8 p-8 border-b border-(--border)">

                    {/* Preview */}
                    {PreviewComponent && !playing && (
                        <div
                            className="
                                shrink-0 
                                w-40 h-40 
                                mx-auto md:mx-0
                                cursor-pointer
                                flex items-center justify-center
                            "
                            onMouseEnter={() => setPreviewHovered(true)}
                            onMouseLeave={() => setPreviewHovered(false)}
                        >
                            <Suspense fallback={<div className="w-full h-full border border-(--border) bg-(--bg-subtle)" />}>
                                <PreviewComponent isHovered={previewHovered} className="w-full h-full" />
                            </Suspense>
                        </div>
                    )}

                    {/* Info + CTA */}
                    <div className="flex flex-col justify-between gap-6 flex-1">
                        <div className="flex flex-col gap-3">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Game / {game.id}</span>
                            <h1 className="font-bold text-3xl text-(--text)">{game.title}</h1>
                            <p className="font-mono text-xs text-(--text-dim) leading-relaxed max-w-md">
                                {game.longDescription ?? game.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {game.status === "live" ? (
                                <button
                                    onClick={() => {
                                        if (authLoading) return;

                                        if (!isLoggedIn) {
                                            setLoginOpen(true);
                                            return;
                                        }

                                        setPlaying(p => !p);
                                    }}
                                    className="bg-(--text) text-(--bg) px-8 py-3 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200"
                                >
                                    {playing ? "Close" : "Play now"}
                                </button>
                            ) : (
                                <button disabled className="border border-(--border) text-(--text-dim) px-8 py-3 font-mono text-xs tracking-widest uppercase opacity-40 cursor-not-allowed">
                                    Coming soon
                                </button>
                            )}
                            <span className="font-mono text-[10px] text-(--text-dim)">{totalGames} games played</span>
                        </div>
                    </div>
                </div>

                {/* Play area */}
                {playing && (
                    <div className="flex flex-col gap-6 p-8 border-b border-(--border)">
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Play</span>
                            <div className="flex gap-3 flex-wrap">
                                <div className="flex flex-col gap-1">
                                    <span className="text-(--text-dim) font-mono text-xs tracking-widest uppercase ml-0.5">mode</span>
                                    <SegmentedControl
                                        value={settings.mode}
                                        onChange={(v) => setSettings(prev => ({ 
                                            ...prev, 
                                            difficulty: v === "local" ? "easy" : prev.difficulty,
                                            mode: v,
                                            side: v === "local" ? "X" : prev.side 
                                        }))}
                                        options={[
                                            { label: "AI", value: "ai" },
                                            { label: "Local MP", value: "local" },
                                        ]}
                                        disabled={isGameActive}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-(--text-dim) font-mono text-xs tracking-widest uppercase ml-0.5">difficulty</span>
                                    <SegmentedControl
                                        value={settings.difficulty}
                                        onChange={(v) =>
                                            setSettings(prev => ({ ...prev, difficulty: v }))
                                        }
                                        options={[
                                            { label: "Easy", value: "easy" },
                                            { label: "Medium", value: "medium" },
                                            { label: "Hard", value: "hard" },
                                        ]}
                                        disabled={settings.mode === 'local' || isGameActive}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-(--text-dim) font-mono text-xs tracking-widest uppercase ml-0.5">Side</span>
                                    <SegmentedControl
                                        value={settings.side}
                                        onChange={(v) =>
                                            setSettings(prev => ({ ...prev, side: v }))
                                        }
                                        options={[
                                            { label: <X size={16} />, value: "X" },
                                            { label: <Circle size={16} />, value: "O" },
                                        ]}
                                        disabled={settings.mode === 'local' || isGameActive}
                                    />
                                </div>
                            </div>
                        </div>

                        {GameComponent && (
                            <GameComponent settings={settings} onGameStart={() => setIsGameActive(true)} onGameEnd={() => setIsGameActive(false)} onBack={() => setPlaying(false)}/>
                        )}
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
                            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 py-2 border-b border-(--border)">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-6">#</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Player</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-10 text-right">W</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-10 text-right">L</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-10 text-right">D</span>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-14 text-right">WR%</span>
                            </div>

                            {leaderboard.map((entry, i) => {
                                const isTop = i === 0
                                return (
                                    <div
                                        key={entry.username}
                                        onClick={() => navigate(`/user/${entry.username}`)}
                                        className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center py-3 border-b border-(--border) cursor-pointer hover:bg-(--bg-subtle) transition-colors duration-150 ${isTop ? "bg-(--bg-subtle)" : ""}`}
                                    >
                                        <span className={`font-mono text-xs w-6 ${isTop ? "text-(--text) font-bold" : "text-(--text-dim)"}`}>
                                            {i + 1}
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
                                                <span className="font-bold text-sm text-(--text) truncate">{entry.name}</span>
                                                <span className="font-mono text-[10px] text-(--text-dim)">@{entry.username}</span>
                                            </div>
                                        </div>

                                        <span className="font-mono text-sm text-(--green-base) w-10 text-right">{entry.won}</span>
                                        <span className="font-mono text-sm text-(--red-base) w-10 text-right">{entry.lost}</span>
                                        <span className="font-mono text-sm text-(--text-muted) w-10 text-right">{entry.drew}</span>
                                        <span className={`font-mono text-sm w-14 text-right ${isTop ? "text-(--text) font-bold" : "text-(--text-dim)"}`}>
                                            {entry.win_rate}%
                                        </span>
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