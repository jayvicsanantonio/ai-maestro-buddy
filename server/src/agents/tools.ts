import { Type } from '@google/genai';

export const ToolRegistry = {
  analyze_audio_window: {
    description:
      'Analyzes a window of musical performance metrics (offsets, bpm) to determine if the student is on beat.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        metrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              offset: {
                type: Type.NUMBER,
                description:
                  'Difference in seconds from nearest beat',
              },
              bpm: { type: Type.NUMBER },
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
      type: Type.OBJECT,
      properties: {
        bpm: { type: Type.NUMBER },
      },
      required: ['bpm'],
    },
  },
  update_ui: {
    description:
      'Updates the frontend feedback message and instructions.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        message: { type: Type.STRING },
        instruction: { type: Type.STRING },
      },
      required: ['message'],
    },
  },
  reward_badge: {
    description:
      'Awards a badge to the student for a specific achievement.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING },
        reason: { type: Type.STRING },
      },
      required: ['type', 'reason'],
    },
  },
  get_rhythm_exercises: {
    description:
      'Fetches a list of rhythmic exercises from the educational content library.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        level: {
          type: Type.NUMBER,
          description: 'Difficulty level (1-5)',
        },
        style: {
          type: Type.STRING,
          description: 'Aesthetic style e.g. basic, rock, jazz',
        },
      },
    },
  },
  get_music_fact: {
    description:
      'Fetches a fun and educational music fact to share with the student.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  get_theory_lesson: {
    description:
      'Fetches a short music theory lesson on a specific topic (rhythm, tempo, dynamics, pitch).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        topic: {
          type: Type.STRING,
          description: 'The theory topic to explain',
        },
      },
    },
  },
};
