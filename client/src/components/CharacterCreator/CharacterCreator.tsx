import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MaestroCharacter,
  type CharacterSettings,
} from '../MaestroCharacter/MaestroCharacter';
import { Palette, Crown, Eye, Check } from 'lucide-react';

interface CharacterCreatorProps {
  initialSettings?: CharacterSettings;
  onSave: (settings: CharacterSettings) => void;
  onCancel?: () => void;
}

const COLORS = [
  '#4FB8FF',
  '#FF4785',
  '#4ADE80',
  '#FBCC24',
  '#A855F7',
];
const ACCESSORIES: ('none' | 'headphones' | 'cap' | 'bow')[] = [
  'none',
  'headphones',
  'cap',
  'bow',
];
const EYE_STYLES: ('round' | 'star' | 'wink')[] = [
  'round',
  'star',
  'wink',
];

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  initialSettings,
  onSave,
  onCancel,
}) => {
  const [settings, setSettings] = useState<CharacterSettings>(
    initialSettings || {
      color: '#4FB8FF',
      accessory: 'none',
      eyeStyle: 'round',
    }
  );

  const [activeTab, setActiveTab] = useState<
    'color' | 'accessory' | 'eyes'
  >('color');

  return (
    <div className="creator-container">
      <div className="creator-preview">
        <MaestroCharacter
          isSpeaking={false}
          isPlaying={false}
          settings={settings}
        />
        <h2 className="creator-title">Design Your Buddy!</h2>
      </div>

      <div className="creator-controls">
        <div className="creator-tabs">
          <button
            className={`tab-button ${
              activeTab === 'color' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('color')}
          >
            <Palette size={20} />
            <span>Color</span>
          </button>
          <button
            className={`tab-button ${
              activeTab === 'accessory' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('accessory')}
          >
            <Crown size={20} />
            <span>Style</span>
          </button>
          <button
            className={`tab-button ${
              activeTab === 'eyes' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('eyes')}
          >
            <Eye size={20} />
            <span>Eyes</span>
          </button>
        </div>

        <div className="creator-options">
          {activeTab === 'color' && (
            <div className="option-grid color-grid">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`option-button color-button ${
                    settings.color === c ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() =>
                    setSettings({ ...settings, color: c })
                  }
                >
                  {settings.color === c && (
                    <Check size={24} color="white" />
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'accessory' && (
            <div className="option-grid">
              {ACCESSORIES.map((a) => (
                <button
                  key={a}
                  className={`option-button text-button ${
                    settings.accessory === a ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setSettings({ ...settings, accessory: a })
                  }
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'eyes' && (
            <div className="option-grid">
              {EYE_STYLES.map((e) => (
                <button
                  key={e}
                  className={`option-button text-button ${
                    settings.eyeStyle === e ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setSettings({ ...settings, eyeStyle: e })
                  }
                >
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="creator-actions">
          {onCancel && (
            <button className="secondary-button" onClick={onCancel}>
              Go Back
            </button>
          )}
          <button
            className="primary-button"
            onClick={() => onSave(settings)}
          >
            Looks Awesome!
          </button>
        </div>
      </div>

      <style>{`
        .creator-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          max-width: 500px;
          margin: 0 auto;
        }

        .creator-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .creator-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          margin: 0;
          text-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .creator-controls {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .creator-tabs {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(0,0,0,0.2);
          padding: 0.4rem;
          border-radius: 2rem;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: 1.5rem;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-button.active {
          background: var(--primary);
          color: var(--bg-dark);
          box-shadow: 0 4px 12px rgba(255, 206, 0, 0.3);
        }

        .creator-options {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .option-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        .option-button {
          cursor: pointer;
          border: 4px solid transparent;
          transition: all 0.2s;
        }

        .color-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-button.selected {
          border-color: white;
          transform: scale(1.1);
        }

        .text-button {
          padding: 0.8rem 1.5rem;
          border-radius: 1rem;
          background: rgba(255,255,255,0.1);
          color: white;
          font-weight: 700;
          font-size: 1rem;
        }

        .text-button.selected {
          background: white;
          color: var(--bg-dark);
          transform: translateY(-2px);
        }

        .creator-actions {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .primary-button {
          flex: 2;
          background: var(--primary);
          color: var(--bg-dark);
          border: none;
          padding: 1.2rem;
          border-radius: 1.5rem;
          font-size: 1.2rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 20px rgba(255, 206, 0, 0.2);
        }

        .primary-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(255, 206, 0, 0.3);
        }

        .secondary-button {
          flex: 1;
          background: rgba(255,255,255,0.1);
          color: white;
          border: 2px solid rgba(255,255,255,0.1);
          padding: 1.2rem;
          border-radius: 1.5rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-button:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
};
