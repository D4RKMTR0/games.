import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useNavigate } from "react-router"
import { api } from "../lib/api"

type Tab = "overview" | "stats" | "history" | "achievements"

interface UserProfile {
    name: string
    username: string
    image: string | null
    createdAt: string
}

interface Stats {
    game_id: string
    won: number
    lost: number
    drew: number
}

interface MatchHistory {
    id: string
    game_id: string
    result: "won" | "lost" | "drew"
    difficulty: string | null
    played_at: string
}

interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    game_id: string | null
    unlocked_at: string
}

function UserProfile() {
    const { username } = useParams<{ username: string }>()
    const navigate = useNavigate()

    const [tab, setTab] = useState<Tab>("overview")
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [profileLoading, setProfileLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const [stats, setStats] = useState<Stats[]>([])
    const [statsLoading, setStatsLoading] = useState(false)

    const [history, setHistory] = useState<MatchHistory[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [expandedHistory, setExpandedHistory] = useState<string | null>(null)

    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [achievementsLoading, setAchievementsLoading] = useState(false)

    useEffect(() => {
        if (!username) return
        setProfileLoading(true)
        setNotFound(false)

        api.get(`/api/user/${username}`)
            .then(data => {
                if (!data || data.error) { setNotFound(true); return }
                setProfile(data)
            })
            .catch(() => setNotFound(true))
            .finally(() => setProfileLoading(false))
    }, [username])

    useEffect(() => {
        if (!username || !profile) return

        if (tab === "stats" && stats.length === 0) {
            setStatsLoading(true)
            api.get(`/api/user/${username}/stats`)
                .then(data => setStats(Array.isArray(data) ? data : []))
                .catch(() => setStats([]))
                .finally(() => setStatsLoading(false))
        }

        if (tab === "history" && history.length === 0) {
            setHistoryLoading(true)
            api.get(`/api/user/${username}/history`)
                .then(data => setHistory(Array.isArray(data) ? data : []))
                .catch(() => setHistory([]))
                .finally(() => setHistoryLoading(false))
        }

        if (tab === "achievements" && achievements.length === 0) {
            setAchievementsLoading(true)
            api.get(`/api/user/${username}/achievements`)
                .then(data => setAchievements(Array.isArray(data) ? data : []))
                .catch(() => setAchievements([]))
                .finally(() => setAchievementsLoading(false))
        }
    }, [tab, username, profile])

    const totalGames = (Array.isArray(stats) ? stats : []).reduce((acc, s) => acc + s.won + s.lost + s.drew, 0)
    const totalWins = (Array.isArray(stats) ? stats : []).reduce((acc, s) => acc + s.won, 0)
    const totalLosses = (Array.isArray(stats) ? stats : []).reduce((acc, s) => acc + s.lost, 0)
    const totalDraws = (Array.isArray(stats) ? stats : []).reduce((acc, s) => acc + s.drew, 0)
    const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0
    const favoriteGame = (Array.isArray(stats) ? stats : []).length > 0
        ? (Array.isArray(stats) ? stats : []).reduce((a, b) => (a.won + a.lost + a.drew) > (b.won + b.lost + b.drew) ? a : b).game_id
        : null

    const joinedDate = profile?.createdAt
        ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(new Date(profile.createdAt))
        : null

    const tabs: { id: Tab; label: string; description: string }[] = [
        { id: "overview", label: "Overview", description: "/ profile details" },
        { id: "stats", label: "Stats", description: "/ performance" },
        { id: "history", label: "History", description: "/ match log" },
        { id: "achievements", label: "Achievements", description: "/ badges" },
    ]

    const resultColor = (result: string) => {
        if (result === "won") return "text-(--green-base)"
        if (result === "lost") return "text-(--red-base)"
        return "text-(--text-muted)"
    }

    const resultLabel = (result: string) => {
        if (result === "won") return "W"
        if (result === "lost") return "L"
        return "D"
    }

    const resultText = (result: string) => {
        if (result === "won") return "Victory"
        if (result === "lost") return "Defeat"
        return "Draw"
    }

    if (profileLoading) {
        return (
            <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                className="flex justify-center items-start mt-15 min-h-[calc(100vh-4rem)] px-[clamp(20px,4vw,100px)]"
            >
                <div className="w-full max-w-4xl mt-10">
                    <span className="font-mono text-xs text-(--text-dim)">Loading...</span>
                </div>
            </motion.div>
        )
    }

    if (notFound || !profile) {
        return (
            <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                className="flex justify-center items-start mt-15 min-h-[calc(100vh-4rem)] px-[clamp(20px,4vw,100px)]"
            >
                <div className="w-full max-w-4xl mt-10 border border-(--border) p-8 flex flex-col gap-2">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">404</span>
                    <h2 className="font-bold text-xl text-(--text)">User not found</h2>
                    <p className="font-mono text-xs text-(--text-dim) mt-1">No player with the username <span className="text-(--text)">@{username}</span> exists.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-fit mt-4 font-mono text-xs tracking-widest uppercase text-(--text-muted) hover:text-(--text) transition-colors duration-200"
                    >
                        ← Back to home
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
            className="flex justify-center items-start mt-15 min-h-[calc(100vh-4rem)] px-[clamp(20px,4vw,100px)]"
        >
            <div className="w-full max-w-4xl mt-10 mb-10 flex flex-col border border-(--border)">

                {/* Profile header */}
                <div className="flex flex-col md:flex-row md:items-end gap-6 p-8 border-b border-(--border)">
                    <div className="shrink-0">
                        {profile.image ? (
                            <img src={profile.image} alt={profile.name} className="w-20 h-20 border border-(--border) object-cover" />
                        ) : (
                            <div className="w-20 h-20 border border-(--border) flex items-center justify-center font-bold text-3xl text-(--text-muted)">
                                {profile.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Player profile</span>
                        <h1 className="font-bold text-2xl text-(--text)">{profile.name}</h1>
                        <span className="font-mono text-xs text-(--text-dim)">@{profile.username}</span>
                    </div>

                    {joinedDate && (
                        <div className="flex flex-col items-start md:items-end gap-0.5">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Member since</span>
                            <span className="font-mono text-xs text-(--text-muted)">{joinedDate}</span>
                        </div>
                    )}
                </div>

                {/* Tab nav */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-(--border)">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex flex-col items-start px-5 py-4 border-r last:border-r-0 border-(--border) transition-colors duration-200 ${tab === t.id ? "bg-(--bg-subtle)" : "hover:bg-(--bg-subtle)/50"}`}
                        >
                            <span className={`font-bold text-sm transition-colors duration-200 ${tab === t.id ? "text-(--text)" : "text-(--text-muted)"}`}>{t.label}</span>
                            <span className="font-mono text-[10px] text-(--text-dim)">{t.description}</span>
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="p-8 flex flex-col gap-6">

                    {/* Overview */}
                    {tab === "overview" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Overview</span>
                                <h2 className="font-bold text-lg text-(--text)">Profile details</h2>
                            </div>

                            <div className="flex flex-col border-t border-(--border)">
                                {[
                                    ["Display name", profile.name],
                                    ["Username", `@${profile.username}`],
                                    ["Member since", joinedDate ?? "—"],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex items-center justify-between py-4 border-b border-(--border)">
                                        <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">{label}</span>
                                        <span className="font-bold text-sm text-(--text)">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Stats */}
                    {tab === "stats" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Stats</span>
                                <h2 className="font-bold text-lg text-(--text)">Performance</h2>
                            </div>

                            {statsLoading ? (
                                <span className="font-mono text-xs text-(--text-dim)">Loading...</span>
                            ) : stats.length === 0 ? (
                                <span className="font-mono text-xs text-(--text-dim)">No games played yet.</span>
                            ) : (
                                <>
                                    {/* Summary cards */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 border border-(--border)">
                                        {[
                                            ["Total", totalGames.toString(), ""],
                                            ["Win rate", `${winRate}%`, "text-(--green-base)"],
                                            ["Wins", totalWins.toString(), "text-(--green-base)"],
                                            ["Fav", favoriteGame ?? "—", ""],
                                        ].map(([label, value, colorClass]) => (
                                            <div key={label} className="flex flex-col gap-1 p-4 border-r last:border-r-0 border-b md:border-b-0 border-(--border)">
                                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">{label}</span>
                                                <span className={`font-bold text-xl text-(--text) capitalize truncate ${colorClass}`}>{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Per-game table */}
                                    <div className="flex flex-col border-t border-(--border)">
                                        <div className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1fr_auto_auto_auto_auto] gap-2 md:gap-4 py-2 border-b border-(--border)">
                                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Game</span>
                                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-8 md:w-10 text-right">W</span>
                                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-8 md:w-10 text-right">L</span>
                                            <span className="hidden md:block font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-10 text-right">D</span>
                                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) w-12 md:w-16 text-right">Total</span>
                                        </div>

                                        {stats
                                            .slice()
                                            .sort((a, b) => (b.won + b.lost + b.drew) - (a.won + a.lost + a.drew))
                                            .map(s => {
                                                const total = s.won + s.lost + s.drew
                                                const wr = total > 0 ? Math.round((s.won / total) * 100) : 0
                                                return (
                                                    <div key={s.game_id} className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1fr_auto_auto_auto_auto] gap-2 md:gap-4 items-center py-4 border-b border-(--border)">
                                                        <div className="flex flex-col gap-0.5 min-w-0">
                                                            <span className="font-bold text-sm text-(--text) capitalize truncate">{s.game_id}</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-12 md:w-20 h-0.5 bg-(--border)">
                                                                    <div className="h-full bg-(--green-base) transition-all duration-500" style={{ width: `${wr}%` }} />
                                                                </div>
                                                                <span className="font-mono text-[10px] text-(--text-dim)">{wr}%</span>
                                                            </div>
                                                        </div>
                                                        <span className="font-mono text-sm text-(--green-base) w-8 md:w-10 text-right">{s.won}</span>
                                                        <span className="font-mono text-sm text-(--red-base) w-8 md:w-10 text-right">{s.lost}</span>
                                                        <span className="hidden md:block font-mono text-sm text-(--text-muted) w-10 text-right">{s.drew}</span>
                                                        <span className="font-mono text-sm text-(--text-dim) w-12 md:w-16 text-right">{total}</span>
                                                    </div>
                                                )
                                            })}

                                        <div className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1fr_auto_auto_auto_auto] gap-2 md:gap-4 items-center py-4">
                                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Total</span>
                                            <span className="font-mono text-sm font-bold text-(--green-base) w-8 md:w-10 text-right">{totalWins}</span>
                                            <span className="font-mono text-sm font-bold text-(--red-base) w-8 md:w-10 text-right">{totalLosses}</span>
                                            <span className="hidden md:block font-mono text-sm font-bold text-(--text-muted) w-10 text-right">{totalDraws}</span>
                                            <span className="font-mono text-sm font-bold text-(--text) w-12 md:w-16 text-right">{totalGames}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* History */}
                    {tab === "history" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">History</span>
                                <h2 className="font-bold text-lg text-(--text)">Match log</h2>
                            </div>

                            {historyLoading ? (
                                <span className="font-mono text-xs text-(--text-dim)">Loading...</span>
                            ) : history.length === 0 ? (
                                <span className="font-mono text-xs text-(--text-dim)">No matches played yet.</span>
                            ) : (
                                <div className="flex flex-col border-t border-(--border)">
                                    {history.map(h => {
                                        const isExpanded = expandedHistory === h.id
                                        const date = new Date(h.played_at)
                                        return (
                                            <div key={h.id} className="flex flex-col border-b border-(--border)">
                                                {/* Row */}
                                                <button
                                                    onClick={() => setExpandedHistory(isExpanded ? null : h.id)}
                                                    className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center py-3 text-left hover:bg-(--bg-subtle) transition-colors duration-150 w-full"
                                                >
                                                    <span className={`font-mono text-xs font-bold w-6 ${resultColor(h.result)}`}>{resultLabel(h.result)}</span>
                                                    <span className="font-bold text-sm text-(--text) capitalize">{h.game_id}</span>
                                                    {h.difficulty && (
                                                        <span className="font-mono text-[10px] text-(--text-dim) border border-(--border) px-1.5 py-0.5 capitalize">{h.difficulty}</span>
                                                    )}
                                                    <span className="font-mono text-[10px] text-(--text-dim)">
                                                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)}
                                                    </span>
                                                </button>

                                                {/* Expanded details */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="flex flex-col gap-0 border-t border-(--border) bg-(--bg-subtle)">
                                                                {[
                                                                    ["Result", <span className={`font-bold text-sm ${resultColor(h.result)}`}>{resultText(h.result)}</span>],
                                                                    ["Game", <span className="font-bold text-sm text-(--text) capitalize">{h.game_id}</span>],
                                                                    ["Difficulty", h.difficulty
                                                                        ? <span className="font-bold text-sm text-(--text) capitalize">{h.difficulty}</span>
                                                                        : <span className="font-bold text-sm text-(--text-dim)">—</span>
                                                                    ],
                                                                    ["Date", <span className="font-bold text-sm text-(--text)">{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)}</span>],
                                                                    ["Time", <span className="font-bold text-sm text-(--text)">{new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(date)}</span>],
                                                                    ["Match ID", <span className="font-mono text-xs text-(--text-dim) truncate max-w-45">{h.id}</span>],
                                                                ].map(([label, value]) => (
                                                                    <div key={label as string} className="flex items-center justify-between px-6 py-3 border-b border-(--border) last:border-b-0">
                                                                        <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">{label}</span>
                                                                        {value}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {/* Achievements */}
                    {tab === "achievements" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Achievements</span>
                                <h2 className="font-bold text-lg text-(--text)">Badges</h2>
                            </div>

                            {achievementsLoading ? (
                                <span className="font-mono text-xs text-(--text-dim)">Loading...</span>
                            ) : achievements.length === 0 ? (
                                <span className="font-mono text-xs text-(--text-dim)">No achievements unlocked yet.</span>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {achievements.map(a => (
                                        <div key={a.id} className="flex items-center gap-4 border border-(--border) p-4">
                                            <div className="w-10 h-10 border border-(--border) flex items-center justify-center text-xl shrink-0">
                                                {a.icon.startsWith("/") ? (
                                                    <img src={a.icon} alt={a.name} className="w-6 h-6 object-contain" />
                                                ) : (
                                                    <span>{a.icon}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-sm text-(--text)">{a.name}</span>
                                                    {a.game_id && (
                                                        <span className="font-mono text-[10px] text-(--text-dim) border border-(--border) px-1.5 py-0.5 capitalize">{a.game_id}</span>
                                                    )}
                                                </div>
                                                <span className="font-mono text-[10px] text-(--text-dim)">{a.description}</span>
                                                <span className="font-mono text-[10px] text-(--text-dim) mt-1">
                                                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(a.unlocked_at))}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </motion.div>
    )
}

export default UserProfile