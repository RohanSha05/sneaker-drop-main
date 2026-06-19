import express from 'express'
import { dropController } from './drop.controller.js';
import { DropValidation } from './drop.validation.js';

const router = express.Router()

router.get(
    '/get-drops',
     dropController.getAllDrops
)
router.post(
    '/create-drop',
    (req, res, next) => {
        req.body = DropValidation.createDropValidation.parse(req.body);
        return dropController.createDrop(req, res, next);
      }
)

export const dropRoutes = router;

