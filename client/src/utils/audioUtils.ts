/**
 * Converts an Int16Array to a Base64 string for transmission over WebSockets.
 */
export function pcmToBase64(pcmData: Int16Array): string {
  const buffer = pcmData.buffer;
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
