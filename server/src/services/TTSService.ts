import textToSpeech from '@google-cloud/text-to-speech';

// Premium Journey voice configuration
const VOICE_CONFIG = {
  languageCode: 'en-US',
  name: 'en-US-Journey-F',
};

export class TTSService {
  private client: textToSpeech.TextToSpeechClient | null = null;

  constructor() {
    try {
      this.client = new textToSpeech.TextToSpeechClient();
    } catch (e) {
      console.warn(
        'Google Cloud TTS Client failed to initialize. Voice features will be disabled.',
        e
      );
    }
  }

  async synthesize(text: string): Promise<Uint8Array | null> {
    if (!this.client) return null;

    try {
      const [response] = await this.client.synthesizeSpeech({
        input: { text },
        voice: VOICE_CONFIG,
        audioConfig: { audioEncoding: 'MP3' },
      });

      return response.audioContent as Uint8Array;
    } catch (err) {
      console.error('TTS Synthesis Error:', err);
      // Fallback or just return null to let client handle it
      return null;
    }
  }
}

export const ttsService = new TTSService();
