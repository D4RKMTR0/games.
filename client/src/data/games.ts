import { lazy, type ComponentType } from "react";

export type GameSettings = {
    difficulty: "easy" | "medium" | "hard";
    mode: "ai" | "local";
    side: "X" | "O";
};

export interface GameProps {
    settings: GameSettings
    onGameStart: () => void
    onGameEnd: () => void
    onBack?: () => void
}

export type Game = {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    status: "live" | "in-development";
    releaseOrder?: number;
    path?: string;
    previewId?: string;
    thumbnail?: string;

    component?: ComponentType<GameProps>;
    defaultSettings?: GameSettings;
}

export const games: Game[] = [
    {
        id: "tictactoe",
        title: "Tic Tac Toe",
        description: "Classic 3×3 grid. X vs O. First to three wins.",
        longDescription:
            "The timeless game of Tic Tac Toe. Place your mark, block your opponent, and claim three in a row — horizontally, vertically, or diagonally. Choose your difficulty and see if you can outsmart the AI.",
        releaseOrder: 1,
        status: "live",
        previewId: "tictactoe",
        path: "/game/tictactoe",

        component: lazy(() => import("../games/TicTacToeGame")),
        defaultSettings: {
            difficulty: "easy",
            mode: "ai",
            side: "X",
        },
    },

    {
        id: "connect-4",
        title: "Connect 4",
        description: "Coming soon — It's in the works!",
        longDescription:
            "Drop your pieces, build your strategy, and connect four in a row before your opponent does. A classic of patience and foresight.",
        status: "in-development",
        releaseOrder: 2,
    },

    {
        id: "snake",
        title: "Snake",
        description: "Coming soon — It's in the works!",
        longDescription:
            "Guide your snake across the board, eat to grow, and don't bite yourself. Simple to learn, impossible to master.",
        status: "in-development",
        releaseOrder: 3,
    },
];