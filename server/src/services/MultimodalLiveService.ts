import { WebSocket } from 'ws';
import { config } from '../config/env.js';

/**
 * Service to manage a real-time multimodal session with Gemini.
 * Proxies audio data to Gemini and handles the streaming response.
 */
export class MultimodalLiveService {
  private geminiWs: WebSocket | null = null;
  private clientWs: WebSocket;
  private isSetup = false;

  constructor(clientWs: WebSocket) {
    this.clientWs = clientWs;
  }

  /**
   * Initializes the connection to Gemini Multimodal Live API.
   */
  async setup() {
    if (this.isSetup) return;

    // The endpoint for Vertex AI Multimodal Live (BiDi)
    const url = `wss://${config.location}-aiplatform.googleapis.com/v1/projects/${config.projectId}/locations/${config.location}/publishers/google/models/${config.geminiModel}:streamGenerateContent`;

    // Note: In a real production environment, we would handle Auth tokens here.
    // For the hackathon, we assume the environment has Application Default Credentials.
    this.geminiWs = new WebSocket(url);

    this.geminiWs.on('open', () => {
      console.log('Connected to Gemini Multimodal Live API');
      // Send setup message
      const setupMsg = {
        setup: {
          model: `projects/${config.projectId}/locations/${config.location}/publishers/google/models/${config.geminiModel}`,
          generation_config: {
            response_modalities: ['AUDIO', 'TEXT'],
          },
        },
      };
      this.geminiWs?.send(JSON.stringify(setupMsg));
    });

    this.geminiWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        // Forward relevant parts back to the client (voice or text)
        this.clientWs.send(
          JSON.stringify({
            type: 'feedback',
            content: msg.serverContent?.modelTurn?.parts?.[0]?.text,
            audio:
              msg.serverContent?.modelTurn?.parts?.[0]?.inlineData
                ?.data, // Base64 audio if present
          })
        );
      } catch (err) {
        console.error('Error parsing Gemini Live response:', err);
      }
    });

    this.geminiWs.on('error', (err) => {
      console.error('Gemini Live WebSocket error:', err);
    });

    this.isSetup = true;
  }

  /**
   * Sends audio data to Gemini.
   */
  sendAudio(base64Data: string) {
    if (!this.geminiWs || this.geminiWs.readyState !== WebSocket.OPEN)
      return;

    const msg = {
      realtime_input: {
        media_chunks: [
          {
            data: base64Data,
            mime_type: 'audio/pcm;rate=16000',
          },
        ],
      },
    };
    this.geminiWs.send(JSON.stringify(msg));
  }

  close() {
    this.geminiWs?.close();
  }
}
