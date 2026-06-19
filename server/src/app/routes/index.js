import express from 'express';
import { userRoutes } from '../modules/user/user.routes.js';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { dropRoutes } from '../modules/drop/drop.routes.js';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes
  },
  {
    path: '/auth',
    route: authRoutes
  },
  {
    path: '/drop',
    route: dropRoutes
  },

];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;