import { describe, expect, it } from '@jest/globals';
import { ValidationError } from './ValidationError';

describe('ValidationError', () => {
    it('defaults status code to 400', () => {
        const error = new ValidationError('invalid');
        expect(error.statusCode).toBe(400);
    });

    it('uses default message when none provided', () => {
        const error = new ValidationError();
        expect(error.message).toBe('Datos de entrada inválidos');
    });
});