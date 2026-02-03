import { z } from 'zod';

export const startSessionSchema = z.object({
  body: z.object({
    uid: z.string().optional(),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    uid: z.string(),
    onboardingCompleted: z.boolean().optional(),
    preferences: z
      .object({
        coach_style: z
          .enum(['encouraging', 'strict', 'playful'])
          .optional(),
        difficulty: z.number().min(1).max(5).optional(),
      })
      .optional(),
    character: z
      .object({
        color: z.string().optional(),
        accessory: z.string().optional(),
        eyeStyle: z.string().optional(),
      })
      .optional(),
  }),
});

export const ttsSchema = z.object({
  body: z.object({
    text: z.string().min(1),
    voice: z.string().optional(),
  }),
});
