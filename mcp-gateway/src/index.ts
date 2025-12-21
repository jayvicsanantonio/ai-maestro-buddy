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

  res.status(404).json({ error: 'Tool not found' });
});

app.listen(port, () => {
  console.log(`MCP Gateway running at http://localhost:${port}`);
});
