import { useState, useEffect, useRef } from "react";
import { X, Circle } from "lucide-react";

const MOVES = [4, 1, 0, 8, 3, 6, 5];

interface TicTacToePreviewProps {
    isHovered: boolean;
    className?: string;
}

function TicTacToePreview({ isHovered, onGameStart, onGameEnd , className = "" }: TicTacToePreviewProps) {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [, setStep] = useState(0);
    const [showWin, setShowWin] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isHovered) {
            intervalRef.current = setInterval(() => {
                setStep(prev => {
                    if (prev >= MOVES.length) {
                        clearInterval(intervalRef.current!);
                        setShowWin(true);
                        return prev;
                    }

                    setBoard(b => {
                        const next = [...b];
                        next[MOVES[prev]] = prev % 2 === 0 ? "X" : "O";
                        return next;
                    });

                    return prev + 1;
                });
            }, 400);
        } else {
            clearInterval(intervalRef.current!);
            setBoard(Array(9).fill(null));
            setStep(0);
            setShowWin(false);
        }

        return () => clearInterval(intervalRef.current!);
    }, [isHovered]);

    return (
        <div className={`relative ${className}`}>
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full border border-(--border)">
                {board.map((cell, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-center bg-(--bg) border border-(--border)"
                    >
                        <div className="w-2/3 h-2/3 flex items-center justify-center">
                            {cell === "X" && (
                                <div className="animate-ttt-pop">
                                    <X
                                        className="w-full h-full text-(--red-base)"
                                    />
                                </div>
                            )}

                            {cell === "O" && (
                                <div className="animate-ttt-pop">
                                    <Circle
                                        className="w-full h-full text-(--blue-base)"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showWin && (
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 3 3"
                    preserveAspectRatio="none"
                >
                    <line
                        x1="0.2"
                        y1="1.5"
                        x2="2.8"
                        y2="1.5"
                        stroke="var(--red-base)"
                        strokeWidth="0.045"
                        strokeLinecap="round"
                        className="animate-ttt-line"
                    />
                </svg>
            )}
        </div>
    );
}

export default TicTacToePreview;