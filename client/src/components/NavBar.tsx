import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

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
            <header className={`h-[60px] fixed w-full z-[145] flex items-center transition-all duration-200 border-b justify-between ${isScrolled ? "bg-(--bg)/40 border-(--border) backdrop-blur-sm" : "border-(--bg) bg-(--bg)"}`}>
                <Link to="/" className="flex items-baseline font-mono pl-[clamp(30px,_4.5%,_100px)] gap-1.5 text-[13px]">
                    <span className="font-semibold">Games.</span>
                    <span className="text-(--text-muted)">/ by d4rk</span>
                </Link>
                <nav className="hidden sm:flex gap-6 text-[13px] pr-[clamp(30px,_4.5%,_100px)] text-(--text-muted) font-mono">
                    <Link to="/library" className="transition-colors duration-200 hover:text-(--text)">
                        Library
                    </Link>
                    <Link to="/about" className="transition-colors duration-200 hover:text-(--text)">
                        About
                    </Link>
                    <Link to="/log" className="transition-colors duration-200 hover:text-(--text)">
                        Log
                    </Link>
                </nav>
            </header>

            <button className="sm:hidden fixed z-[147] top-[8px] right-0 mr-[calc(clamp(30px,_4.5vw,_100px)_-_12px)] flex flex-col justify-center items-center gap-[5px] w-11 h-11 group" onClick={() => setMenuIsOn(!menuIsOn)}>
                <span className={`block w-5 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full origin-center transition-all duration-300 ${menuIsOn ? "w-7 rotate-45 translate-y-[6.9px]" : ""}`} />
                <span className={`block w-5 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full transition-all duration-300 ${menuIsOn ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block w-5 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full origin-center transition-all duration-300 ${menuIsOn ? "w-7 -rotate-45 -translate-y-[6.9px]" : ""}`} />
            </button>

            <div className={`sm:hidden fixed inset-0 z-[146] bg-(--bg) transition-opacity duration-200 ${menuIsOn ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <nav className="flex flex-col justify-center h-full px-10">
                    {[
                        ["01", "Library", "/library", "/ all games"],
                        ["02", "About", "/about", "/ about this site"],
                        ["03", "Log", "/log", "/ what changed"],
                    ].map(([num, label, href, description]) => (
                        <Link key={num} to={href} onClick={() => {setMenuIsOn(false)}} className="flex items-center justify-between py-7 border-b border-(--border) group transition-colors duration-200">
                            <div className="flex items-center gap-4">
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
                            </div>
                            <ChevronRight strokeWidth={1} size={30} className="text-(--text-muted) group-hover:text-(--text) group-hover:translate-x-2 transition-all duration-200"/>
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}

export default Nav;