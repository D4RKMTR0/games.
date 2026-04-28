import { lazy } from "react";

export const PREVIEW_COMPONENTS: Record<string, any> = {
  tictactoe: lazy(() => import('./TicTacToePreview')),
};