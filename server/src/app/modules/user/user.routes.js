import express from 'express'
import { UserController } from './user.controller.js';

const router = express.Router()

router.post(
    '/create-user',
    UserController.createUser
)

export const userRoutes = router;

