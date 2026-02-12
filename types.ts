
export enum Shape {
  SPHERE = 'sphere',
  CYLINDER = 'cylinder',
  CUBE = 'cube',
  CONE = 'cone'
}

export enum Player {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface Piece {
  id: string;
  shape: Shape;
  player: Player;
}

export type BoardCell = Piece | null;

export type Board = BoardCell[][];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  inventory: {
    [Player.LIGHT]: Piece[];
    [Player.DARK]: Piece[];
  };
  selectedPieceId: string | null;
  winner: Player | null;
  gameOver: boolean;
  lastMove: { row: number; col: number } | null;
  statusMessage: string;
}
