import { request, response } from "express";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { success } from "zod";
import { AuthService } from "./auth.service.js";

const login = catchAsync(async( req, res )=>{
    const result = await AuthService.login(req.body)
    const {accessToken, refreshToken} = result;

    res.cookie("accessToken", accessToken, {
        secure : true,
        httpOnly: true,
        sameSite : "none",
        maxAge: 1000 * 60 * 60
    })
    res.cookie("refreshToken", refreshToken, {
        secure : true,
        httpOnly: true,
        sameSite : "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
    })

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User logged in successfully",
        data: result
    })
})

export const AuthController = {
    login
}