import { Router } from 'express';
import { body, param } from 'express-validator';
import * as lugarController from '../controllers/lugar.controller';

const router = Router();

router.get(
  '/ciudad/:ciudad_id',
  [param('ciudad_id').isInt({ min: 1 }).withMessage('ciudad_id debe ser un entero positivo')],
  lugarController.getLugaresByCiudad
);

router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
  lugarController.getLugarById
);

const lugarBodyValidations = [
  body('name').notEmpty().withMessage('name es obligatorio'),
  body('coordinates').isArray({ min: 2, max: 2 }).withMessage('coordinates debe ser un array de dos números'),
  body('coordinates[0]').isFloat().withMessage('coordinates[0] debe ser un número decimal'),
  body('coordinates[1]').isFloat().withMessage('coordinates[1] debe ser un número decimal'),
  body('timestamp').isNumeric().withMessage('timestamp debe ser numérico'),
  body('ciudad_id').isInt({ min: 1 }).withMessage('ciudad_id es obligatorio y debe ser un entero positivo'),
];

router.post('/', lugarBodyValidations, lugarController.createLugar);

router.put(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'), ...lugarBodyValidations],
  lugarController.updateLugar
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
  lugarController.deleteLugar
);

export default router;
