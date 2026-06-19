import { z } from "zod";

const createDropValidation = z.object({
	title: z
		.string({
			message: "Title is required",
		})
		.min(1, {
			message: "Title is required",
		}),

	totalStock: z.number({
		message: "Total stock is required",
	}),

	availableStock: z.number({
		message: "Available stock is required",
	}),
});

export const DropValidation = {
	createDropValidation,
};