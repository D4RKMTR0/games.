import { games } from "../data/games"

function Footer() {

    const liveGames = games.filter(g => g.status === "live")
    const devGames = games.filter(g => g.status === "in-development")

    return (
        <footer className="border-t border-(--border) mt-16 px-[clamp(20px,_4vw,_1000px)]">
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] py-16 gap-12">
                <div className="flex flex-col gap-4">
                    <span className="font-bold text-2xl text-(--text)">Games.</span>
                    <p className="font-mono text-xs text-(--text-dim) leading-loose max-w-60">
                        A small collection of web games,<br />
                        built from scratch. Each line written by hand.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Games</span>
                    <div className="flex flex-col gap-2">
                        {liveGames.map(g => (
                            <a key={g.id} href={g.path} className="font-mono text-xs text-(--text-muted) hover:text-(--text) transition-colors">{g.title}</a>
                        ))}
                        {devGames.map(g => (
                            <span key={g.id} className="font-mono text-xs text-(--text-dim)">{g.title}</span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Links</span>
                    <div className="flex flex-col gap-2">
                        <a className="font-mono text-xs text-(--text-muted) hover:text-(--text) transition-colors">GitHub</a>
                    </div>
                </div>
            </div>

            <div className="border-t border-(--border) py-4 flex justify-between items-center">
                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">2026</span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">made by D4rk</span>
            </div>
        </footer>
    )
}

export default Footer