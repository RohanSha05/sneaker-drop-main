import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import router from './app/routes/index.js';
import notFound from './app/middlewares/notFound.js';
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: config.clientUrls,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/v1', router);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sneaker Drop API is running",
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    server: 'ok',
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
