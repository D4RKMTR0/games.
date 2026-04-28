import { useEffect, useRef, useState } from "react";

interface FadeInProps {
    children: React.ReactNode;
    direction?: "up" | "down" | "left" | "right" | "none";
    offset?: number;
    delay?: number;
    duration?: number;
    className?: string;
}

function FadeIn({ children, direction = "none", delay = 0, offset = 20, duration = 400, className = "" }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    const getTransform = (direction: 'up' | 'down' | 'left' | 'right' | 'none', offset: number) => {
        const directionMap = {
            'up': `translateY(${offset}px)`,
            'down': `translateY(-${offset}px)`,
            'left': `translateX(${offset}px)`,
            'right': `translateX(-${offset}px)`,
            'none': 'none'
        }
        return directionMap[direction]
    }

    const style = {
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : getTransform(direction, offset),
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisible(true)
                observer.disconnect()
            }
        }, { threshold: 0.2 })

        if (ref.current) observer.observe(ref.current)

        return () => observer.disconnect()
    }, [])

    return (
        <div ref={ref} style={style} className={className}>
            {children}
        </div>
    )
}

export default FadeIn