import { useState, forwardRef, useImperativeHandle } from 'react';
import { Terminal, Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToolLog {
  id: string;
  tool: string;
  args: Record<string, unknown>;
  status: 'pending' | 'success' | 'error';
  timestamp: Date;
}

export interface DeveloperHUDHandle {
  addLog: (log: Omit<ToolLog, 'id' | 'timestamp'>) => void;
}

export const DeveloperHUD = forwardRef<DeveloperHUDHandle>(
  (_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<ToolLog[]>([]);

    useImperativeHandle(ref, () => ({
      addLog: (newLog) => {
        setLogs((prev) => [
          {
            ...newLog,
            id: Math.random().toString(36).slice(2, 9),
            timestamp: new Date(),
          },
          ...prev.slice(0, 49),
        ]);
      },
    }));

    return (
      <div className="hud-wrapper">
        <button
          className="hud-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bug size={18} />
          <span>Agent HUD</span>
          {isOpen ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronUp size={14} />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="hud-content"
            >
              <div className="hud-header">
                <Terminal size={14} />
                <span>Developer Trace Control</span>
              </div>
              <div className="hud-logs">
                {logs.length === 0 && (
                  <p className="no-logs">
                    Waiting for agent activity...
                  </p>
                )}
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
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }

        .hud-toggle {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          color: #4ade80;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.6rem 1rem;
          border-radius: 0.8rem;
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .hud-toggle:hover {
          background: rgba(36, 36, 36, 0.9);
          border-color: #4ade80;
        }

        .hud-content {
          position: absolute;
          bottom: 3.5rem;
          right: 0;
          width: 380px;
          height: 450px;
          background: rgba(10, 10, 11, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }

        .hud-header {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #666;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05rem;
        }

        .hud-logs {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .hud-logs::-webkit-scrollbar { width: 4px; }
        .hud-logs::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

        .no-logs {
          color: #444;
          text-align: center;
          margin-top: 4rem;
          font-size: 0.8rem;
          font-style: italic;
        }

        .hud-log-item {
          margin-bottom: 1.25rem;
          border-left: 2px solid #222;
          padding-left: 1rem;
          transition: all 0.2s;
        }

        .hud-log-item:hover {
          border-left-color: #4ade80;
        }

        .log-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.4rem;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-dot.success { background: #4ade80; box-shadow: 0 0 10px #4ade80; }
        .status-dot.pending { background: #fbbf24; }
        .status-dot.error { background: #ef4444; }

        .log-tool {
          color: #4ade80;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .log-time {
          color: #444;
          font-size: 0.65rem;
          margin-left: auto;
        }

        .log-args {
          background: rgba(255, 255, 255, 0.02);
          padding: 0.75rem;
          border-radius: 0.4rem;
          font-size: 0.7rem;
          color: #888;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
      `}</style>
      </div>
    );
  }
);
