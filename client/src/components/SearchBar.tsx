import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
}

function SearchBar({searchTerm, setSearchTerm}: SearchBarProps) {
    const searchPlaceholders = ["SEARCH...", "SEARCH GAMES...", "TIC TAC TOE...", "PLAY..."];
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [displayPlaceholder, setDisplayPlaceholder] = useState("");
    
    useEffect(() => {
        const currentFullWord = searchPlaceholders[phraseIndex];
        
        const timeout = setTimeout(() => {
            if (!isDeleting && charIndex < currentFullWord.length) {
                setDisplayPlaceholder(currentFullWord.substring(0, charIndex + 1));
                setCharIndex(prev => prev + 1);
            } else if (isDeleting && charIndex > 0) {
                setDisplayPlaceholder(currentFullWord.substring(0, charIndex - 1));
                setCharIndex(prev => prev - 1);
            } else if (!isDeleting && charIndex === currentFullWord.length) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % searchPlaceholders.length);
            }
        }, isDeleting ? 100 : 150);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, phraseIndex, searchPlaceholders]);

    return (
        <div className="flex items-center font-mono rounded-sm transition-colors duration-200 border border-(--border) hover:border-(--text-muted) w-[clamp(110px,35vw,200px)]">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value)}}
                placeholder={searchTerm ? "" : displayPlaceholder}
                className={`text-sm md:text-xs p-1 outline-none w-full ${searchTerm ? "text-(--text)" : "text-(--text-muted)"}`}
            />
            <Search size={15} className="text-(--text-dim) m-1"/>
        </div>
    )
}

export default SearchBar