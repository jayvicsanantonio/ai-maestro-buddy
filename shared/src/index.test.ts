import { describe, it, expect } from 'vitest';
import { ClientMessage, ServerMessage } from './index';

describe('Shared Type Definitions', () => {
  it('should allow creating a valid ClientMessage', () => {
    const msg: ClientMessage = {
      type: 'auth',
      sessionId: 'test-session',
    };
    expect(msg.type).toBe('auth');
    expect(msg.sessionId).toBe('test-session');
  });

  it('should allow creating a valid ServerMessage with feedback', () => {
    const msg: ServerMessage = {
      type: 'feedback',
      content: 'Great job!',
      toolTrace: {
        tool: 'analyze',
        args: {},
        status: 'success',
      },
    };
    expect(msg.type).toBe('feedback');
    expect(msg.content).toBe('Great job!');
    expect(msg.toolTrace?.tool).toBe('analyze');
  });

  it('should allow creating a valid ServerMessage with stateUpdate', () => {
    const msg: ServerMessage = {
      type: 'system',
      stateUpdate: {
        tool: 'update_ui',
        args: { view: 'result' },
      },
    };
    expect(msg.type).toBe('system');
    expect(msg.stateUpdate?.tool).toBe('update_ui');
  });
});
