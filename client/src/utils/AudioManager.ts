class AudioManager {
  private context: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as Window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      this.context = new AudioContextClass();
    }
  }

  private resume() {
    if (this.context?.state === 'suspended') {
      this.context.resume();
    }
  }

  playHit(isPerfect: boolean) {
    if (!this.context) return;
    this.resume();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(
      isPerfect ? 880 : 440,
      this.context.currentTime
    );
    osc.frequency.exponentialRampToValueAtTime(
      isPerfect ? 440 : 220,
      this.context.currentTime + 0.1
    );

    gain.gain.setValueAtTime(0.3, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.1
    );

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  playMiss() {
    if (!this.context) return;
    this.resume();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.context.currentTime);
    osc.frequency.linearRampToValueAtTime(
      55,
      this.context.currentTime + 0.2
    );

    gain.gain.setValueAtTime(0.2, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.2
    );

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.2);
  }

  playLevelUp() {
    if (!this.context) return;
    this.resume();

    const now = this.context.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Arpeggio)

    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        now + i * 0.1 + 0.4
      );

      osc.connect(gain);
      gain.connect(this.context!.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  }

  playStreakMilestone() {
    if (!this.context) return;
    this.resume();

    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

    const lfo = this.context.createOscillator();
    const lfoGain = this.context.createGain();
    lfo.frequency.value = 10;
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(now + 0.3);
    lfo.stop(now + 0.3);
  }
}

export const audioManager = new AudioManager();
