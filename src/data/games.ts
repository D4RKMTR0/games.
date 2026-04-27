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
        description: "A remake of Tic Tac Toe, with Minimax AI",
        releaseOrder: 1,
        status: "live",
        previewId: "tictactoe",
        path: "/games/tictactoe",
    },
    {
        id: "untitled-02",
        title: "Untitled Game 02",
        description: "Coming soon — It's in the works!",
        status: "in-development",
        releaseOrder: 2,
    },
    {
        id: "untitled-03",
        title: "Untitled Game 03",
        description: "Coming soon — It's in the works!",
        status: "in-development",
        releaseOrder: 3,
    },
]