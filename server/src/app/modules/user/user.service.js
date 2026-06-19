import bcrypt from "bcryptjs"
import prisma from "../../../shared/prisma.js";


const createUser = async (payload) =>{
    const hashPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) =>{
        return await tnx.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                password: hashPassword
            }
        })
    })
    return result
}

export const UserService = {
    createUser
}