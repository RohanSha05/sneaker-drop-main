 import catchAsync from "../../../shared/catchAsync.js";
 import sendResponse from "../../../shared/sendResponse.js";
 import { reservationService } from "./reservation.service.js";
 
 const createReservation = catchAsync(async( req, res )=>{
    console.log("USER:", req.user);
	console.log("BODY:", req.body);
     const result = await reservationService.reserveStock(req.body, req.user)
     sendResponse(res, {
         statusCode: 201,
         success: true,
         message: "Reservation created successfully",
         data: result
     })
 })
 const createPurchase = catchAsync(async( req, res )=>{
     const result = await reservationService.createPurchase(req.body, req.user)
     sendResponse(res, {
         statusCode: 200,
         success: true,
         message: "Purchase completed successfully",
         data: result
     })
 })
 const getAllReservations = catchAsync(async( req, res )=>{
     const result = await reservationService.getAllReservations()
     sendResponse(res, {
         statusCode: 200,
         success: true,
         message: "All Reservations loaded successfully",
         data: result
     })
 })

 const recoverExpiredReservations = catchAsync(async( req, res )=>{
     const result = await reservationService.recoverExpiredReservations()
     sendResponse(res, {
         statusCode: 200,
         success: true,
         message: "Expired reservations recovered",
         data: result
     })
 })
 
 export const reservationController = {
     createReservation,
     createPurchase,
     getAllReservations,
     recoverExpiredReservations
 }