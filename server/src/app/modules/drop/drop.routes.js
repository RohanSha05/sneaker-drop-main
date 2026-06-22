import express from 'express'
import { dropController } from './drop.controller.js';
import { DropValidation } from './drop.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';

const router = express.Router()

router.get(
    '/get-drops',
     dropController.getAllDrops
)
router.post(
    '/create-drop',
    validateRequest(DropValidation.createDropValidation),
    dropController.createDrop
)

export const dropRoutes = router;

