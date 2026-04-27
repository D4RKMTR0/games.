import React, { Suspense, useState, useEffect, useRef } from 'react';
import { PREVIEW_COMPONENTS } from './previews/previewregistry';
import { games } from '../data/games';
import { MoveUpRight } from 'lucide-react';
import { Link } from 'react-router';

interface GameCardProps {
    gameId: string;
}

const isTouchDevice = window.matchMedia("(hover: none)").matches

function GameCard({ gameId }: GameCardProps) {
    const [hovered, setHovered] = useState(false)
    const [inView, setInView] = useState(false)
    const cardRef = useRef<HTMLAnchorElement>(null)

    const game = games.find(g => g.id === gameId)
    const SelectedPreview = game?.previewId ? PREVIEW_COMPONENTS[game.previewId] : null;
    const isActive = isTouchDevice ? inView : hovered

    useEffect(() => {
        if (!isTouchDevice) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting)
            },
            { threshold: 0.9 }
        )

        if (cardRef.current) observer.observe(cardRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <Link
            ref={cardRef}
            to={game?.path ?? "#"}
            className={`flex flex-col justify-between p-8 border-b border-r border-t border-(--border) min-h-[400px] group ${game?.status === 'live' ? 'cursor-pointer' : 'pointer-events-none'}`}
            onMouseEnter={() => !isTouchDevice && setHovered(true)}
            onMouseLeave={() => !isTouchDevice && setHovered(false)}
        >
            <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">
                    {game?.status === 'live' ? `RELEASE // ${(game?.releaseOrder ?? 0).toString().padStart(2, '0')}` : "STATUS // IN DEV"}
                </span>
                {game?.status === 'live' && (
                    <span className="text-(--text-dim) group-hover:text-(--text) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                        <MoveUpRight size={10} />
                    </span>
                )}
            </div>
            <div className="flex-1 flex items-center justify-center">
                <Suspense fallback={<div className="w-10 h-10 border-t border-(--border) animate-spin rounded-full" />}>
                    {SelectedPreview ? (
                        <SelectedPreview isHovered={isActive} className="w-32 h-32" />
                    ) : (
                        <div className="w-32 h-32 border border-dashed border-(--border) flex items-center justify-center text-[10px] text-(--text-dim) uppercase">
                            No Preview
                        </div>
                    )}
                </Suspense>
            </div>
            <div className="flex flex-col gap-1">
                <span className={`font-bold text-lg ${game?.status === 'live' ? 'text-(--text)' : 'text-(--text-muted)'}`}>
                    {game?.title ?? "No games yet"}
                </span>
                <span className="font-mono text-xs text-(--text-dim)">{game?.description ?? "—"}</span>
            </div>
        </Link>
    )
}

export default GameCard