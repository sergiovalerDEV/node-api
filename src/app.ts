import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import router from './routes/index';
import { errorMiddleware } from './middlewares/errorMiddleware';

export const createApp = () => {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api', router);
  app.use(errorMiddleware);
  return app;
};
