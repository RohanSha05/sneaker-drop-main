import { request, response } from "express";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { success } from "zod";

const createDrop = catchAsync(async( req, res )=>{
    // const result = await UserService.createUser(req.body)
    // sendResponse(res, {
    //     statusCode: 201,
    //     success: true,
    //     message: "User created successfully",
    //     data: result
    // })
    console.log(req.body)
})

export const dropController = {
    createDrop
}