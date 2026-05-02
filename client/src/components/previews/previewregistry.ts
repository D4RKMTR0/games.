import { lazy, type ComponentType } from "react";

export const PREVIEW_COMPONENTS: Record<string, ComponentType<any>> = {
  tictactoe: lazy(() => import('./TicTacToePreview')),
};