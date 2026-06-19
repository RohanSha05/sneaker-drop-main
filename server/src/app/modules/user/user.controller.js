import { request, response } from "express";
import catchAsync from "../../../shared/catchAsync.js";

const createUser = catchAsync(async( req, res )=>{
    console.log("User : ", req.body)

})

export const UserController = {
    createUser
}