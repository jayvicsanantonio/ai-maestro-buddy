import React, { useState } from 'react';
import { Terminal, Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolLog {
  id: string;
  tool: string;
  args: any;
  status: 'pending' | 'success' | 'error';
  timestamp: Date;
}

export const DeveloperHUD: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<ToolLog[]>([
    {
      id: '1',
      tool: 'load_student_profile',
      args: { uid: 'guest-123' },
      status: 'success',
      timestamp: new Date(),
    },
  ]);

  return (
    <div className="hud-wrapper">
      <button
        className="hud-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bug size={20} />
        <span>Dev HUD</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            className="hud-content"
          >
            <div className="hud-header">
              <Terminal size={16} />
              <span>Agent Tool Trace</span>
            </div>
            <div className="hud-logs">
              {logs.map((log) => (
                <div key={log.id} className="hud-log-item">
                  <div className="log-meta">
                    <span className={`status-dot ${log.status}`} />
                    <span className="log-tool">{log.tool}</span>
                    <span className="log-time">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="log-args">
                    {JSON.stringify(log.args, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hud-wrapper {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }

        .hud-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1a1a1a;
          color: #4ade80;
          border: 1px solid #333;
          padding: 0.8rem 1.2rem;
          border-radius: 0.8rem;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .hud-content {
          position: absolute;
          bottom: 4.5rem;
          right: 0;
          width: 400px;
          height: 400px;
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        }

        .hud-header {
          padding: 0.8rem 1rem;
          background: #1a1a1a;
          border-bottom: 1px solid #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #888;
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .hud-logs {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .hud-log-item {
          margin-bottom: 1.5rem;
          border-left: 2px solid #333;
          padding-left: 1rem;
        }

        .log-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.success { background: #4ade80; }
        .status-dot.pending { background: #fbbf24; }
        .status-dot.error { background: #ef4444; }

        .log-tool {
          color: #4ade80;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .log-time {
          color: #555;
          font-size: 0.75rem;
          margin-left: auto;
        }

        .log-args {
          background: #151515;
          padding: 0.8rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: #888;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
};
