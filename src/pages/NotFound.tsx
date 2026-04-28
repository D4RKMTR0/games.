import { motion } from "framer-motion"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router"

function NotFound() {
    
    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "linear" }}
            className="flex items-center justify-center min-h-screen px-[clamp(30px,_4.5%,_100px)] py-24"
        >
            <span className="blur-sm fixed inset-0 flex flex-col md:flex-row leading-[0.9] md:leading-none items-center justify-center text-[25rem] font-bold text-(--text) opacity-5 select-none pointer-events-none overflow-hidden ">
                <span>4</span>
                <span className="text-(--text-muted)">0</span>
                <span>4</span>
            </span>
            <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-none gap-5 h-fit h-auto">
                <div className="flex flex-col justify-center gap-4">
                    <span className="font-mono text-xs tracking-widest uppercase text-(--text-dim)">Error 404</span>
                    <h1 className="font-bold text-3xl text-(--text) leading-tight">This page<br />doesn't exist.</h1>
                    <p className="font-mono text-xs text-(--text-dim) leading-loose">You may have mistyped the address,<br />or the page has been moved.</p>
                    <Link to="/" className="font-mono text-xs uppercase tracking-widest text-(--text-dim) hover:text-(--text) transition-colors duration-200 mt-2 flex items-center gap-1 group"> <ArrowLeft size={10} className="transition-transform group-hover:-translate-x-1" />Back Home</Link>
                </div>
                <div className="grid grid-rows-3">
                    {[
                        ["01", "Library", "/library", "all games"],
                        ["02", "About", "/about", "about this site"],
                        ["03", "Log", "/log", "what's changed"],
                    ].map(([num, label, href, description]) => (
                        <Link key={num} to={href} className="flex items-center justify-between py-5 group transition-colors duration-200">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-[10px] tracking-widest text-(--text-muted) group-hover:text-(--text) transition-colors duration-200 mb-1">
                                    {num}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-[24px] font-bold tracking-tight text-(--text-muted) group-hover:text-(--text) transition-colors duration-200">
                                        {label}
                                    </span>
                                    <span className="ml-0.5 block text-xs font-mono text-(--text-dim) mt-[-10px]">
                                        {description}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight strokeWidth={1} size={30} className="text-(--text-muted) group-hover:text-(--text) group-hover:translate-x-2 transition-all duration-200"/>
                        </Link>
                    ))}
                </div>
            </div>
        </motion.main>
    )
}

export default NotFound