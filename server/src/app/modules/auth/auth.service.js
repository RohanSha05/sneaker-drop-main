import prisma from "../../../shared/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { jwtHelper } from "../../../helper/jwtHelper.js"

const login = async(payload) =>{
    const user = await prisma.user.findUniqueOrThrow({
        where:{
            email: payload.email,

        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if(!isCorrectPassword){
        throw new Error("Password is incorrect!");
    }

    const accessToken = jwtHelper.generateToken({email:user.email}, "abcd","1h");

    const refreshToken = jwtHelper.generateToken({email:user.email}, "abcd", "30d");

    return {
        accessToken,
        refreshToken
    }
}



export const AuthService ={
    login
}