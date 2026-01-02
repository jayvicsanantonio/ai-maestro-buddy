import { useState, useEffect, useRef, useCallback } from 'react';
import type { SessionData, ToolLog } from '../types/shared';

const WS_URL =
  import.meta.env.VITE_WS_URL ||
  'ws://localhost:3001/api/session/stream';
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface UseMaestroSessionProps {
  initialSession?: SessionData;
  onLog: (log: Omit<ToolLog, 'id' | 'timestamp'>) => void;
  onFeedback: (text: string) => void;
  onStateUpdate: (
    tool: string,
    args: Record<string, unknown>
  ) => void;
  onMcpResult: (result: unknown) => void;
}

export const useMaestroSession = ({
  initialSession,
  onLog,
  onFeedback,
  onStateUpdate,
  onMcpResult,
}: UseMaestroSessionProps) => {
  const [session, setSession] = useState<SessionData | null>(
    initialSession || null
  );
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<
    string | null
  >(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      try {
        let data: SessionData;

        if (initialSession && !session) {
          data = initialSession;
          setSession(data);
        } else {
          // If no initial session, we might need to fetch or wait (handled by App.tsx usually)
          // For now assuming session is passed or we fetch
          if (!session) {
            // Only fetch if we really have nothing
            const storedUid = localStorage.getItem('maestro_uid');
            const res = await fetch(`${API_URL}/session/start`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ uid: storedUid }),
            });
            data = await res.json();
            setSession(data);
            localStorage.setItem('maestro_uid', data.uid);
          } else {
            data = session;
          }
        }

        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        // Connect WebSocket
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              type: 'auth',
              sessionId: data.sessionId,
            })
          );
          setIsConnecting(false);
          setConnectionError(null);
        };

        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);

            if (msg.type === 'feedback') {
              if (msg.content) onFeedback(msg.content);
              if (msg.toolTrace) onLog(msg.toolTrace);
              if (msg.stateUpdate) {
                const { tool, args } = msg.stateUpdate;
                onStateUpdate(tool, args);
              }
              if (msg.mcpResult) {
                onMcpResult(msg.mcpResult);
              }
            }
          } catch (err) {
            console.error('Failed to parse WS message', err);
          }
        };

        ws.onerror = (e) => {
          console.error('WebSocket error', e);
          setConnectionError('Connection error.');
        };

        ws.onclose = () => {
          setIsConnecting(true); // Reconnection logic could go here
        };

        wsRef.current = ws;
      } catch (err) {
        console.error('Failed to init session:', err);
        setConnectionError('Could not reach the AI Teacher.');
        setIsConnecting(false);
      }
    };

    initSession();
    return () => {
      // We might not want to close strictly on every re-render if args change,
      // but for now strict cleanup is safer.
      wsRef.current?.close();
    };
  }, [initialSession]); // Removed dependencies that change often to avoid reconnect loops

  const sendMetrics = useCallback(
    (metrics: any) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && session) {
        wsRef.current.send(
          JSON.stringify({
            type: 'metrics',
            sessionId: session.sessionId,
            metrics,
          })
        );
      }
    },
    [session]
  );

  const updateCharacter = async (character: any) => {
    if (!session) return;
    try {
      const res = await fetch(`${API_URL}/student/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: session.uid,
          character,
        }),
      });
      const data = await res.json();
      if (data.student) {
        setSession((prev) =>
          prev ? { ...prev, student: data.student } : null
        );
      }
    } catch (err) {
      console.error('Failed to update character', err);
    }
  };

  return {
    session,
    isConnecting,
    connectionError,
    sendMetrics,
    updateCharacter,
    setSession,
  };
};
