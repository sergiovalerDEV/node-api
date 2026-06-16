import 'dotenv/config';
import './src/models/index';
import sequelize from './src/config/database';
import seed from './src/seed';
import { createApp } from './src/app';

const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await seed();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
    console.log(`Swagger en http://localhost:${PORT}/api-docs`);
  });
};

start().catch(console.error);
