import express from 'express';
import { reservationController } from './reservation.controller.js';
import auth from '../../middlewares/auth.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { ReservationValidation } from './reservation.validation.js';

const router = express.Router();

router.post(
	"/drops/:dropId/reserve",
	auth(),
	validateRequest(ReservationValidation.reserve),
	reservationController.createReservation,
);
router.post(
	"/:reservationId/purchase",
	auth(),
	validateRequest(ReservationValidation.purchase),
	reservationController.createPurchase,
);

router.get('/', reservationController.getAllReservations);

export const reservationRoutes = router;

