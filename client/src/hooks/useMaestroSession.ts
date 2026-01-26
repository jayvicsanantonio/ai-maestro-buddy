import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  CharacterSettings,
  SessionData,
  ToolLog,
} from '../types/shared';

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
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const sessionRef = useRef<SessionData | null>(null);

  // Use refs for callbacks to avoid reconnect loops when they change
  const onFeedbackRef = useRef(onFeedback);
  const onLogRef = useRef(onLog);
  const onStateUpdateRef = useRef(onStateUpdate);
  const onMcpResultRef = useRef(onMcpResult);

  useEffect(() => {
    onFeedbackRef.current = onFeedback;
    onLogRef.current = onLog;
    onStateUpdateRef.current = onStateUpdate;
    onMcpResultRef.current = onMcpResult;
  }, [onFeedback, onLog, onStateUpdate, onMcpResult]);

  useEffect(() => {
    const initSession = async () => {
      try {
        let data: SessionData;
        const existingSession = sessionRef.current;

        if (initialSession && !existingSession) {
          data = initialSession;
          setSession(data);
        } else {
          // If no initial session, we might need to fetch or wait (handled by App.tsx usually)
          // For now assuming session is passed or we fetch
          if (!existingSession) {
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
            data = existingSession;
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
              if (msg.content) onFeedbackRef.current(msg.content);
              if (msg.toolTrace) onLogRef.current(msg.toolTrace);
              if (msg.stateUpdate) {
                const { tool, args } = msg.stateUpdate;
                onStateUpdateRef.current(tool, args);
              }
              if (msg.mcpResult) {
                onMcpResultRef.current(msg.mcpResult);
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
          setIsConnecting(true);
          if (reconnectTimerRef.current !== null) return;
          const attempt = reconnectAttemptsRef.current;
          const delay = Math.min(1000 * 2 ** attempt, 10000);
          reconnectTimerRef.current = window.setTimeout(() => {
            reconnectTimerRef.current = null;
            reconnectAttemptsRef.current += 1;
            void initSession();
          }, delay);
        };

        wsRef.current = ws;
        reconnectAttemptsRef.current = 0;
      } catch (err) {
        console.error('Failed to init session:', err);
        setConnectionError('Could not reach the AI Teacher.');
        setIsConnecting(false);
      }
    };

    initSession();
    return () => {
      if (reconnectTimerRef.current !== null) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      // We might not want to close strictly on every re-render if args change,
      // but for now strict cleanup is safer.
      wsRef.current?.close();
    };
  }, [initialSession]);

  const sendMetrics = useCallback(
    (metrics: Record<string, unknown>) => {
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

  const sendAudio = useCallback(
    (base64: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && session) {
        wsRef.current.send(
          JSON.stringify({
            type: 'audio',
            sessionId: session.sessionId,
            audio: base64,
          })
        );
      }
    },
    [session]
  );

  const updateCharacter = async (character: CharacterSettings) => {
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
    sendAudio,
    updateCharacter,
    setSession,
  };
};
