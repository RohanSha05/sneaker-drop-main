import { request, response } from "express";
import catchAsync from "../../../shared/catchAsync.js";
import { UserService } from "./user.service.js";
import sendResponse from "../../../shared/sendResponse.js";
import { success } from "zod";

const createUser = catchAsync(async( req, res )=>{
    const result = await UserService.createUser(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: result
    })
})
const getAllUser = catchAsync(async( req, res )=>{
    const result = await UserService.getAllUser(req.body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User loaded successfully",
        data: result
    })
})

export const UserController = {
    createUser,
    getAllUser
}