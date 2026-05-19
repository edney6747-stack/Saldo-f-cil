import React, { useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RippleProps {
  color?: string;
  duration?: number;
}

interface RippleCircle {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<RippleCircle[]>([]);

  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const container = event.currentTarget.getBoundingClientRect();
    const size = Math.max(container.width, container.height);
    const x = event.clientX - container.left - size / 2;
    const y = event.clientY - container.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  return { ripples, addRipple, setRipples };
}

export function RippleContainer({ ripples, onAnimationComplete, color = "rgba(255, 255, 255, 0.3)" }: { 
  ripples: RippleCircle[], 
  onAnimationComplete: (id: number) => void,
  color?: string 
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => onAnimationComplete(ripple.id)}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: color,
              borderRadius: '50%',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
