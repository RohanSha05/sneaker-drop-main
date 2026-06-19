import bcrypt from "bcryptjs"
import prisma from "../../../shared/prisma.js";


const createUser = async (payload) =>{
    const hashPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.user.create({
        data: {
            username: payload.username,
            email: payload.email,
            password: hashPassword
        }
    })

    return result
}

const getAllUser = async () =>{
    const result = await prisma.user.findMany();
    return result;
}

export const UserService = {
    createUser,
    getAllUser
}