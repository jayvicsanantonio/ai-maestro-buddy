import { AuthHandler } from './AuthHandler.js';
import { MetricsHandler } from './MetricsHandler.js';
import { AudioHandler } from './AudioHandler.js';
import type { MessageHandler, MessageContext } from './types.js';

export type { MessageHandler, MessageContext };

/**
 * Registry of all WebSocket message handlers.
 * Handlers are indexed by message type for O(1) lookup.
 */
const handlers: MessageHandler[] = [
  AuthHandler,
  MetricsHandler,
  AudioHandler,
];

export const handlerRegistry = new Map<string, MessageHandler>(
  handlers.map((h) => [h.type, h])
);

/**
 * Gets the handler for a given message type.
 * @param type - The message type to look up
 * @returns The handler or undefined if not found
 */
export const getHandler = (
  type: string
): MessageHandler | undefined => {
  return handlerRegistry.get(type);
};
