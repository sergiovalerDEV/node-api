import { Router } from 'express';
import { body, param } from 'express-validator';
import * as ciudadController from '../controllers/ciudad.controller';

const router = Router();

router.get('/', ciudadController.getAllCiudades);

router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
  ciudadController.getCiudadById
);

const ciudadBodyValidations = [
  body('name').notEmpty().withMessage('name es obligatorio'),
  body('country').notEmpty().withMessage('country es obligatorio'),
  body('coordinates').isArray({ min: 2, max: 2 }).withMessage('coordinates debe ser un array de dos números'),
  body('coordinates[0]').isFloat().withMessage('coordinates[0] debe ser un número decimal'),
  body('coordinates[1]').isFloat().withMessage('coordinates[1] debe ser un número decimal'),
  body('timestamp').isNumeric().withMessage('timestamp debe ser numérico'),
  body('habitants').isNumeric().withMessage('habitants debe ser numérico'),
  body('image').notEmpty().withMessage('image es obligatorio'),
];

router.post('/', ciudadBodyValidations, ciudadController.createCiudad);

router.put(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'), ...ciudadBodyValidations],
  ciudadController.updateCiudad
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
  ciudadController.deleteCiudad
);

export default router;
