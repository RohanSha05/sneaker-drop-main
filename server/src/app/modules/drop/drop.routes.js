import express from 'express'
import { dropController } from './drop.controller';

const router = express.Router()

router.post(
    '/create-drop',
    dropController.createUser
)

export const dropRoutes = router;

