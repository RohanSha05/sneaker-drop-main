import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { dropService } from "./drop.service.js";

const createDrop = catchAsync(async( req, res )=>{
    const result = await dropService.createDrop(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Drop created successfully",
        data: result
    })
})
const getAllDrops = catchAsync(async( req, res )=>{
    const result = await dropService.getAllDrops();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All Drops loaded successfully",
        data: result
    })
})

export const dropController = {
    createDrop,
    getAllDrops
}