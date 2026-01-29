import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mcpGatewayUrl:
    process.env.MCP_GATEWAY_URL ||
    'http://localhost:3002/mcp/execute',
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  geminiModel:
    process.env.GEMINI_MODEL ||
    (process.env.NODE_ENV === 'production'
      ? 'gemini-2.0-flash'
      : 'gemini-2.0-flash'),
};
