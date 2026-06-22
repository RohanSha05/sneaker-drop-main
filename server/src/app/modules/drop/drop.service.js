import prisma from "../../../shared/prisma.js";


const createDrop = async (payload) =>{

    const result = await prisma.drop.create({
            data: {
                title: payload.title,
                description: payload.description,
                totalStock: payload.totalStock,
                availableStock: payload.totalStock,
                startsAt: payload.startsAt,
                status: 'SCHEDULED'
            }
        })
    return result
}

const getAllDrops = async () =>{
    const now = new Date();

    const result = await prisma.drop.findMany({
			where: {
				startsAt: {
					lte: now,
				},
				status: {
					not: "SOLD_OUT",
				},
			},
			include: {
				purchases: {
					orderBy: {
						purchasedAt: "desc",
					},
					take: 3,
					include: {
						user: {
							select: {
								username: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
    return result
}


export const dropService = {
    createDrop,
    getAllDrops
}