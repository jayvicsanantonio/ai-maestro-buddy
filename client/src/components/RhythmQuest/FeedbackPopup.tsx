import React from 'react';
import { motion } from 'framer-motion';
import { SparkleBurst } from './SparkleBurst';

interface FeedbackPopupProps {
  text: string;
  type: 'perfect' | 'good' | 'off';
}

export const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  text,
  type,
}) => {
  const colors = {
    perfect: '#ffce00',
    good: '#4fb8ff',
    off: '#ff4785',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: type === 'perfect' ? [0, 1.5, 1.2, 1] : [0, 1.2, 1, 1],
        y: -120,
        rotate: type === 'perfect' ? [0, -10, 10, 0] : 0,
      }}
      transition={{
        duration: 0.8,
        type: 'spring',
        stiffness: 300,
        damping: 15,
      }}
      style={{
        position: 'absolute',
        zIndex: 100,
        pointerEvents: 'none',
        color: colors[type],
        fontSize: type === 'perfect' ? '3.5rem' : '2.5rem',
        fontWeight: 900,
        textShadow: `0 0 30px ${colors[type]}66`,
        fontFamily: "'Fredoka', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3, repeat: 1 }}
      >
        <SparkleBurst type={type} />
      </motion.div>
      <span
        style={{
          background:
            type === 'perfect'
              ? 'linear-gradient(to bottom, #fff, #ffce00)'
              : 'none',
          WebkitBackgroundClip: type === 'perfect' ? 'text' : 'none',
          WebkitTextFillColor:
            type === 'perfect' ? 'transparent' : 'inherit',
        }}
      >
        {text.toUpperCase()}
      </span>
      {type === 'perfect' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="dopamine-label"
          style={{ fontSize: '1rem', color: '#fff', opacity: 0.8 }}
        >
          MAESTRO LEVEL! ✨
        </motion.div>
      )}
    </motion.div>
  );
};
