
import React, { useState } from 'react';
import { Player, Shape, Piece, Board, GameState } from './types';
import { isValidMove, checkWin, hasAnyLegalMove, getRegion } from './gameLogic';
import { PieceIcon } from './components/PieceIcon';

const INITIAL_BOARD: Board = Array(4).fill(null).map(() => Array(4).fill(null));

const createInitialInventory = (player: Player): Piece[] => {
  const inventory: Piece[] = [];
  const shapes = [Shape.SPHERE, Shape.CYLINDER, Shape.CUBE, Shape.CONE];
  shapes.forEach(shape => {
    inventory.push({ id: `${player}-${shape}-1`, shape, player });
    inventory.push({ id: `${player}-${shape}-2`, shape, player });
  });
  return inventory;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD,
    currentPlayer: Player.LIGHT,
    inventory: {
      [Player.LIGHT]: createInitialInventory(Player.LIGHT),
      [Player.DARK]: createInitialInventory(Player.DARK),
    },
    selectedPieceId: null,
    winner: null,
    gameOver: false,
    lastMove: null,
    statusMessage: "LIGHT'S TURN"
  });

  const [messageTimer, setMessageTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const setStatus = (msg: string, isPermanent = false) => {
    if (messageTimer) clearTimeout(messageTimer);
    setGameState(prev => ({ ...prev, statusMessage: msg }));
    
    if (!isPermanent) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ 
          ...prev, 
          statusMessage: prev.gameOver 
            ? `${prev.winner?.toUpperCase()} WINS` 
            : `${prev.currentPlayer.toUpperCase()}'S TURN` 
        }));
      }, 2500);
      setMessageTimer(timer);
    }
  };

  const handleSelectPiece = (pieceId: string) => {
    if (gameState.gameOver) return;
    setGameState(prev => ({ ...prev, selectedPieceId: pieceId }));
  };

  const handleCellClick = (row: number, col: number) => {
    const { board, currentPlayer, selectedPieceId, inventory, gameOver } = gameState;
    if (gameOver || !selectedPieceId) return;

    const piece = inventory[currentPlayer].find(p => p.id === selectedPieceId);
    if (!piece) return;

    const validation = isValidMove(board, row, col, piece.shape, currentPlayer);
    if (!validation.valid) {
      setStatus(validation.reason || "Invalid Placement");
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = piece;

    const newInventory = {
      ...inventory,
      [currentPlayer]: inventory[currentPlayer].filter(p => p.id !== selectedPieceId)
    };

    const isWin = checkWin(newBoard, row, col);
    if (isWin) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        inventory: newInventory,
        winner: currentPlayer,
        gameOver: true,
        lastMove: { row, col },
        statusMessage: `${currentPlayer.toUpperCase()} VICTORY`
      }));
      return;
    }

    const nextPlayer = currentPlayer === Player.LIGHT ? Player.DARK : Player.LIGHT;
    const canMove = hasAnyLegalMove(newBoard, newInventory[nextPlayer], nextPlayer);

    if (!canMove && newInventory[nextPlayer].length > 0) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        inventory: newInventory,
        winner: currentPlayer,
        gameOver: true,
        lastMove: { row, col },
        statusMessage: `${currentPlayer.toUpperCase()} WINS (STALEMATE)`
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      inventory: newInventory,
      currentPlayer: nextPlayer,
      selectedPieceId: null,
      lastMove: { row, col },
      statusMessage: `${nextPlayer.toUpperCase()}'S TURN`
    }));
  };

  const resetGame = () => {
    setGameState({
      board: INITIAL_BOARD.map(r => [...r]),
      currentPlayer: Player.LIGHT,
      inventory: {
        [Player.LIGHT]: createInitialInventory(Player.LIGHT),
        [Player.DARK]: createInitialInventory(Player.DARK),
      },
      selectedPieceId: null,
      winner: null,
      gameOver: false,
      lastMove: null,
      statusMessage: "LIGHT'S TURN"
    });
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-between py-6 px-4 max-w-md mx-auto relative bg-[#1c1917]">
      
      {/* Header */}
      <div className="w-full flex justify-between items-end mb-2 z-10 px-2">
        <div>
          <h1 className="text-2xl font-light tracking-[0.3em] text-stone-400 uppercase">Quantik</h1>
          <div className="h-[1px] w-12 bg-stone-600 mt-1"></div>
        </div>
        <button 
          onClick={resetGame}
          className="text-[11px] font-medium tracking-widest text-stone-500 hover:text-stone-300 transition-colors uppercase border border-stone-800 px-3 py-1 rounded"
        >
          Reset
        </button>
      </div>

      {/* Opponent Inventory (Top) */}
      <div className="w-full">
        <InventoryRow 
          player={Player.DARK}
          pieces={gameState.inventory[Player.DARK]}
          active={gameState.currentPlayer === Player.DARK && !gameState.gameOver}
          onSelect={handleSelectPiece}
          selectedPieceId={gameState.selectedPieceId}
          isOpponent={true}
        />
      </div>

      {/* Main Board Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-4">
        
        {/* Status Text */}
        <div className={`text-center transition-all duration-500 ${gameState.gameOver ? 'scale-110' : ''}`}>
           <p className={`text-xs tracking-[0.25em] font-medium uppercase ${gameState.gameOver ? 'text-amber-500' : 'text-stone-500'}`}>
             {gameState.statusMessage}
           </p>
        </div>

        {/* Board Container */}
        <div className="w-full aspect-square bg-[#2a2724] rounded-2xl p-3 elevated relative border border-[#3f3b38] shadow-2xl">
          
          {/* Subtle Cross Dividers for Quadrants */}
          <div className="absolute inset-3 pointer-events-none z-0">
            <div className="w-full h-full flex flex-wrap">
              <div className="w-1/2 h-1/2 border-r border-b border-stone-600/20"></div>
              <div className="w-1/2 h-1/2 border-l border-b border-stone-600/20"></div>
              <div className="w-1/2 h-1/2 border-r border-t border-stone-600/20"></div>
              <div className="w-1/2 h-1/2 border-l border-t border-stone-600/20"></div>
            </div>
          </div>

          <div className="w-full h-full grid grid-cols-4 gap-2 relative z-10">
            {gameState.board.map((row, rIdx) => 
              row.map((cell, cIdx) => (
                <div 
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  className={`
                    w-full aspect-square rounded-xl flex items-center justify-center relative transition-all duration-300
                    ${cell ? '' : 'recessed bg-[#201d1b]'}
                    ${!cell && gameState.selectedPieceId ? 'cursor-pointer hover:bg-[#2c2927] ring-1 ring-stone-600' : ''}
                    ${gameState.lastMove?.row === rIdx && gameState.lastMove?.col === cIdx ? 'ring-2 ring-amber-500/50' : ''}
                  `}
                >
                  {cell && (
                    <div className="w-[85%] h-[85%] animate-[fadeIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
                      <PieceIcon shape={cell.shape} player={cell.player} className="w-full h-full" />
                    </div>
                  )}
                  {/* Small guide dot for empty cells, but very subtle */}
                  {!cell && (
                    <div className="w-1 h-1 rounded-full bg-stone-700/30"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Player Inventory (Bottom) */}
      <div className="w-full">
        <InventoryRow 
          player={Player.LIGHT}
          pieces={gameState.inventory[Player.LIGHT]}
          active={gameState.currentPlayer === Player.LIGHT && !gameState.gameOver}
          onSelect={handleSelectPiece}
          selectedPieceId={gameState.selectedPieceId}
          isOpponent={false}
        />
      </div>

    </div>
  );
};

interface InventoryRowProps {
  player: Player;
  pieces: Piece[];
  active: boolean;
  onSelect: (id: string) => void;
  selectedPieceId: string | null;
  isOpponent: boolean;
}

const InventoryRow: React.FC<InventoryRowProps> = ({ player, pieces, active, onSelect, selectedPieceId, isOpponent }) => {
  const shapes = [Shape.SPHERE, Shape.CYLINDER, Shape.CUBE, Shape.CONE];
  
  // Naming: "Bone" and "Ink" for soft aesthetics
  const playerName = player === Player.LIGHT ? "Bone" : "Ink";
  // Colors: Warm Beige vs Cool/Warm Grey
  const playerColor = player === Player.LIGHT ? "text-[#E6E0D0]" : "text-[#78716c]";

  return (
    <div className={`
      w-full rounded-2xl px-3 py-3 transition-all duration-500 border border-transparent
      ${active 
        ? 'bg-[#252220] border-stone-800 shadow-lg opacity-100' 
        : 'opacity-40 grayscale'}
      ${isOpponent ? 'mb-2' : 'mt-2'}
    `}>
      <div className={`flex justify-between items-center mb-1 px-1`}>
        <span className={`text-[10px] tracking-widest font-bold uppercase ${playerColor}`}>{playerName}</span>
        {active && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse"></div>}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {shapes.map(shape => {
          const availablePieces = pieces.filter(p => p.shape === shape);
          const count = availablePieces.length;
          
          return (
            <div key={shape} className="flex flex-col items-center">
              <div className="relative w-full aspect-square flex items-center justify-center">
                {count > 0 ? (
                  <button
                    onClick={() => active && onSelect(availablePieces[0].id)}
                    className={`
                      w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300 relative
                      ${selectedPieceId === availablePieces[0].id ? 'bg-[#2f2b28] scale-105 z-10 shadow-lg ring-1 ring-amber-500/50' : 'hover:bg-[#2a2725]'}
                    `}
                  >
                    <PieceIcon 
                      shape={shape} 
                      player={player} 
                      className="w-[85%] h-[85%]" 
                      isSelected={selectedPieceId === availablePieces[0].id}
                    />
                    {/* Count Dots */}
                    <div className="absolute -bottom-1.5 flex gap-1">
                      {Array.from({length: count}).map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full bg-stone-500`}></div>
                      ))}
                    </div>
                  </button>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center opacity-10">
                     <div className="w-2 h-2 rounded-full bg-stone-700"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
