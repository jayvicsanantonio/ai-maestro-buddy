// Runs the MCP gateway server for tool requests.
// Provides rhythm exercises, facts, and lessons.
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.MCP_PORT || 3002;

app.use(cors());
app.use(express.json());

interface RhythmExercise {
  id: string;
  name: string;
  style: string;
  level: number;
  bpm: number;
  pattern: number[];
  instructions: string;
}

const EXERCISES: RhythmExercise[] = [
  {
    id: 'r1',
    name: 'Steady Pulse',
    style: 'basic',
    level: 1,
    bpm: 80,
    pattern: [1, 1, 1, 1],
    instructions: 'Clap on every beat!',
  },
  {
    id: 'r2',
    name: 'The Big One',
    style: 'basic',
    level: 1,
    bpm: 80,
    pattern: [1, 0, 0, 0],
    instructions: 'Clap only on the first beat of each bar.',
  },
  {
    id: 'r3',
    name: 'Backbeat Fun',
    style: 'rock',
    level: 2,
    bpm: 90,
    pattern: [0, 1, 0, 1],
    instructions: 'Clap on beats 2 and 4!',
  },
  {
    id: 'r4',
    name: 'Syncopation Intro',
    style: 'jazz',
    level: 3,
    bpm: 70,
    pattern: [1, 0.5, 1, 0],
    instructions: 'Try a little hop on the second beat!',
  },
];

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    component: 'mcp-gateway',
    exercisesCount: EXERCISES.length,
  });
});

app.post('/mcp/execute', (req, res) => {
  const { tool, args } = req.body;
  console.log(`[MCP] Executing tool: ${tool}`, args);

  if (tool === 'get_rhythm_exercises') {
    const level = args.level || 1;
    const style = args.style;

    let filtered = EXERCISES.filter((ex) => ex.level <= level);
    if (style) {
      filtered = filtered.filter((ex) => ex.style === style);
    }

    return res.json(filtered);
  }

  if (tool === 'get_music_fact') {
    const facts = [
      'Did you know? The oldest known musical instrument is a flute made from a bird bone!',
      'Fun Fact: A piano has 88 keys, but some special ones have more!',
      "Did you know? Rhythm is the 'heartbeat' of music. Every song has one!",
      'Cool Fact: Some animals, like birds and whales, sing songs just like humans do!',
      'Did you know? Vibrations are what make sound. Feel your throat while you hum!',
      'Did you know? The drum is one of the oldest instruments in history!',
      'Fun Fact: A metronome helps musicians keep a steady beat!',
      'Did you know? A violin has four strings tuned in fifths!',
      'Cool Fact: The word tempo means the speed of music!',
      'Did you know? Musical notes are named A through G and then repeat!',
      'Fun Fact: The guitar is often tuned E A D G B E!',
      'Did you know? A chorus is the part of a song that repeats!',
      'Cool Fact: Orchestras can have more than 70 musicians!',
      'Did you know? Drummers often count 1 2 3 4 to stay in time!',
      'Fun Fact: The highest piano key is called C8!',
    ];
    const randomIndex = Math.floor(Math.random() * facts.length);
    return res.json({ fact: facts[randomIndex] });
  }

  if (tool === 'get_theory_lesson') {
    const topic = args.topic || 'rhythm';
    const lessons: Record<string, string> = {
      rhythm:
        'Rhythm is a pattern of sounds and silence. It tells us when to play and when to rest!',
      tempo:
        'Tempo is how fast or slow the music goes. It is like the speed limit for a song!',
      dynamics:
        'Dynamics tell us how loud or soft to play. Imagine a mouse whispering vs. a lion roaring!',
      pitch:
        'Pitch is how high or low a sound is. Like a squeaky mouse (high) or a grumbling bear (low)!',
    };
    return res.json({
      topic,
      lesson: lessons[topic] || lessons['rhythm'],
    });
  }

  res.status(404).json({ error: 'Tool not found' });
});

app.listen(port, () => {
  console.log(`MCP Gateway running at http://localhost:${port}`);
});
