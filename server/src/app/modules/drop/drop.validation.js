import { z } from "zod";

const createDropValidation = z.object({
	body: z.object({
		title: z
			.string({ message: "Title is required" })
			.min(1, { message: "Title is required" }),
		description: z.string().optional(),
		totalStock: z.coerce
			.number({ message: "Total stock is required" })
			.int()
			.positive(),
		startsAt: z.coerce.date({ message: "Start time is required" }),
	}),
});

export const DropValidation = {
	createDropValidation,
};