import { Circle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { GameProps } from "../data/games";
import { api } from "../lib/api";

const WINNING_LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
]

const CELL_CENTERS: [number, number][] = [
    [0.5, 0.5], [1.5, 0.5], [2.5, 0.5],
    [0.5, 1.5], [1.5, 1.5], [2.5, 1.5],
    [0.5, 2.5], [1.5, 2.5], [2.5, 2.5],
]

function extendLine(a: [number, number], b: [number, number], amount = 0.35): [[number, number], [number, number]] {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.sqrt(dx * dx + dy * dy)
    const ux = dx / len
    const uy = dy / len
    return [
        [a[0] - ux * amount, a[1] - uy * amount],
        [b[0] + ux * amount, b[1] + uy * amount],
    ]
}

function checkWinner(board: string[]) {
    for (const [a, b, c] of WINNING_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: [a, b, c] }
        }
    }
    return null
}

function isDraw(board: string[]) {
    return board.every(cell => cell !== "") && !checkWinner(board)
}

function getEasyMove(board: string[]): number {
    const empty = board.map((c, i) => c === "" ? i : -1).filter(i => i !== -1)
    return empty[Math.floor(Math.random() * empty.length)]
}

function getMediumMove(board: string[], aiSide: string, playerSide: string): number {
    const empty = board.map((c, i) => c === "" ? i : -1).filter(i => i !== -1)

    for (const i of empty) {
        board[i] = aiSide
        if (checkWinner(board)) { board[i] = ""; return i }
        board[i] = ""
    }

    for (const i of empty) {
        board[i] = playerSide
        if (checkWinner(board)) { board[i] = ""; return i }
        board[i] = ""
    }

    return getEasyMove(board)
}

function minimax(board: string[], isMaximizing: boolean, aiSide: string, playerSide: string): number {
    const result = checkWinner(board)
    if (result?.winner === aiSide) return 10
    if (result?.winner === playerSide) return -10
    if (isDraw(board)) return 0

    const empty = board.map((c, i) => c === "" ? i : -1).filter(i => i !== -1)

    if (isMaximizing) {
        let best = -Infinity
        for (const i of empty) {
            board[i] = aiSide
            best = Math.max(best, minimax(board, false, aiSide, playerSide))
            board[i] = ""
        }
        return best
    } else {
        let best = Infinity
        for (const i of empty) {
            board[i] = playerSide
            best = Math.min(best, minimax(board, true, aiSide, playerSide))
            board[i] = ""
        }
        return best
    }
}

function getHardMove(board: string[], aiSide: string, playerSide: string): number {
    const empty = board.map((c, i) => c === "" ? i : -1).filter(i => i !== -1)
    let bestVal = -Infinity
    let bestMove = empty[0]

    for (const i of empty) {
        board[i] = aiSide
        const val = minimax(board, false, aiSide, playerSide)
        board[i] = ""
        if (val > bestVal) { bestVal = val; bestMove = i }
    }

    return bestMove
}

function getAIMove(board: string[], difficulty: string, aiSide: string, playerSide: string): number {
    if (difficulty === "easy") return getEasyMove(board)
    if (difficulty === "medium") return getMediumMove([...board], aiSide, playerSide)
    return getHardMove([...board], aiSide, playerSide)
}

async function saveResult(result: "won" | "lost" | "drew", difficulty: string) {
    try {
        await Promise.all([
            api.post("/api/stats/tictactoe", {
                won: result === "won" ? 1 : 0,
                lost: result === "lost" ? 1 : 0,
                drew: result === "drew" ? 1 : 0,
                data: {},
            }),
            api.post("/api/user/history", {
                game_id: "tictactoe",
                result,
                difficulty,
            }),
        ])
    } catch {
        // silently fail
    }
}

function TicTacToeGame({ settings, onGameStart, onGameEnd, onBack }: GameProps) {
    const aiSide = settings.side === "X" ? "O" : "X"

    const [board, setBoard] = useState<string[]>(Array(9).fill(""))
    const [isAIThinking, setIsAIThinking] = useState(settings.mode === "ai" && settings.side === "O")
    const [gameOver, setGameOver] = useState(false)
    const [result, setResult] = useState<"won" | "lost" | "drew" | null>(null)
    const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X")
    const [gameStarted, setGameStarted] = useState(settings.mode === "ai" && settings.side === "O")
    const [winLine, setWinLine] = useState<number[] | null>(null)

    const resetGame = (notify = true) => {
        setBoard(Array(9).fill(""))
        setGameOver(false)
        setResult(null)
        setCurrentTurn("X")
        setWinLine(null)
        setGameStarted(settings.mode === "ai" && settings.side === "O")
        setIsAIThinking(settings.mode === "ai" && settings.side === "O")
        if (notify) onGameEnd()
    }

    useEffect(() => {
        resetGame(false)
    }, [settings.mode, settings.side, settings.difficulty])

    const handleGameOver = (res: "won" | "lost" | "drew", line: number[] | null = null) => {
        setGameOver(true)
        setResult(res)
        setWinLine(line)
        onGameEnd()
        if (settings.mode === "ai") saveResult(res, settings.difficulty)
    }

    const handleClick = (index: number) => {
        if (board[index] !== "" || isAIThinking || gameOver) return

        if (!gameStarted) {
            setGameStarted(true)
            onGameStart()
        }

        const newBoard = [...board]
        newBoard[index] = currentTurn
        setBoard(newBoard)

        const winner = checkWinner(newBoard)
        if (winner) {
            handleGameOver(winner.winner === settings.side ? "won" : "lost", winner.line)
            return
        }

        if (isDraw(newBoard)) {
            handleGameOver("drew")
            return
        }

        if (settings.mode === "ai") {
            setIsAIThinking(true)
        } else {
            setCurrentTurn(prev => prev === "X" ? "O" : "X")
        }
    }

    useEffect(() => {
        if (!isAIThinking || gameOver || settings.mode !== "ai") return

        if (!gameStarted) {
            setGameStarted(true)
            onGameStart()
        }

        const timeout = setTimeout(() => {
            const move = getAIMove([...board], settings.difficulty, aiSide, settings.side)

            const newBoard = [...board]
            newBoard[move] = aiSide
            setBoard(newBoard)

            const winner = checkWinner(newBoard)
            if (winner) {
                handleGameOver(winner.winner === settings.side ? "won" : "lost", winner.line)
            } else if (isDraw(newBoard)) {
                handleGameOver("drew")
            } else {
                setCurrentTurn(settings.side)
            }

            setIsAIThinking(false)
        }, 500)

        return () => clearTimeout(timeout)
    }, [isAIThinking])

    const resultColor = (r: typeof result) => {
        if (r === "won") return settings.side === "X" ? "text-(--red-base)" : "text-(--blue-base)"
        if (r === "lost") return aiSide === "X" ? "text-(--red-base)" : "text-(--blue-base)"
        return "text-(--text)"
    }

    const winLineColor = () => {
        if (!winLine) return ""
        const winner = board[winLine[0]]
        return winner === "X" ? "var(--red-base)" : "var(--blue-base)"
    }

    const localWinColor = currentTurn === "X" ? "text-(--red-base)" : "text-(--blue-base)"

    return (
        <div className="flex flex-col gap-4 items-center w-full">

            {/* Status + restart */}
            <div className="flex items-center justify-between w-full max-w-md">
                <span className="font-mono text-xs text-(--text-dim)">
                    {gameOver
                        ? ""
                        : isAIThinking
                            ? "AI is thinking..."
                            : settings.mode === "local"
                                ? `${currentTurn}'s turn`
                                : "Your turn"
                    }
                </span>
                {gameStarted && !gameOver && (
                    <button
                        onClick={() => resetGame()}
                        className="font-mono text-xs tracking-widest uppercase text-(--text-muted) hover:text-(--text) transition-colors duration-200"
                    >
                        Restart
                    </button>
                )}
            </div>

            {/* Board */}
            <div className="relative flex items-center justify-center w-full">
                <div className="relative grid grid-cols-3 aspect-square w-full max-w-md border-l-3 border-t-3 border-(--border)">
                    {board.map((cell, index) => (
                        <button
                            key={index}
                            className={`flex justify-center items-center border-r-3 border-b-3 border-(--border) aspect-square cursor-pointer ${board[index] !== "" || isAIThinking || gameOver ? "pointer-events-none" : ""}`}
                            onClick={() => handleClick(index)}
                        >
                            {cell === "O" ? (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <Circle className="w-full h-full p-[clamp(8px,_3vw,_20px)] text-(--blue-base)" strokeWidth={1.5} />
                                </motion.div>
                            ) : cell === "X" ? (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <X className="w-full h-full p-[clamp(8px,_3vw,_20px)] text-(--red-base)" strokeWidth={1.5} />
                                </motion.div>
                            ) : null}
                        </button>
                    ))}

                    {/* Win line SVG */}
                    {winLine && (() => {
                        const [start, end] = extendLine(CELL_CENTERS[winLine[0]], CELL_CENTERS[winLine[2]])
                        return (
                            <svg
                                className="absolute inset-0 w-full h-full pointer-events-none"
                                viewBox="0 0 3 3"
                                preserveAspectRatio="none"
                            >
                                <motion.line
                                    x1={start[0]} y1={start[1]}
                                    x2={end[0]}   y2={end[1]}
                                    stroke={winLineColor()}
                                    strokeWidth="0.06"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                />
                            </svg>
                        )
                    })()}
                </div>

                {/* Game over overlay */}
                {gameOver && result && (
                    <div className="absolute inset-0 flex items-center justify-center bg-(--bg)/80 backdrop-blur-sm">
                        <div className="flex flex-col gap-4 border border-(--border) bg-(--bg) p-8 items-center">
                            <span className="font-mono text-[10px] tracking-widest uppercase text-(--text-dim)">Game over</span>

                            {settings.mode === "ai" ? (
                                <>
                                    {result === "won" && <span className={`font-bold text-2xl ${resultColor(result)}`}>You win</span>}
                                    {result === "lost" && <span className={`font-bold text-2xl ${resultColor(result)}`}>AI wins</span>}
                                    {result === "drew" && <span className="font-bold text-2xl text-(--text)">Draw</span>}
                                </>
                            ) : (
                                <>
                                    {result !== "drew"
                                        ? <span className={`font-bold text-2xl ${localWinColor}`}>{currentTurn} wins</span>
                                        : <span className="font-bold text-2xl text-(--text)">Draw</span>
                                    }
                                </>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button
                                    onClick={() => resetGame()}
                                    className="bg-(--text) text-(--bg) px-6 py-2.5 font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity duration-200"
                                >
                                    Rematch
                                </button>
                                <button
                                    onClick={() => { setGameOver(false); setResult(null); onGameEnd() }}
                                    className="border border-(--border) text-(--text-muted) px-6 py-2.5 font-mono text-xs tracking-widest uppercase hover:text-(--text) transition-colors duration-200"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TicTacToeGame