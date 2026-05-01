import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { authClient } from "../lib/auth-client"
import { useNavigate } from "react-router";
import MobileMenu from "./MobileMenu";

function Nav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuIsOn, setMenuIsOn] = useState(false);
    const [dropDownIsOn, setDropDownIsOn] = useState(false);

    const { data: session } = authClient.useSession()

    const defaultAvatar = "https://o1n6wjzhyksrqjmz.public.blob.vercel-storage.com/profilepicture.png"

    const navigate = useNavigate();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigate("/auth/login");
                },
                onError: (context) => {
                    console.error("Sign out error:", context.error);
                }
            },
        });
    };

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
                <nav className="hidden sm:flex items-center gap-6 text-[13px] pr-[clamp(30px,_4.5%,_100px)] text-(--text-muted) font-mono">
                    <Link to="/library" className="transition-colors duration-200 hover:text-(--text)">
                        Library
                    </Link>
                    <Link to="/about" className="transition-colors duration-200 hover:text-(--text)">
                        About
                    </Link>
                    <Link to="/log" className="transition-colors duration-200 hover:text-(--text)">
                        Log
                    </Link>
                    {session?.user ? (
                        <div className="relative">
                            <button 
                                className="group flex items-center gap-3 ml-2 p-1 pl-6 border-l border-(--border)" 
                                onClick={() => { setDropDownIsOn(!dropDownIsOn) }}
                            >
                                <ChevronRight 
                                    size={15} 
                                    strokeWidth={1.5} 
                                    className={`group-hover:text-(--text) transition-all duration-200 ${
                                        dropDownIsOn 
                                            ? 'rotate-90' 
                                            : ''
                                    }`} 
                                />
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs text-(--text-dim) group-hover:text-(--text) transition-colors duration-200 truncate">{session?.user?.name || "Unkown"}</span>
                                    <img src={session?.user?.image || defaultAvatar} alt={(session?.user?.name || "Unkown")[0]} className="h-7 p-1 border border-(--border) rounded-xs"/>
                                </div>
                            </button>

                            <ul 
                                className={`
                                    absolute left-4 min-w-28 z-50 top-full mt-2
                                    bg-(--bg) overflow-hidden shadow-md
                                    transition-[max-height,opacity] duration-500 ease-in-out
                                    ${dropDownIsOn 
                                        ? "max-h-60 opacity-100 border border-(--border)" 
                                        : "max-h-0 opacity-0 border-transparent pointer-events-none"
                                    }
                                `}
                            >
                                <li className="list-none">
                                    <button
                                        onClick={() => { 
                                            navigate('/user/settings')
                                            setDropDownIsOn(false); 
                                        }}
                                        className="w-full text-left px-3 py-2 font-mono text-xs uppercase tracking-tighter transition-colors hover:bg-(--border) hover:text-(--text) outline-none"
                                    >
                                        Settings
                                    </button>
                                </li>
                                <li className="list-none">
                                    <button
                                        onClick={() => { 
                                            handleSignOut();
                                            setDropDownIsOn(false); 
                                        }}
                                        className="w-full text-left px-3 py-2 font-mono text-xs uppercase tracking-tighter transition-colors hover:bg-(--border) hover:text-red-400 outline-none"
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6 ml-2 pl-6 border-l border-(--border)">
                            <Link to="/auth/login" className="transition-colors duration-200 hover:text-(--text)">
                                Log in
                            </Link>
                            <Link to="/auth/signup" className="transition-colors duration-200 bg-(--text) text-(--bg) px-3 py-1.5 hover:opacity-80">
                                Sign up
                            </Link>
                        </div>
                    )}
                </nav>
            </header>

            <button className="sm:hidden fixed z-[147] top-[8px] right-0 mr-[calc(clamp(30px,_4.5vw,_100px)_-_12px)] flex flex-col justify-center items-center gap-[5px] w-11 h-11 group" onClick={() => setMenuIsOn(!menuIsOn)}>
                <span className={`block w-5 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full origin-center transition-all duration-300 ${menuIsOn ? "w-7 rotate-45 translate-y-[6.9px]" : ""}`} />
                <span className={`block w-5 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full transition-all duration-300 ${menuIsOn ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block w-5 h-[1.5px] bg-(--text-muted) group-hover:bg-(--text) rounded-full origin-center transition-all duration-300 ${menuIsOn ? "w-7 -rotate-45 -translate-y-[6.9px]" : ""}`} />
            </button>

            <MobileMenu 
                menuIsOn={menuIsOn} 
                setMenuIsOn={setMenuIsOn} 
                session={session} 
                defaultAvatar={defaultAvatar} 
            />
        </>
    );
}

export default Nav;