import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

interface FactCardProps {
  fact: string | null;
  onClose: () => void;
}

export const FactCard: React.FC<FactCardProps> = ({
  fact,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {fact && (
        <div className="fact-overlay">
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fact-card"
          >
            <button className="close-fact" onClick={onClose}>
              <X size={24} />
            </button>

            <div className="fact-header">
              <div className="lightbulb-icon">
                <Lightbulb size={32} className="text-primary" />
              </div>
              <h3>Musical Fun Fact!</h3>
            </div>

            <p className="fact-text">{fact}</p>

            <div className="fact-footer">
              <span className="sparkle">✨</span>
              <span>The more you know!</span>
              <span className="sparkle">✨</span>
            </div>
          </motion.div>

          <style>{`
            .fact-overlay {
              position: fixed;
              bottom: 2rem;
              right: 2rem;
              z-index: 500;
              display: flex;
              align-items: flex-end;
              justify-content: flex-end;
              pointer-events: none;
            }

            .fact-card {
              pointer-events: auto;
              background: #fff;
              color: #2d1b4e;
              padding: 2rem;
              border-radius: 2rem;
              width: 350px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 8px rgba(255, 206, 0, 0.2);
              position: relative;
              display: flex;
              flex-direction: column;
              gap: 1rem;
              border: 3px solid var(--primary);
            }

            .close-fact {
              position: absolute;
              top: 1rem;
              right: 1rem;
              background: none;
              border: none;
              color: #ccc;
              cursor: pointer;
              transition: color 0.2s;
            }

            .close-fact:hover {
              color: #ff4785;
            }

            .fact-header {
              display: flex;
              align-items: center;
              gap: 1rem;
            }

            .lightbulb-icon {
              background: rgba(255, 206, 0, 0.1);
              padding: 0.75rem;
              border-radius: 1rem;
            }

            h3 {
              margin: 0;
              font-size: 1.25rem;
              font-weight: 800;
              color: var(--bg-dark);
            }

            .fact-text {
              font-size: 1.1rem;
              line-height: 1.5;
              font-weight: 500;
              margin: 0;
            }

            .fact-footer {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 0.5rem;
              font-weight: 700;
              color: #ff4785;
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 0.05rem;
            }

            .text-primary { color: var(--primary); }
            
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
            .sparkle {
              animation: bounce 1.5s infinite ease-in-out;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};
