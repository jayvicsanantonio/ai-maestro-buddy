import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.MCP_PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', component: 'mcp-gateway' });
});

app.post('/mcp/execute', (req, res) => {
  const { tool, args } = req.body;
  console.log(`Executing MCP tool: ${tool}`, args);

  // Mock response for rhythm exercises
  if (tool === 'get_rhythm_exercises') {
    return res.json({
      exercises: [
        {
          id: '1',
          name: 'Steady Quarter Notes',
          bpm: 80,
          pattern: [1, 0, 0, 0],
        },
      ],
    });
  }

  res.status(404).json({ error: 'Tool not found' });
});

app.listen(port, () => {
  console.log(`MCP Gateway running at http://localhost:${port}`);
});
