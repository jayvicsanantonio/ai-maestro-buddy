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
   * Returns a promise that resolves when the connection is open and setup.
   */
  async setup(): Promise<void> {
    if (this.isSetup) return;

    return new Promise((resolve, reject) => {
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

          // Handle setup confirmation from Gemini
          if (msg.setupComplete) {
            this.isSetup = true;
            resolve();
            return;
          }

          const part = msg.serverContent?.modelTurn?.parts?.[0];
          const content = part?.text;
          const audio = part?.inlineData?.data;

          // Only send if there's actual content/audio and client is ready
          if (
            (content || audio) &&
            this.clientWs &&
            this.clientWs.readyState === WebSocket.OPEN
          ) {
            try {
              this.clientWs.send(
                JSON.stringify({
                  type: 'feedback',
                  content,
                  audio,
                })
              );
            } catch (sendErr) {
              console.error(
                'Error sending feedback to client:',
                sendErr
              );
            }
          }
        } catch (err) {
          console.error('Error parsing Gemini Live response:', err);
        }
      });

      this.geminiWs.on('error', (err) => {
        console.error('Gemini Live WebSocket error:', err);
        if (!this.isSetup) {
          reject(err);
        }
      });

      this.geminiWs.on('close', (code, reason) => {
        if (!this.isSetup) {
          reject(
            new Error(
              `Gemini connection closed during setup: ${code} ${reason}`
            )
          );
        } else if (this.clientWs.readyState === WebSocket.OPEN) {
          this.clientWs.send(
            JSON.stringify({
              type: 'error',
              message: 'Gemini connection closed',
            })
          );
        }
        this.close();
      });
    });
  }

  /**
   * Sends audio data to Gemini.
   */
  async sendAudio(base64Data: string): Promise<void> {
    if (
      !this.isSetup ||
      !this.geminiWs ||
      this.geminiWs.readyState !== WebSocket.OPEN
    )
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

    return new Promise((resolve, reject) => {
      this.geminiWs!.send(JSON.stringify(msg), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Closes the connection and resets service state.
   */
  close() {
    if (this.geminiWs) {
      this.geminiWs.removeAllListeners();
      this.geminiWs.close();
      this.geminiWs = null;
    }
    this.isSetup = false;
  }
}
