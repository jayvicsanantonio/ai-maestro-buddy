import WebSocket from 'ws';
import { GoogleGenAI, type Session } from '@google/genai';
import { config } from '../config/env.js';

/**
 * Service to manage a real-time multimodal session with Gemini.
 * Proxies audio data to Gemini and handles the streaming response.
 */
export class MultimodalLiveService {
  private session: Session | null = null;
  private clientWs: WebSocket;
  private genAI: GoogleGenAI;
  private isSetup = false;

  constructor(clientWs: WebSocket) {
    this.clientWs = clientWs;
    this.genAI = new GoogleGenAI({
      project: config.projectId as string,
      location: config.location,
      vertexai: true,
    });
  }

  /**
   * Initializes the connection to Gemini Multimodal Live API.
   * Returns a promise that resolves when the connection is open and setup.
   */
  async setup(): Promise<void> {
    if (this.isSetup) return;

    return new Promise((resolve, reject) => {
      this.genAI.live
        .connect({
          model: config.geminiModel,
          config: {
            generationConfig: {
              responseModalities: ['AUDIO', 'TEXT'] as any[],
            },
          },
          callbacks: {
            onopen: () => {
              console.log('Connected to Gemini Multimodal Live API');
              this.isSetup = true;
              resolve();
            },
            onmessage: (msg) => {
              // Message is unknown, safely cast for inspection
              const data = msg as { serverContent?: any };
              const serverContent = data.serverContent;
              const modelTurn = serverContent?.modelTurn;
              const part = modelTurn?.parts?.[0];

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
            },
            onerror: (err: unknown) => {
              console.error('Gemini Live session error:', err);
              if (!this.isSetup) {
                reject(err);
              }
            },
            onclose: () => {
              if (this.clientWs.readyState === WebSocket.OPEN) {
                this.clientWs.send(
                  JSON.stringify({
                    type: 'error',
                    message: 'Gemini connection closed',
                  })
                );
              }
              this.close();
            },
          },
        })
        .then((session) => {
          this.session = session;
        })
        .catch((err) => {
          console.error('Error connecting to Gemini Live:', err);
          reject(err);
        });
    });
  }

  /**
   * Sends audio data to Gemini.
   */
  async sendAudio(base64Data: string): Promise<void> {
    if (!this.isSetup || !this.session) return;

    try {
      this.session.sendRealtimeInput({
        audio: {
          data: base64Data,
          mimeType: 'audio/pcm;rate=16000',
        },
      });
    } catch (err) {
      console.error('Error sending audio to Gemini:', err);
      throw err;
    }
  }

  /**
   * Closes the connection and resets service state.
   */
  close() {
    if (this.session) {
      this.session.close();
      this.session = null;
    }
    this.isSetup = false;
  }
}
