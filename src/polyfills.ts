// Polyfill for Node.js 18 crypto compatibility
import { webcrypto } from 'crypto';

if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}

// Also ensure randomUUID is available globally for TypeORM
import { randomUUID } from 'crypto';
if (!globalThis.crypto.randomUUID) {
  (globalThis.crypto as any).randomUUID = randomUUID;
}
