import { z } from 'zod';

const reserve = z.object({
  body: z.object({
    dropId: z.string({ message: 'Drop ID is required' }).min(1),
    userId: z.string({ message: 'User ID is required' }).min(1),
  }),
});

const purchase = z.object({
  body: z.object({
    reservationId: z.string({ message: 'Reservation ID is required' }).min(1),
  }),
});

export const ReservationValidation = {
  reserve,
  purchase,
};