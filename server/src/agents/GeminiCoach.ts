import {
  VertexAI,
  ChatSession,
  HarmCategory,
  HarmBlockThreshold,
  type FunctionDeclaration,
} from '@google-cloud/vertexai';
import { ToolRegistry } from './tools.js';
import { config } from '../config/env.js';

const PROJECT_ID = config.projectId;
const LOCATION = config.location;

const SYSTEM_PROMPT = `
You are MaestroBuddy, a kind and patient music teacher for kids aged 6-12. 
Your goal is to help them with their "Rhythm Quest".

CORE BEHAVIORS:
1. Listen and analyze: Use the analyze_audio_window tool to understand their performance.
2. Positive Feedback: Always start with one thing they did well.
3. Specific Correction: Suggest one small improvement (e.g., "try to clap a little sooner on the third beat").
4. Adapt: If they are struggling, use set_metronome to slow down the BPM.
5. Educate: Proactively share fun facts (get_music_fact) or short theory lessons (get_theory_lesson) between exercises to keep things interesting. 
6. Empathy: Be encouraging, use simple words, and keep responses short (1-3 sentences).
7. Vocal Cues: Use friendly interjections that sound great when spoken (e.g., "Woah!", "Awesome!", "Hmm, let's try that again!", "Yay!").
8. Tone: Speak like a favorite teacher - warm, energetic, and clear.

You have access to tools to update the UI, change the metronome, and reward badges.
For educational contributions, award the 'music_scholar' badge for listening to facts and 'theory_wiz' for theory lessons.
Always produce valid JSON for tool calls.
`;

export class GeminiCoach {
  private chat: ChatSession | null = null;
  private vertexAI: VertexAI | null = null;

  constructor() {
    if (PROJECT_ID) {
      this.vertexAI = new VertexAI({
        project: PROJECT_ID,
        location: LOCATION,
      });
      const model = this.vertexAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
        generationConfig: { maxOutputTokens: 256, temperature: 0.7 },
      });

      const declarations: FunctionDeclaration[] = Object.entries(
        ToolRegistry
      ).map(([name, schema]) => ({
        name,
        description: schema.description,
        parameters: schema.parameters as any,
      }));

      this.chat = model.startChat({
        tools: [{ functionDeclarations: declarations }],
      });
    }
  }

  async processMetrics(
    metrics: any[]
  ): Promise<{ feedback: string; toolTrace?: any }> {
    if (!this.chat) {
      return {
        feedback:
          "Great job clapping! I'm still setting up my brain, but keep practicing.",
        toolTrace: {
          tool: 'mock_analyze',
          status: 'success',
          args: { count: metrics.length },
        },
      };
    }

    try {
      const result = await this.chat.sendMessage(
        `Student metrics for the last window: ${JSON.stringify(
          metrics
        )}`
      );
      const response = result.response;

      const candidates = response.candidates;
      if (
        !candidates ||
        candidates.length === 0 ||
        !candidates[0]?.content
      ) {
        return { feedback: "I'm listening closely, keep going!" };
      }
      const candidate = candidates[0]!;
      const parts = candidate.content.parts || [];

      const call = parts.find((p) => p.functionCall);
      const textPart = parts.find((p) => p.text);
      const text = textPart?.text || 'Keep it up!';

      if (call && call.functionCall) {
        return {
          feedback: text,
          toolTrace: {
            tool: call.functionCall.name,
            args: call.functionCall.args,
            status: 'success',
          },
        };
      }

      return { feedback: text };
    } catch (err) {
      console.error('Gemini processing error:', err);
      return { feedback: 'Oops, I missed that beat! Try again.' };
    }
  }
}
