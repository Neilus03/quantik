
import React from 'react';
import { Shape, Player } from '../types';

interface PieceIconProps {
  shape: Shape;
  player: Player;
  className?: string;
  isSelected?: boolean;
}

export const PieceIcon: React.FC<PieceIconProps> = ({ shape, player, className = "", isSelected = false }) => {
  const isLight = player === Player.LIGHT;
  
  // Palette: "Wabi-Sabi"
  // Light: Bone / Washi Paper (Warm, Natural Off-White)
  // Dark: Sumi / Soft Charcoal (Matte, Deep Warm Grey)
  const c = isLight ? {
    top: '#F7F4EB',    // Highlight / Top face
    sideLight: '#E6E0D0', // Lit side
    sideDark: '#D1C9B3',  // Shadow side
    stroke: 'rgba(0,0,0,0.05)'
  } : {
    top: '#595554',    // Highlight / Top face
    sideLight: '#454241', // Lit side
    sideDark: '#2E2B2C',  // Shadow side
    stroke: 'rgba(255,255,255,0.05)'
  };

  // Soft, diffuse drop shadow for a "placed on board" feel
  const filter = isSelected 
    ? "drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))" 
    : "drop-shadow(0 4px 5px rgba(0,0,0,0.25))";

  const renderShape = () => {
    switch (shape) {
      case Shape.SPHERE:
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ filter }}>
            <defs>
              <radialGradient id={`grad-sphere-${player}`} cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor={c.top} />
                <stop offset="50%" stopColor={c.sideLight} />
                <stop offset="100%" stopColor={c.sideDark} />
              </radialGradient>
            </defs>
            {/* Main Body */}
            <circle cx="50" cy="50" r="38" fill={`url(#grad-sphere-${player})`} stroke={c.stroke} strokeWidth="0.5" />
          </svg>
        );
      case Shape.CYLINDER:
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ filter }}>
            <defs>
              <linearGradient id={`grad-cyl-${player}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={c.sideLight} />
                <stop offset="100%" stopColor={c.sideDark} />
              </linearGradient>
            </defs>
            {/* Body */}
            <path d="M22 30 L22 75 A28 10 0 0 0 78 75 L78 30" fill={`url(#grad-cyl-${player})`} stroke={c.stroke} strokeWidth="0.5" />
            {/* Top Face */}
            <ellipse cx="50" cy="30" rx="28" ry="12" fill={c.top} stroke={c.stroke} strokeWidth="0.5" />
          </svg>
        );
      case Shape.CUBE:
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ filter }}>
            {/* Top Face */}
            <path d="M50 18 L82 34 L50 50 L18 34 Z" fill={c.top} stroke={c.stroke} strokeWidth="0.5" />
            {/* Left Face (Darker than top, lighter than right) */}
            <path d="M18 34 L50 50 L50 82 L18 66 Z" fill={c.sideLight} stroke={c.stroke} strokeWidth="0.5" />
            {/* Right Face (Darkest) */}
            <path d="M50 50 L82 34 L82 66 L50 82 Z" fill={c.sideDark} stroke={c.stroke} strokeWidth="0.5" />
          </svg>
        );
      case Shape.CONE:
        return (
          <svg viewBox="0 0 100 100" className={className} style={{ filter }}>
             <defs>
              <linearGradient id={`grad-cone-${player}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={c.sideLight} />
                <stop offset="50%" stopColor={c.sideLight} />
                <stop offset="100%" stopColor={c.sideDark} />
              </linearGradient>
            </defs>
            {/* Cone Body */}
            {/* Using a path that simulates the curvature */}
            <path d="M50 15 L18 78 Q50 90 82 78 Z" fill={`url(#grad-cone-${player})`} stroke={c.stroke} strokeWidth="0.5" />
          </svg>
        );
    }
  };

  return renderShape();
};
