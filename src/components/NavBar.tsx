import { useEffect, useState } from "react";

function Nav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuIsOn, setMenuIsOn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY >= 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header className={`h-[60px] fixed w-full z-[40] flex items-center transition-all duration-200 border-b justify-between ${isScrolled ? "bg-(--bg)/40 border-(--border) backdrop-blur-sm" : "border-(--bg) bg-(--bg)"}`}>
                <a href="/" className="flex items-baseline font-mono pl-[clamp(30px,_4.5%,_100px)] gap-1.5 text-[13px]">
                    <span className="font-semibold">Games</span>
                    <span className="text-(--text-muted)">/ by d4rk</span>
                </a>
                <nav className="hidden sm:flex gap-6 text-[13px] pr-[clamp(30px,_4.5%,_100px)] text-(--text-muted) font-mono">
                    <a href="/" className="transition-colors duration-200 hover:text-(--text)">Library</a>
                    <a href="/about" className="transition-colors duration-200 hover:text-(--text)">About</a>
                    <a href="/now" className="transition-colors duration-200 hover:text-(--text)">Now</a>
                </nav>
            </header>

            <button className="sm:hidden fixed z-[100] top-[18px] right-0 mr-[clamp(30px,_4.5vw,_100px)] flex flex-col justify-center items-center gap-[4px] w-6 h-6 group" onClick={() => setMenuIsOn(!menuIsOn)}>
                <span className={`block w-4 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full origin-center transition-all duration-300 ${menuIsOn ? "w-5 rotate-45 translate-y-[5.3px]" : ""}`} />
                <span className={`block w-4 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full transition-all duration-300 ${menuIsOn ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block w-4 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full origin-center transition-all duration-300 ${menuIsOn ? "w-5 -rotate-45 -translate-y-[5.3px]" : ""}`} />
            </button>

            <div className={`sm:hidden fixed inset-0 z-[60] bg-(--bg) transition-opacity duration-300 ${menuIsOn ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <nav className="flex flex-col justify-center h-full px-10">
                    {[
                        ["01", "Library", "/", "/ all games"],
                        ["02", "About", "/about", "/ about the site"],
                        ["03", "Now", "/now", "/ what's next"],
                    ].map(([num, label, href, description]) => (
                        <a key={num} href={href} className="flex items-center gap-4 py-7 border-b border-(--border) group transition-colors duration-200">
                            <span className="font-mono text-[10px] tracking-widest text-(--text-muted) group-hover:text-(--text) transition-colors duration-200 mb-1">
                                {num}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[28px] font-bold tracking-tight text-(--text-muted) group-hover:text-(--text) transition-colors duration-200">
                                    {label}
                                </span>
                                <span className="block text-xs font-mono text-(--text-dim) mt-[-10px]">
                                    {description}
                                </span>
                            </div>
                        </a>
                    ))}
                </nav>
            </div>
        </>
    );
}

export default Nav;