/**
 * Story content for MaestroBuddy's "Save the Music Kingdom" narrative.
 * Contains worlds, chapters, level-up messages, and story dialogue.
 */

// World definitions with themed content
export interface World {
  id: number;
  name: string;
  theme: string;
  icon: string;
  description: string;
  unlockLevel: number;
  chapters: Chapter[];
  color: string;
}

export interface Chapter {
  id: number;
  name: string;
  intro: string;
  completion: string;
}

const WORLDS: World[] = [
  {
    id: 1,
    name: 'Melody Meadows',
    theme: 'Gentle forest filled with musical creatures',
    icon: '🌸',
    description:
      'A peaceful forest where the first notes of music were born. The friendly creatures here will teach you the basics!',
    unlockLevel: 1,
    color: '#6BCB77',
    chapters: [
      {
        id: 1,
        name: 'The Awakening',
        intro:
          'The forest creatures sense your musical talent! Can you hear the gentle rhythm of the meadow?',
        completion:
          'Amazing! The butterflies are dancing to your beat!',
      },
      {
        id: 2,
        name: 'Bunny Bounce',
        intro:
          'The rabbits want to hop along with you! Keep a steady beat for them.',
        completion:
          'The bunnies love your rhythm! They taught you the Hop Step!',
      },
      {
        id: 3,
        name: 'Bird Song',
        intro:
          'The songbirds need your help harmonizing. Listen carefully and match their rhythm!',
        completion:
          'Beautiful! The birds have crowned you an honorary Songkeeper!',
      },
      {
        id: 4,
        name: 'Meadow Festival',
        intro:
          'All the meadow creatures are gathering for the big festival! Lead the celebration!',
        completion:
          "What a party! You've brought joy back to Melody Meadows!",
      },
    ],
  },
  {
    id: 2,
    name: 'Beat Beach',
    theme: 'Tropical paradise with wave rhythms',
    icon: '🏖️',
    description:
      'The waves here follow a special rhythm. Dance with the ocean and feel the flow!',
    unlockLevel: 2,
    color: '#4ECDC4',
    chapters: [
      {
        id: 1,
        name: 'Tide Tempo',
        intro:
          'The waves have lost their rhythm! Help them find the perfect beat again.',
        completion: 'Whoosh! The waves are flowing perfectly now!',
      },
      {
        id: 2,
        name: 'Crab Carnival',
        intro:
          "The crabs are throwing a beach party, but they need a DJ! That's you!",
        completion:
          "Those crabs are grooving! You're a natural beach DJ!",
      },
      {
        id: 3,
        name: 'Dolphin Dance',
        intro:
          'The dolphins want to perform their famous synchronized leap. Guide their timing!',
        completion:
          'SPLASH! The dolphins did a perfect synchronized jump!',
      },
      {
        id: 4,
        name: 'Sunset Symphony',
        intro:
          'As the sun sets, all of Beat Beach comes together for the golden hour ceremony.',
        completion:
          'The most beautiful sunset Beat Beach has ever seen! You did that!',
      },
    ],
  },
  {
    id: 3,
    name: 'Tempo Temple',
    theme: 'Ancient ruins with mystical rhythms',
    icon: '🏛️',
    description:
      'An ancient temple where the first musicians learned their craft. Secrets await!',
    unlockLevel: 3,
    color: '#FFB347',
    chapters: [
      {
        id: 1,
        name: 'The Ancient Drums',
        intro:
          "The temple drums haven't been played in centuries. Will you awaken them?",
        completion:
          "The ancient drums thunder again! You've awakened the temple!",
      },
      {
        id: 2,
        name: 'Stone Guardian',
        intro:
          'The Stone Guardian blocks your path. Play the rhythm code to pass!',
        completion:
          "The Guardian bows! You've proven yourself worthy!",
      },
      {
        id: 3,
        name: 'Echo Chamber',
        intro:
          'In this magical room, your rhythms create echoes. Master the patterns!',
        completion: "You've unlocked the secret of the Echo Masters!",
      },
      {
        id: 4,
        name: 'Temple Heart',
        intro:
          'The heart of the temple holds the greatest secret. Are you ready?',
        completion:
          "You've discovered the Rhythm Rune! Its power flows through you!",
      },
    ],
  },
  {
    id: 4,
    name: 'Syncopation City',
    theme: 'A futuristic metropolis of complex beats',
    icon: '🌆',
    description:
      'A city where everyone communicates through rhythm. The beats here are next level!',
    unlockLevel: 4,
    color: '#9B5DE5',
    chapters: [
      {
        id: 1,
        name: 'Neon Nights',
        intro:
          'The city never sleeps, and neither does its music. Feel the urban pulse!',
        completion:
          'The whole block is vibing with you! Street cred: EARNED!',
      },
      {
        id: 2,
        name: 'Rhythm Station',
        intro:
          'At the central station, beats travel like trains. Catch them all!',
        completion:
          "You've mastered the rhythm transit system! All aboard!",
      },
      {
        id: 3,
        name: 'Rooftop Battle',
        intro:
          "The city's best beatmakers challenge you to a rhythm duel!",
        completion: "LEGENDARY! You're now the Syncopation Champion!",
      },
      {
        id: 4,
        name: 'City Anthem',
        intro:
          'Create the new anthem that will unite all of Syncopation City!',
        completion:
          'The WHOLE city is dancing to YOUR beat! Historic!',
      },
    ],
  },
  {
    id: 5,
    name: 'Grand Concert Hall',
    theme: 'The ultimate stage for musical mastery',
    icon: '🎭',
    description:
      'The legendary hall where true Maestros perform. Your final destination!',
    unlockLevel: 5,
    color: '#FF6B6B',
    chapters: [
      {
        id: 1,
        name: 'Dress Rehearsal',
        intro:
          "The stage is yours for the first time. Show them what you've learned!",
        completion:
          "The stage crew is impressed! You're ready for the big time!",
      },
      {
        id: 2,
        name: 'Opening Night',
        intro:
          "The curtains rise, the crowd awaits. Give them a show they'll never forget!",
        completion: "STANDING OVATION! They're chanting your name!",
      },
      {
        id: 3,
        name: "Maestro's Challenge",
        intro:
          'The greatest Maestro challenges you to prove your worth. The ultimate test!',
        completion:
          'INCREDIBLE! Even the Maestro is amazed by your skills!',
      },
      {
        id: 4,
        name: 'THE FINALE',
        intro:
          'This is it. The performance that will be remembered for eternity!',
        completion:
          "YOU DID IT! YOU'VE SAVED THE MUSIC KINGDOM! You are a TRUE MAESTRO! 🎉👑🎵",
      },
    ],
  },
];

// Level-up celebration messages with story context
export const LEVEL_UP_MESSAGES: Record<
  number,
  {
    title: string;
    message: string;
    unlockText: string;
  }
> = {
  2: {
    title: 'Silence Breaker',
    message:
      'Look! The flowers are blooming again! Your rhythm is scaring away the Great Silence in Melody Meadows!',
    unlockText: 'New Quest Unlocked: Restore Beat Beach!',
  },
  3: {
    title: 'Wave Weaver',
    message:
      "The ocean is dancing again! You've woven the perfect tempo into the tides. Beat Beach is saved!",
    unlockText: 'New Quest Unlocked: Awaken Tempo Temple!',
  },
  4: {
    title: 'Rhythm Guardian',
    message:
      'The ancient temple spirits have chosen you! The sacred groove is returning to the halls of history!',
    unlockText: 'New Quest Unlocked: Power Up Syncopation City!',
  },
  5: {
    title: 'Grand Maestro',
    message:
      'The whole kingdom is vibrating with your music! The Great Silence is nearly defeated. One final show remains!',
    unlockText: 'Final Challenge: The Grand Concert Hall!',
  },
  6: {
    title: 'Eternal Legend',
    message:
      "The Music Kingdom is safe forever! You've become the heartbeat of our world. Legend says your name will be sung in every song!",
    unlockText: 'YOU SAVED THE MUSIC! 👑',
  },
};

// Story dialogue for onboarding
export const ONBOARDING_STORY = {
  splash: {
    headline: 'The Music Kingdom Needs You!',
    subtext: 'An epic rhythm adventure awaits...',
  },
  storyIntro: `Oh no! The Great Silence has fallen over the Music Kingdom! 😱 The magical beats that powered our world are fading away. The butterflies have stopped dancing, the waves are frozen in time, and the ancient temple has gone cold. But the Elder Chords spoke of a Rhythm Hero who would return the groove to our land. Is it... YOU? ✨`,
  characterIntro:
    "I'm Maestro, your guide through the Kingdom! I've been keeping the last spark of music alive just for you. Before we set off on our quest to defeat The Silence, let's get me ready for the journey!",
  tutorial:
    "To drive back The Silence, we must restore the Heartbeat of the Land! 🎵 Listen closely to the magic beats I send you, then tap or clap to match them. Each perfect hit releases a 'Note Spark' that brings color back to our world!",
  ready:
    "The portals to Melody Meadows are opening! 🌟 Prepare yourself, Rhythm Hero! Let's show The Silence that the music NEVER stops! LET'S GO!",
};

// Streak celebration messages
export const STREAK_MESSAGES: Record<number, string> = {
  5: 'ON FIRE! 🔥',
  10: 'UNSTOPPABLE! ⚡',
  15: 'LEGENDARY STREAK! 🌟',
  20: 'GODLIKE! 👑',
  25: 'BEYOND PERFECT! ✨',
};

// Get world for a given level
export const getWorldForLevel = (level: number): World => {
  const world =
    WORLDS.find((w) => w.unlockLevel === level) ||
    WORLDS.find(
      (w) =>
        level >= w.unlockLevel &&
        (WORLDS[w.id]?.unlockLevel ?? Infinity) > level
    ) ||
    WORLDS[0];
  return world!;
};

// Get chapter progress within a world (0-indexed chapter)
export const getChapterProgress = (
  level: number
): { world: World; chapterIndex: number } => {
  const world = getWorldForLevel(level);
  const levelInWorld = level - world.unlockLevel;
  const chapterIndex = Math.min(
    levelInWorld,
    world.chapters.length - 1
  );
  return { world, chapterIndex };
};
