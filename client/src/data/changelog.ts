export type ChangelogEntry = {
    id: string;
    date: string;
    tag: "new game" | "update" | "fix" | "site";
    title: string;
    description: string;
    path?: string;
    previewId?: string;
}

export const changelog: ChangelogEntry[] = [
    {
        id: "tictactoe-launch",
        date: "2026-04-28",
        tag: "new game",
        title: "Tic Tac Toe",
        description: "First game live. A remake of the classic with a Minimax AI opponent.",
        path: "/game/tictactoe",
        previewId: "tictactoe",
    },
    {
        id: "site-launch",
        date: "2026-04-27",
        tag: "site",
        title: "Games. is live",
        description: "The site is up. More games are in the works.",
    },
]