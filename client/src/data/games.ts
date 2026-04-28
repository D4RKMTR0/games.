export type Game = {
    id: string;
    title: string;
    description: string;
    status: "live" | "in-development";
    releaseOrder?: number;
    path?: string;
    previewId?: string;
    thumbnail?: string;
}

export const games: Game[] = [
    {
        id: "tictactoe",
        title: "Tic Tac Toe",
        description: "A remake of the classic game, with Minimax AI",
        releaseOrder: 1,
        status: "live",
        previewId: "tictactoe",
        path: "/games/tictactoe",
    },
    {
        id: "connect-4",
        title: "Connect 4",
        description: "Coming soon — It's in the works!",
        status: "in-development",
        releaseOrder: 2,
    },
    {
        id: "snake",
        title: "Snake",
        description: "Coming soon — It's in the works!",
        status: "in-development",
        releaseOrder: 3,
    },
]