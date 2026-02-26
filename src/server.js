import express from 'express';
import { prisma } from './config/db.js';
import authRouter from './routes/auth.routes.js';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);

const startServer = async () => {
  try {
    await prisma.$connect();
    //  a query to verify the DB credentials are valid and the server is responsive
    await prisma.$queryRaw`SELECT 1;`;

    console.log("PostgreSQL Connected via Prisma");

    app.listen(3000, () => {
      console.log("WaitLess Server is live on http://localhost:3000");
    });
  } catch (error) {
    console.error("Fatal Error: Database Connection Failed\n", error);
    process.exit(1); // Kill server if DB fails
  }
};

startServer();