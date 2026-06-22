import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma.js";
import ApiError from "../../../shared/errors/ApiError.js";
import { emitDropUpdate } from "../../../socket/index.js";

const reserveStock = async (payload, user) => {
	const maxRetries = 3;

	for (let attempt = 0; attempt < maxRetries; attempt += 1) {
		try {
			const result = await prisma.$transaction(
				async (tx) => {
					const drop = await tx.drop.findUnique({
						where: { id: payload.dropId },
					});

					if (!drop) {
						throw new ApiError(404, "Drop not found!");
					}

					if (drop.startsAt > new Date()) {
						throw new ApiError(400, "Drop has not started yet!");
					}

					const existingReservation = await tx.reservation.findFirst({
						where: {
							dropId: payload.dropId,
							userId: user.id,
							status: "ACTIVE",
						},
					});

					if (existingReservation) {
						throw new ApiError(400, "You already have an active reservation!");
					}

					const updatedStock = await tx.drop.updateMany({
						where: {
							id: payload.dropId,
							availableStock: {
								gt: 0,
							},
						},
						data: {
							availableStock: {
								decrement: 1,
							},
						},
					});

					if (updatedStock.count === 0) {
						throw new ApiError(400, "No stock available!");
					}

					const updatedDrop = await tx.drop.findUnique({
						where: { id: payload.dropId },
					});

					if (!updatedDrop) {
						throw new ApiError(404, "Drop not found!");
					}

					if (
						updatedDrop.availableStock === 0 &&
						updatedDrop.status !== "SOLD_OUT"
					) {
						await tx.drop.update({
							where: { id: payload.dropId },
							data: {
								status: "SOLD_OUT",
							},
						});

						updatedDrop.status = "SOLD_OUT";
					}

					const reservation = await tx.reservation.create({
						data: {
							dropId: payload.dropId,
							userId: user.id,
							expiresAt: new Date(Date.now() + 60 * 1000),
						},
						include: {
							user: {
								select: {
									username: true,
								},
							},
						},
					});

					return {
						drop: updatedDrop,
						reservation,
					};
				},
				{
					isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
				},
			);

			emitDropUpdate(payload.dropId, "stock-updated", {
				id: result.drop.id,
				availableStock: result.drop.availableStock,
				status: result.drop.status,
			});
			emitDropUpdate(payload.dropId, "reservation-created", result.reservation);

			return result;
		} catch (error) {
			if (error?.code === "P2034" && attempt < maxRetries - 1) {
				continue;
			}

			throw error;
		}
	}
};

const createPurchase = async (payload, user) => {
	const purchase = await prisma.$transaction(async (tx) => {
		const reservation = await tx.reservation.findUnique({
			where: { id: payload.reservationId },
			include: {
				drop: true,
			},
		});

		if (!reservation || reservation.userId !== user.id) {
			throw new ApiError(404, "Reservation not found!");
		}

		if (reservation.status !== "ACTIVE") {
			throw new ApiError(400, "Reservation is not active!");
		}

		if (reservation.expiresAt < new Date()) {
			throw new ApiError(400, "Reservation expired!");
		}

		const purchase = await tx.purchase.create({
			data: {
				dropId: reservation.dropId,
				userId: user.id,
				reservationId: reservation.id,
			},
			include: {
				user: {
					select: {
						username: true,
					},
				},
			},
		});

		await tx.reservation.update({
			where: { id: reservation.id },
			data: {
				status: "COMPLETED",
				completedAt: new Date(),
			},
		});

		return purchase;
	});

	const topPurchases = await prisma.purchase.findMany({
		where: { dropId: purchase.dropId },
		orderBy: { purchasedAt: "desc" },
		take: 3,
		include: { user: { select: { username: true } } },
	});

	emitDropUpdate(purchase.dropId, "purchase-created", {
		dropId: purchase.dropId,
		user: purchase.user,
		topPurchasers: topPurchases.map((p) => p.user.username),
	});

	return purchase;
};

const getAllReservations = async () => {
	return await prisma.reservation.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			drop: true,
			user: {
				select: {
					username: true,
				},
			},
		},
	});
};

const recoverExpiredReservations = async () => {
	const expiredReservations = await prisma.reservation.findMany({
		where: {
			status: "ACTIVE",
			expiresAt: {
				lt: new Date(),
			},
		},
	});

	let recoveredCount = 0;

	for (const reservation of expiredReservations) {
		const updatedDrop = await prisma.$transaction(async (tx) => {
			const activeReservation = await tx.reservation.findUnique({
				where: { id: reservation.id },
			});

			if (!activeReservation || activeReservation.status !== "ACTIVE") {
				return;
			}

			await tx.reservation.update({
				where: { id: reservation.id },
				data: {
					status: "EXPIRED",
					releasedAt: new Date(),
				},
			});

			await tx.drop.update({
				where: { id: reservation.dropId },
				data: {
					availableStock: {
						increment: 1,
					},
					status: "ACTIVE",
				},
			});

			return await tx.drop.findUnique({
				where: { id: reservation.dropId },
			});
		});

		if (updatedDrop) {
			emitDropUpdate(reservation.dropId, "stock-updated", {
				id: updatedDrop.id,
				availableStock: updatedDrop.availableStock,
				status: updatedDrop.status,
			});
			emitDropUpdate(reservation.dropId, "reservation-expired", {
				id: updatedDrop.id,
				availableStock: updatedDrop.availableStock,
				status: updatedDrop.status,
			});
			recoveredCount += 1;
		}
	}

	return {
		recovered: recoveredCount,
	};
};

export const reservationService = {
	reserveStock,
	createPurchase,
	getAllReservations,
	recoverExpiredReservations,
};
