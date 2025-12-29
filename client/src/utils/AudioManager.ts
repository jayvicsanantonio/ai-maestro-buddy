class AudioManager {
  private context: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
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
}

export const audioManager = new AudioManager();
