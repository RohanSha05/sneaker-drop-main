import cron from 'node-cron';
import { reservationService } from '../app/modules/reservation/reservation.service.js';

const reservationExpiryJob = () => {
  cron.schedule('*/15 * * * * *', async () => {
    await reservationService.recoverExpiredReservations();
  });
};

export default reservationExpiryJob;