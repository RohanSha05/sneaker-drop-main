import prisma from "../../../shared/prisma.js";


const createDrop = async (payload) =>{

    const result = await prisma.drop.create({
            data: {
                title: payload.title,
                totalStock: payload.totalStock,
                availableStock: payload.availableStock
            }
        })
    return result
}

const getAllDrops = async () =>{

    const result = await prisma.drop.findMany();
    return result
}


export const dropService = {
    createDrop,
    getAllDrops
}