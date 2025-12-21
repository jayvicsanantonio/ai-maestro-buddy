import { useCallback, useEffect, useRef, useState } from 'react';

export const useSpeech = () => {
  const synth = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const updateVoices = () => {
      const v = synth.current?.getVoices() || [];
      setVoices(v);

      // Try to find a high-quality "kid-friendly" voice
      const priority = [
        'Eddy',
        'Flo',
        'Karen',
        'Samantha',
        'Google US English',
      ];
      for (const name of priority) {
        const found = v.find((voice) => voice.name.includes(name));
        if (found) {
          preferredVoiceRef.current = found;
          break;
        }
      }
    };

    updateVoices();
    if (synth.current?.onvoiceschanged !== undefined) {
      synth.current.onvoiceschanged = updateVoices;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synth.current) return;

    // Cancel any ongoing speech
    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (preferredVoiceRef.current) {
      utterance.voice = preferredVoiceRef.current;
    }

    // Adjust for kid-friendly tone
    utterance.pitch = 1.2;
    utterance.rate = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.current.speak(utterance);
  }, []);

  return { speak, voices, isSpeaking };
};
