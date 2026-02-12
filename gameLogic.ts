
import { Shape, Player, Board, Piece, BoardCell } from './types';

export const getRegion = (row: number, col: number): number => {
  if (row < 2) {
    return col < 2 ? 0 : 1;
  } else {
    return col < 2 ? 2 : 3;
  }
};

export const getCellsInRegion = (regionIndex: number): { row: number; col: number }[] => {
  const regions = [
    [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }],
    [{ r: 0, c: 2 }, { r: 0, c: 3 }, { r: 1, c: 2 }, { r: 1, c: 3 }],
    [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 3, c: 0 }, { r: 3, c: 1 }],
    [{ r: 2, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 3 }],
  ];
  return regions[regionIndex].map(p => ({ row: p.r, col: p.c }));
};

export const isValidMove = (
  board: Board,
  row: number,
  col: number,
  shape: Shape,
  currentPlayer: Player
): { valid: boolean; reason?: string } => {
  if (board[row][col] !== null) return { valid: false, reason: "Cell is occupied" };

  // Check Row for ANY piece with the same shape
  for (let c = 0; c < 4; c++) {
    const piece = board[row][c];
    if (piece && piece.shape === shape) {
      return { valid: false, reason: `A ${shape} is already in this row` };
    }
  }

  // Check Column for ANY piece with the same shape
  for (let r = 0; r < 4; r++) {
    const piece = board[r][col];
    if (piece && piece.shape === shape) {
      return { valid: false, reason: `A ${shape} is already in this column` };
    }
  }

  // Check Region for ANY piece with the same shape
  const regionIndex = getRegion(row, col);
  const regionCells = getCellsInRegion(regionIndex);
  for (const cell of regionCells) {
    const piece = board[cell.row][cell.col];
    if (piece && piece.shape === shape) {
      return { valid: false, reason: `A ${shape} is already in this region` };
    }
  }

  return { valid: true };
};

export const checkWin = (board: Board, row: number, col: number): boolean => {
  // Check Row
  const rowShapes = new Set<Shape>();
  let rowCount = 0;
  for (let c = 0; c < 4; c++) {
    const piece = board[row][c];
    if (piece) {
      rowShapes.add(piece.shape);
      rowCount++;
    }
  }
  if (rowCount === 4 && rowShapes.size === 4) return true;

  // Check Column
  const colShapes = new Set<Shape>();
  let colCount = 0;
  for (let r = 0; r < 4; r++) {
    const piece = board[r][col];
    if (piece) {
      colShapes.add(piece.shape);
      colCount++;
    }
  }
  if (colCount === 4 && colShapes.size === 4) return true;

  // Check Region
  const regionIndex = getRegion(row, col);
  const regionCells = getCellsInRegion(regionIndex);
  const regionShapes = new Set<Shape>();
  let regionCount = 0;
  for (const cell of regionCells) {
    const piece = board[cell.row][cell.col];
    if (piece) {
      regionShapes.add(piece.shape);
      regionCount++;
    }
  }
  if (regionCount === 4 && regionShapes.size === 4) return true;

  return false;
};

export const hasAnyLegalMove = (board: Board, inventory: Piece[], currentPlayer: Player): boolean => {
  const shapesAvailable = Array.from(new Set(inventory.map(p => p.shape)));
  
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === null) {
        for (const shape of shapesAvailable) {
          if (isValidMove(board, r, c, shape, currentPlayer).valid) {
            return true;
          }
        }
      }
    }
  }
  return false;
};
