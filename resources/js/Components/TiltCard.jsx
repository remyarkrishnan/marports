import React, { useRef, useState } from 'react';

export default function TiltCard({
  children,
  className = '',
  decorCorners = true,
  scanLine = true,
  maxTilt = 8,
  glowColor = 'rgba(217, 164, 65, 0.16)',
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    const tiltX = ((y / rect.height) - 0.5) * -maxTilt;
    const tiltY = ((x / rect.width) - 0.5) * maxTilt;

    setCoords({ x: percentX, y: percentY });
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered
          ? 'transform 0.15s ease-out, border-color 0.4s, box-shadow 0.4s'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s',
        '--mouse-x': `${coords.x}%`,
        '--mouse-y': `${coords.y}%`,
      }}
      className={`group relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Dynamic Cursor Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-[2]"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(320px circle at var(--mouse-x) var(--mouse-y), ${glowColor}, transparent 80%)`,
        }}
      />

      {/* High-Tech Corner Brackets */}
      {decorCorners && (
        <>
          <div className="card-decor-tl" />
          <div className="card-decor-tr" />
          <div className="card-decor-bl" />
          <div className="card-decor-br" />
        </>
      )}

      {/* Laser Scanning Line */}
      {scanLine && <div className="card-scan-line" />}

      {/* Card Body */}
      <div className="relative z-[5] h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
