import { describe, expect, it } from '@jest/globals';
import { AppError } from './AppError';

describe('AppError', () => {
  it('sets the provided status code and message', () => {
    const error = new AppError(418, 'teapot');
    expect(error.statusCode).toBe(418);
  });
});
