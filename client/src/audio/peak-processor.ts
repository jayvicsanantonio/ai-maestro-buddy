class PeakProcessor extends AudioWorkletProcessor {
  private threshold = 0.15;
  private lastPeakTime = 0;
  private debounceTime = 0.1; // 100ms

  process(inputs: Float32Array[][], outputs: Float32Array[][]) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const channelData = input[0];
    let maxVal = 0;

    for (let i = 0; i < channelData.length; i++) {
      const absVal = Math.abs(channelData[i]);
      if (absVal > maxVal) {
        maxVal = absVal;
      }
    }

    if (maxVal > this.threshold) {
      const now = currentTime;
      if (now - this.lastPeakTime > this.debounceTime) {
        this.lastPeakTime = now;
        this.port.postMessage({ type: 'peak', timestamp: now });
      }
    }

    // Convert to 16-bit PCM for Gemini
    const pcmData = this.floatTo16BitPCM(channelData);
    this.port.postMessage({ type: 'audio', data: pcmData }, [
      pcmData.buffer,
    ]);

    return true;
  }

  private floatTo16BitPCM(float32Array: Float32Array): Int16Array {
    const buffer = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      buffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return buffer;
  }
}

registerProcessor('peak-processor', PeakProcessor);
