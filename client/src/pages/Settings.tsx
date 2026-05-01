import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import { authClient } from "../lib/auth-client"
import { api } from "../lib/api"

type Section = "account" | "preferences" | "stats"

interface Stats {
    game_id: string
    won: number
    lost: number
    drew: number
}

function Settings() {
    const { data: session, refetch } = authClient.useSession()
    const user = session?.user as any
    const navigate = useNavigate()

    const [section, setSection] = useState<Section>("account")
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [theme, setTheme] = useState<"dark" | "light">("dark")
    const [loading, setLoading] = useState(false)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [resetLoading, setResetLoading] = useState(false);
    const [showResetAvatarConfirm, setShowResetAvatarConfirm] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState<Stats[]>([])
    const [statsLoading, setStatsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (user) {
            setName(user.name ?? "")
            setUsername(user.username ?? "")
            setTheme(user.theme ?? "dark")
        }
    }, [user])

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(theme)
    }, [theme])

    useEffect(() => {
        if (section === "stats") {
            setStatsLoading(true)
            api.get("/api/stats")
                .then(data => setStats(data ?? []))
                .catch(() => setStats([]))
                .finally(() => setStatsLoading(false))
        }
    }, [section])

    const handleSave = async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            await api.patch("/api/user/update", { name, username, theme })
            await refetch()
            setSuccess('true')
        } catch (e: any) {
            setError("Failed to save changes")
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setAvatarLoading(true)
        setError(null)
        try {
            const formData = new FormData()
            formData.append("avatar", file)

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/avatar`, {
                method: "POST",
                credentials: "include",
                body: formData,
            })

            if (!res.ok) throw new Error("Upload failed")
            await refetch()
        } catch (e: any) {
            setError("Failed to upload avatar")
        } finally {
            setAvatarLoading(false)
        }
    }

    const handleSignOut = async () => {
        await authClient.signOut()
        navigate("/")
    }

    const handleDeleteAccount = async () => {
        setDeleteLoading(true)
        try {
            await api.delete("/api/user/delete")
            await authClient.signOut()
            navigate("/")
        } catch (e: any) {
            setError("Failed to delete account")
        } finally {
            setDeleteLoading(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleResetAvatar = async () => {
        setResetLoading(true);
        try {
            await api.patch("/api/user/reset-avatar", { });
            
            setSuccess('Successfully reset avatar.')
            setShowResetAvatarConfirm(false)
        } catch (e: any) {
            setError("Failed to reset profile picture");
        } finally {
            setResetLoading(false);
        }
    };

    const totalGames = stats.reduce((acc, s) => acc + s.won + s.lost + s.drew, 0)
    const totalWins = stats.reduce((acc, s) => acc + s.won, 0)
    const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0
    const favoriteGame = stats.length > 0
        ? stats.reduce((a, b) => (a.won + a.lost + a.drew) > (b.won + b.lost + b.drew) ? a : b).game_id
        : null

    const sections: { id: Section, label: string, description: string }[] = [
        { id: "account", label: "Account", description: "/ your details" },
        { id: "preferences", label: "Preferences", description: "/ display & behavior" },
        { id: "stats", label: "Stats", description: "/ your performance" },
    ]

    return (
        <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="flex justify-center items-start mt-15 min-h-[calc(100vh-4rem)] px-[clamp(20px,_4vw,_100px)]"
        >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] w-full max-w-4xl h-[80dvh] border border-(--border) mt-10 mb-10">

                {/* Sidebar */}
                <div className="border-b md:border-b-0 md:border-r border-(--border) p-6 flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim) mb-4">Settings</span>
                    {sections.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSection(s.id)}
                            className={`flex flex-col items-start px-3 py-3 border transition-colors duration-200 text-left ${section === s.id ? "border-(--border) bg-(--bg-subtle)" : "border-transparent hover:border-(--border)"}`}
                        >
                            <span className={`font-bold text-sm transition-colors duration-200 ${section === s.id ? "text-(--text)" : "text-(--text-muted)"}`}>{s.label}</span>
                            <span className="font-mono text-[10px] text-(--text-dim)">{s.description}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="pt-8 pl-8 pr-8 flex flex-col gap-8 overflow-y-auto">

                    {section === "account" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Account</span>
                                <h2 className="font-bold text-xl text-(--text)">Your details</h2>
                            </div>

                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={avatarLoading}
                                    className="relative group shrink-0"
                                >
                                    {user?.image ? (
                                        <img src={user.image} alt="avatar" className="w-14 h-14 rounded-full border border-(--border) object-cover" />
                                    ) : (
                                        <div className="w-14 h-14 border border-(--border) flex items-center justify-center font-bold text-xl text-(--text-muted)">
                                            {user?.name?.[0]?.toUpperCase() ?? "?"}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 rounded-full bg-(--bg)/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <span className="font-mono text-[9px] tracking-widest uppercase text-(--text)">
                                            {avatarLoading ? "..." : "Change"}
                                        </span>
                                    </div>
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-(--text)">{user?.name}</span>
                                    <span className="font-mono text-xs text-(--text-dim)">@{user?.username}</span>
                                    <span className="font-mono text-[10px] text-(--text-dim) mt-1">Click avatar to change</span>
                                </div>
                            </div>

                            {/* Display name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Display name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text) outline-none focus:border-(--text-dim) transition-colors duration-200 w-full max-w-sm"
                                />
                            </div>

                            {/* Username */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Username</label>
                                <div className="flex items-center border border-(--border) max-w-sm focus-within:border-(--text-dim) transition-colors duration-200">
                                    <span className="font-mono text-sm text-(--text-dim) pl-3">@</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                                        className="bg-transparent px-2 py-2.5 text-sm text-(--text) outline-none w-full"
                                    />
                                </div>
                                <span className="font-mono text-[10px] text-(--text-dim)">games-d4rk.vercel.app/user/{username || "username"}</span>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Email</label>
                                <input
                                    type="email"
                                    value={user?.email ?? ""}
                                    readOnly
                                    className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text-dim) outline-none w-full max-w-sm cursor-not-allowed"
                                />
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="w-fit font-mono text-xs tracking-widest uppercase text-(--text-muted) hover:text-(--text) transition-colors duration-200"
                            >
                                Sign out
                            </button>

                            <div className="flex flex-col gap-4 pt-2 border-t border-(--border)">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-muted)">Reset to defaults</span>

                                {!showResetAvatarConfirm ? (
                                    <button
                                        onClick={() => setShowResetAvatarConfirm(true)}
                                        className="w-fit border border-(--text-muted) text-(--text-muted) px-4 py-2 font-mono text-xs tracking-widest uppercase hover:bg-(--bg-mid) transition-colors duration-200"
                                    >
                                        Reset Avatar
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-3 border border-(--border) p-4 max-w-sm">
                                        <p className="font-mono text-xs text-(--text-dim) leading-relaxed">
                                            This will reset your profile avatar back to the default. Continue?
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleResetAvatar}
                                                disabled={deleteLoading}
                                                className="border border-(--text-muted) text-(--text-muted) px-4 py-2 font-mono text-xs tracking-widest uppercase hover:bg-(--bg-mid) transition-colors duration-200 disabled:opacity-40"
                                            >
                                                {resetLoading ? "Resetting..." : "Confirm reset"}
                                            </button>
                                            <button
                                                onClick={() => setShowResetAvatarConfirm(false)}
                                                className="border border-(--border) text-(--text-muted) px-4 py-2 font-mono text-xs tracking-widest uppercase hover:text-(--text) transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 pt-2 border-t border-(--red-muted)">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--red-base)">Danger zone</span>

                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-fit border border-(--red-base) text-(--red-base) px-4 py-2 font-mono text-xs tracking-widest uppercase hover:bg-(--red-muted) transition-colors duration-200"
                                    >
                                        Delete account
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-3 border border-(--red-base) p-4 max-w-sm">
                                        <p className="font-mono text-xs text-(--text-dim) leading-relaxed">
                                            This will permanently delete your account and all your data. This cannot be undone.
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleDeleteAccount}
                                                disabled={deleteLoading}
                                                className="border border-(--red-base) text-(--red-base) px-4 py-2 font-mono text-xs tracking-widest uppercase hover:bg-(--red-muted) transition-colors duration-200 disabled:opacity-40"
                                            >
                                                {deleteLoading ? "Deleting..." : "Confirm delete"}
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="border border-(--border) text-(--text-muted) px-4 py-2 font-mono text-xs tracking-widest uppercase hover:text-(--text) transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {section === "preferences" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Preferences</span>
                                <h2 className="font-bold text-xl text-(--text)">Display & behavior</h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Theme</label>
                                <div className="flex gap-3">
                                    {(["dark", "light"] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTheme(t)}
                                            className={`px-6 py-2.5 border font-mono text-xs tracking-widest uppercase transition-all duration-200 ${theme === t ? "border-(--text-dim) text-(--text)" : "border-(--border) text-(--text-dim) hover:border-(--border-mid)"}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {section === "stats" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Stats</span>
                                <h2 className="font-bold text-xl text-(--text)">Your performance</h2>
                            </div>

                            {statsLoading ? (
                                <span className="font-mono text-xs text-(--text-dim)">Loading...</span>
                            ) : stats.length === 0 ? (
                                <span className="font-mono text-xs text-(--text-dim)">No games played yet.</span>
                            ) : (
                                <>
                                    <div className="grid grid-cols-3 border border-(--border)">
                                        {[
                                            ["Total games", totalGames.toString()],
                                            ["Win rate", `${winRate}%`],
                                            ["Favorite", favoriteGame ?? "—"],
                                        ].map(([label, value]) => (
                                            <div key={label} className="flex flex-col gap-1 p-4 border-r last:border-r-0 border-(--border)">
                                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">{label}</span>
                                                <span className="font-bold text-lg text-(--text)">{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col border-t border-(--border)">
                                        {stats.map(s => (
                                            <div key={s.game_id} className="flex items-center justify-between py-4 border-b border-(--border)">
                                                <span className="font-bold text-sm text-(--text) capitalize">{s.game_id}</span>
                                                <div className="flex gap-6 font-mono text-xs text-(--text-dim)">
                                                    <span><span className="text-(--green-base)">{s.won}</span> W</span>
                                                    <span><span className="text-(--red-base)">{s.lost}</span> L</span>
                                                    <span><span className="text-(--text-muted)">{s.drew}</span> D</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {section !== "stats" && (
                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-(--border) md:sticky md:bottom-0 md:bg-(--bg) pb-4">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-(--text) text-(--bg) px-6 py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200 disabled:opacity-40"
                            >
                                {loading ? "Saving..." : "Save changes"}
                            </button>
                            {success && <span className="font-mono text-xs text-(--green-base)">{success}</span>}
                            {error && <span className="font-mono text-xs text-(--red-base)">{error}</span>}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default Settings