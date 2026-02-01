import React from 'react';
import { motion } from 'framer-motion';

interface ParticleProps {
  color: string;
}

const Particle: React.FC<ParticleProps> = ({ color }) => {
  const [coords, setCoords] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  React.useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    setCoords({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    });
  }, []);

  if (!coords) return null;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: coords.x, y: coords.y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
      }}
    />
  );
};

interface SparkleBurstProps {
  type: 'perfect' | 'good' | 'off';
}

export const SparkleBurst: React.FC<SparkleBurstProps> = ({
  type,
}) => {
  if (type === 'off') return null;

  const color = type === 'perfect' ? '#ffce00' : '#4fb8ff';
  const particles = Array.from({ length: 12 });

  return (
    <div style={{ position: 'relative' }}>
      {particles.map((_, i) => (
        <Particle key={i} color={color} />
      ))}
    </div>
  );
};
