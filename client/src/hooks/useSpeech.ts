import { useCallback, useRef, useState } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synth = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );

  const speakNative = useCallback((text: string) => {
    if (!synth.current) return;

    // Cancel any previous speech
    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Adjust for kid-friendly tone (fallback)
    utterance.pitch = 1.2;
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.current.speak(utterance);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      try {
        // 1. Cancel any previous audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }

        setIsSpeaking(true);

        // 2. Fetch high-quality audio from the BFF
        const response = await fetch(
          'http://localhost:3001/api/tts',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          }
        );

        if (!response.ok) {
          console.warn(
            'Premium TTS failed, falling back to native browser speech.'
          );
          return speakNative(text);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // 3. Play the audio
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };

        audio.onerror = () => {
          console.warn(
            'Audio playback failed, falling back to native browser speech.'
          );
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          speakNative(text);
        };

        await audio.play();
      } catch (err) {
        console.error('Cloud TTS Error:', err);
        // Final fallback
        speakNative(text);
      }
    },
    [speakNative]
  );

  return { speak, isSpeaking };
};
