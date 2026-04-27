import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface TooltipProps {
    content: React.ReactNode
    children: React.ReactNode
}

function Tooltip({ content, children }: TooltipProps) {
    const [visible, setVisible] = useState(false)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)

    const x = useSpring(rawX, { stiffness: 200, damping: 20, mass: 0.5 })
    const y = useSpring(rawY, { stiffness: 200, damping: 20, mass: 0.5 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const tooltipWidth = tooltipRef.current?.offsetWidth ?? 200
            const overflowsRight = e.clientX + 16 + tooltipWidth > window.innerWidth

            rawX.set(overflowsRight ? e.clientX - tooltipWidth - 16 : e.clientX + 16)
            rawY.set(e.clientY + 16)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <>
            <div
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
            >
                {children}
            </div>

            <motion.div
                ref={tooltipRef}
                className={`fixed z-50 pointer-events-none top-0 left-0 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
                style={{ x, y }}
            >
                <div className="relative p-[1px] overflow-hidden flex items-center justify-center">
                    <div
                        className="absolute animate-spin-slow"
                        style={{
                            width: "1500%",
                            height: "1500%",
                            background: "conic-gradient(from 0deg, transparent, var(--text-muted), transparent)",
                        }}
                    />
                    <div className="relative bg-(--bg) px-4 py-3 font-mono text-xs text-(--text-muted)">
                        {content}
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Tooltip