import { describe, expect, it } from '@jest/globals';
import { Ciudad, Lugar } from './index';

describe('models index', () => {
  it('exports Ciudad and Lugar', () => {
    expect(Ciudad).toBeDefined();
  });
});
