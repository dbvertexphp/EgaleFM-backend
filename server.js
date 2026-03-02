import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Config and DB
import connectDB from './config/db.js';

// Route Importss
import adminRoutes from './routes/admin/admin.routes.js';
import StoryCategoryRoute from './routes/admin/category/category.routes.js';
import StoryChapterRoute from './routes/admin/storyChapter/storyChapter.routes.js';

import bookmarkRoutes from './routes/admin/bookmark.routes.js';

import userRoutes from './routes/user/user.routes.js';
import AboutUs from './routes/admin/AboutUs/about.Routes.js';
import Terms from './routes/admin/Terms$Condition/termRoute.js';
import PrivacyRoutes from './routes/admin/PrivacyPolicy/privacy.routes.js';
import subscriptionRoutes from './routes/admin/Subscription/subscription.routes.js';
import videoRoutes from './routes/admin/Video/video.routes.js';
import StoryTopicRoute from './routes/admin/Story-Topic/storyTopic.js';
import PaymentList from './routes/admin/paymentRoute.js';

import promo from './routes/admin/promo/promo.routes.js';
// Middleware Imports
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { startSubscriptionCron } from './cron/subscription.cron.js';

// Load Env
dotenv.config();

// // Firebase Admin Setup
// const serviceAccount = JSON.parse(
//   fs.readFileSync(
//     new URL('./config/firebase-service-account.json', import.meta.url),
//     'utf8'
//   )
// );
// const formattedPrivateKey = serviceAccount.private_key.replace(/\\n/g, '\n');

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       ...serviceAccount,
//       private_key: formattedPrivateKey, // Yahan formatted wali key use karni hai
//     }),
//     projectId: serviceAccount.project_id,
//   });
// }
// console.log('✅ Firebase Admin SDK Initialized');

// Initialize App
const app = express();

// Connect Database
connectDB();
const __dirname = path.resolve();
// Create Uploads Directory if not exists
const uploadDirs = [
  'uploads/story-cover',
  'uploads/story-chapter-image',
  'uploads/story-audio',
  'uploads/user-stories',
  'uploads/videos',
  'uploads/admin-profile',
  'uploads/user-profile',
];

uploadDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// --- Swagger Configuration ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cod_ON API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for Admin and User panels',
      contact: {
        name: 'Developer Support',
      },
    },
    servers: [
      {
        url:
          process.env.BASE_URL ||
          `http://localhost:${process.env.PORT || 4000}`,
        description: 'API Server',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Yeh path aapke saare routes folder ko scan karega
  apis: ['./routes/**/*.js', './routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// --- Global Middlewares ---
app.use(cors());
app.use(express.json({ limit: '250mb' }));
app.use(express.urlencoded({ extended: true, limit: '250mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger UI route
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// --- API Routes ---

// Admin Specific Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin', AboutUs);

app.use('/api/admin', StoryCategoryRoute);
app.use('/api/admin', StoryChapterRoute);

app.use('/api/admin', StoryTopicRoute);

app.use('/api/admin/terms', Terms);
app.use('/api/admin/privacy', PrivacyRoutes);
app.use('/api/admin/videos', videoRoutes);
app.use('/api/admin', PaymentList);

app.use('/api/promo', promo);
// Shared/Other Routes

// app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/plans', subscriptionRoutes);

// User Specific Routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

  res.json({
    success: true,
    message: 'Server is running',
    swagger: `${baseUrl}/api-docs`,
  });
});

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
  });
});
console.log('Server time:', new Date().toISOString());

// Start Server
const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startSubscriptionCron();
  console.log(
    `📄 Swagger Docs: ${
      process.env.BASE_URL || `http://localhost:${PORT}`
    }/api-docs`
  );
});
