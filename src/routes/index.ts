import { Router } from 'express';
import ciudadRoutes from './ciudad.routes';
import lugarRoutes from './lugar.routes';

const router = Router();

router.use('/ciudades', ciudadRoutes);
router.use('/lugares', lugarRoutes);

export default router;
