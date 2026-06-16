import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message = 'Datos de entrada inválidos') {
    super(400, message);
  }
}
