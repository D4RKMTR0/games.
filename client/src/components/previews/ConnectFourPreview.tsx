import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConnectFourPreviewProps {
    isHovered: boolean;
    className?: string;
}

const COLS = 7
const ROWS = 6

const MOVES = [3, 2, 3, 3, 2, 4, 2, 4, 1, 5, 1, 5, 0, 6]

function dropPiece(board: (string | null)[], col: number): number {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row * COLS + col]) return row
    }
    return -1
}

function ConnectFourPreview({ isHovered, className = "" }: ConnectFourPreviewProps) {
    const [board, setBoard] = useState<(string | null)[]>(Array(ROWS * COLS).fill(null))
    const [step, setStep] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (isHovered) {
            intervalRef.current = setInterval(() => {
                setStep(prev => {
                    if (prev >= MOVES.length) {
                        clearInterval(intervalRef.current!)
                        return prev
                    }

                    const col = MOVES[prev]
                    const player = prev % 2 === 0 ? "R" : "B"

                    setBoard(b => {
                        const next = [...b]
                        const row = dropPiece(next, col)
                        if (row !== -1) next[row * COLS + col] = player
                        return next
                    })

                    return prev + 1
                })
            }, 450)
        } else {
            clearInterval(intervalRef.current!)
            setBoard(Array(ROWS * COLS).fill(null))
            setStep(0)
        }

        return () => clearInterval(intervalRef.current!)
    }, [isHovered])

    return (
        <div className={`relative ${className}`}>
            <div className="grid grid-cols-7 w-full h-full border-l border-t border-(--border)">
                {board.map((cell, index) => {
                    const row = Math.floor(index / COLS)
                    const fallDistance = row + 1

                    return (
                        <div
                            key={index}
                            className="border-r-2 border-b-2 border-(--border) relative overflow-hidden aspect-square"
                        >
                            <AnimatePresence>
                                {cell && (
                                    <motion.div
                                        key={`${index}-${cell}-${step}`}
                                        initial={{ y: `calc(-${fallDistance * 100}% - ${fallDistance}px)` }}
                                        animate={{ y: 0 }}
                                        transition={{ type: "spring", stiffness: 250, damping: 22 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div className={`w-[75%] h-[75%] rounded-full border-2 ${cell === "R" ? "border-(--red-base) bg-(--red-base)/20" : "border-(--blue-base) bg-(--blue-base)/20"}`} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ConnectFourPreview