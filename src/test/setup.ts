import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  configurable: true,
  get() { return 198; },
});
