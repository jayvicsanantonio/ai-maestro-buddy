import { SchemaType } from '@google-cloud/vertexai';

export const ToolRegistry = {
  analyze_audio_window: {
    description:
      'Analyzes a window of musical performance metrics (offsets, bpm) to determine if the student is on beat.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        metrics: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              offset: {
                type: SchemaType.NUMBER,
                description:
                  'Difference in seconds from nearest beat',
              },
              bpm: { type: SchemaType.NUMBER },
            },
          },
        },
      },
      required: ['metrics'],
    },
  },
  set_metronome: {
    description:
      'Adjusts the metronome speed (BPM) for the current quest.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        bpm: { type: SchemaType.NUMBER },
      },
      required: ['bpm'],
    },
  },
  update_ui: {
    description:
      'Updates the frontend feedback message and instructions.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        message: { type: SchemaType.STRING },
        instruction: { type: SchemaType.STRING },
      },
      required: ['message'],
    },
  },
  reward_badge: {
    description:
      'Awards a badge to the student for a specific achievement.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        type: { type: SchemaType.STRING },
        reason: { type: SchemaType.STRING },
      },
      required: ['type', 'reason'],
    },
  },
};
