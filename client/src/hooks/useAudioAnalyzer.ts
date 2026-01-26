import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioAnalyzer = (
  onPeak: (timestamp: number) => void,
  onAudio?: (data: Int16Array) => void
) => {
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Load the AudioWorklet processor
      const workletUrl = new URL(
        '../audio/peak-processor.ts',
        import.meta.url
      );
      await audioContext.audioWorklet.addModule(workletUrl);

      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(
        audioContext,
        'peak-processor'
      );
      workletNodeRef.current = workletNode;

      workletNode.port.onmessage = (event) => {
        if (event.data.type === 'peak') {
          onPeak(event.data.timestamp);
        } else if (event.data.type === 'audio' && onAudio) {
          onAudio(event.data.data);
        }
      };

      source.connect(workletNode);
      // No need to connect to destination unless we want to hear back (monitoring)

      setIsListening(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }, [onPeak, onAudio]);

  const stopListening = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return { isListening, startListening, stopListening };
};
