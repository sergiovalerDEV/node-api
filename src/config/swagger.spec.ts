import { describe, expect, it } from '@jest/globals';
import { swaggerSpec } from './swagger';

describe('swagger config', () => {
  it('defines openapi version 3.0.0', () => {
    expect((swaggerSpec as any).openapi).toBe('3.0.0');
  });
});
