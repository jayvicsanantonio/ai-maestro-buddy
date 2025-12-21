import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioAnalyzer = (
  onPeak: (timestamp: number) => void
) => {
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(
        2048,
        1,
        1
      );
      processorRef.current = processor;

      const threshold = 0.15; // Volume threshold for claps
      let lastPeakTime = 0;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        let maxVal = 0;
        for (let i = 0; i < inputData.length; i++) {
          if (Math.abs(inputData[i]) > maxVal) {
            maxVal = Math.abs(inputData[i]);
          }
        }

        if (maxVal > threshold) {
          const now = audioContext.currentTime;
          if (now - lastPeakTime > 0.1) {
            // Debounce claps (100ms)
            lastPeakTime = now;
            onPeak(now);
          }
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      setIsListening(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }, [onPeak]);

  const stopListening = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
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
