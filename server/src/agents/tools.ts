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
  get_rhythm_exercises: {
    description:
      'Fetches a list of rhythmic exercises from the educational content library.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        level: {
          type: SchemaType.NUMBER,
          description: 'Difficulty level (1-5)',
        },
        style: {
          type: SchemaType.STRING,
          description: 'Aesthetic style e.g. basic, rock, jazz',
        },
      },
    },
  },
  get_music_fact: {
    description:
      'Fetches a fun and educational music fact to share with the student.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
  get_theory_lesson: {
    description:
      'Fetches a short music theory lesson on a specific topic (rhythm, tempo, dynamics, pitch).',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        topic: {
          type: SchemaType.STRING,
          description: 'The theory topic to explain',
        },
      },
    },
  },
};
