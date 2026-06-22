import express from 'express'
import { UserController } from './user.controller.js';
import { UserValidation } from './user.validation.js';

const router = express.Router()

router.get(
  "/",
  UserController.getAllUser
)

router.post(
  '/create-user',
  (req, res, next) => {
    req.body = UserValidation.createUserValidation.parse(req.body);
    return UserController.createUser(req, res, next);
  }
);

export const userRoutes = router;

