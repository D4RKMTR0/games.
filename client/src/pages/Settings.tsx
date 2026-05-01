import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { authClient } from "../lib/auth-client"
import { api } from "../lib/api"

type Section = "account" | "preferences"

function Settings() {
    const { data: session, refetch } = authClient.useSession()
    const user = session?.user as any

    const [section, setSection] = useState<Section>("account")
    const [name, setName] = useState("")
    const [theme, setTheme] = useState<"dark" | "light">("dark")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            setName(user.name ?? "")
            setTheme(user.theme ?? "dark")
        }
    }, [user])

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(theme)
    }, [theme])

    const handleSave = async () => {
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            await api.patch("/api/user/update", { name, theme })
            await refetch()
            setSuccess(true)
        } catch (e: any) {
            setError("Failed to save changes")
        } finally {
            setLoading(false)
        }
    }

    const sections: { id: Section, label: string, description: string }[] = [
        { id: "account", label: "Account", description: "/ your details" },
        { id: "preferences", label: "Preferences", description: "/ display & behavior" },
    ]

    return (
        <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="flex justify-center items-start mt-15 min-h-[calc(100vh-4rem)] px-[clamp(20px,_4vw,_100px)]"
        >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] w-full max-w-4xl min-h-[80dvh] border border-(--border) mt-10 mb-10">

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
                <div className="p-8 flex flex-col gap-8">

                    {section === "account" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Account</span>
                                <h2 className="font-bold text-xl text-(--text)">Your details</h2>
                            </div>

                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                {user?.image ? (
                                    <img src={user.image} alt="avatar" className="w-14 h-14 rounded-full border border-(--border)" />
                                ) : (
                                    <div className="w-14 h-14 border border-(--border) flex items-center justify-center font-bold text-xl text-(--text-muted)">
                                        {user?.name?.[0]?.toUpperCase() ?? "?"}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-(--text)">{user?.name}</span>
                                    <span className="font-mono text-xs text-(--text-dim)">{user?.email}</span>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Display name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text) outline-none focus:border-(--text-dim) transition-colors duration-200 w-full max-w-sm"
                                />
                            </div>

                            {/* Email — readonly */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Email</label>
                                <input
                                    type="email"
                                    value={user?.email ?? ""}
                                    readOnly
                                    className="bg-transparent border border-(--border) px-3 py-2.5 text-sm text-(--text-dim) outline-none w-full max-w-sm cursor-not-allowed"
                                />
                            </div>
                        </>
                    )}

                    {section === "preferences" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Preferences</span>
                                <h2 className="font-bold text-xl text-(--text)">Display & behavior</h2>
                            </div>

                            {/* Theme */}
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

                    {/* Save */}
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-(--border)">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-(--text) text-(--bg) px-6 py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200 disabled:opacity-40"
                        >
                            {loading ? "Saving..." : "Save changes"}
                        </button>
                        {success && <span className="font-mono text-xs text-(--green-base)">Saved.</span>}
                        {error && <span className="font-mono text-xs text-(--red-base)">{error}</span>}
                    </div>

                </div>
            </div>
        </motion.div>
    )
}

export default Settings