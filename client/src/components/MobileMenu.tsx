import React from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { authClient } from '../lib/auth-client';

interface MobileMenuProps {
    menuIsOn: boolean;
    setMenuIsOn: React.Dispatch<React.SetStateAction<boolean>>;
    session: any;
    defaultAvatar: string;
}

function MobileMenu({ menuIsOn, setMenuIsOn, session, defaultAvatar }: MobileMenuProps) {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    setMenuIsOn(false);
                    navigate("/auth/login");
                },
                onError: (context) => {
                    console.error("Sign out error:", context.error);
                }
            },
        });
    };

    return (
        <div className={`sm:hidden fixed inset-0 z-[146] bg-(--bg) transition-opacity duration-200 ${menuIsOn ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <nav className="flex flex-col justify-center h-full px-10">
                {[
                    ["01", "Library", "/library", "/ all games"],
                    ["02", "About", "/about", "/ about this site"],
                    ["03", "Log", "/log", "/ what changed"],
                ].map(([num, label, href, description]) => (
                    <Link 
                        key={num} 
                        to={href} 
                        onClick={() => { setMenuIsOn(false); }} 
                        className="flex items-center justify-between py-7 border-b border-(--border) group transition-colors duration-200"
                    >
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
                        <ChevronRight 
                            strokeWidth={1} 
                            size={30} 
                            className="text-(--text-muted) group-hover:text-(--text) group-hover:translate-x-2 transition-all duration-200"
                        />
                    </Link>
                ))}

                {session ? (
                    <div className="flex flex-col pt-8 border-t border-(--border) gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={session?.user?.image ?? defaultAvatar} 
                                    alt={(session?.user?.name || "?")[0]} 
                                    className="h-7 p-1 border border-(--border) rounded-xs"
                                />
                                <span className="font-mono text-xs text-(--text-dim)">
                                    {session?.user?.name || "Unknown"}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => { 
                                        navigate("/user/settings"); 
                                        setMenuIsOn(false); 
                                    }}
                                    className="font-mono text-xs uppercase tracking-tighter text-(--text-muted) hover:text-(--text) transition-colors duration-200"
                                >
                                    Settings
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-3 py-2 font-mono text-xs uppercase tracking-tighter bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:text-red-200 transition-colors duration-200 outline-none"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 pt-8">
                        <Link 
                            to="/auth/login" 
                            onClick={() => setMenuIsOn(false)} 
                            className="flex-1 flex justify-center items-center py-3 font-mono text-sm text-(--text-muted) border border-(--border) hover:text-(--text) hover:border-(--text-dim) transition-colors duration-200"
                        >
                            Log in
                        </Link>
                        <Link 
                            to="/auth/signup" 
                            onClick={() => setMenuIsOn(false)} 
                            className="flex-1 flex justify-center items-center py-3 font-mono text-sm bg-(--text) text-(--bg) hover:opacity-80 transition-opacity duration-200"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default MobileMenu