import { describe, expect, it } from '@jest/globals';
import { NotFoundError } from './NotFoundError';

describe('NotFoundError', () => {
  it('defaults status code to 404 and message to recurso no encontrado', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
  });
});
