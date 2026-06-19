import { request, response } from "express";
import catchAsync from "../../../shared/catchAsync.js";
import { UserService } from "./user.service.js";
import sendResponse from "../../../shared/sendResponse.js";
import { success } from "zod";

const createUser = catchAsync(async( req, res )=>{
    const result = await UserService.createUser(req.body)
    console.log(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: result
    })
})

export const UserController = {
    createUser
}