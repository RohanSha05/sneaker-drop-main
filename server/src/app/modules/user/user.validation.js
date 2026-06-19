import { z } from "zod";

const createUserValidation = z.object({
	password: z
		.string({
			message: "Password is required",
		})
		.min(6, {
			message: "Password must be at least 6 characters",
		}),

	username: z
		.string({
			message: "Username is required",
		})
		.min(3, {
			message: "Username must be at least 3 characters",
		}),

	email: z.email({
		message: "Invalid email format",
	}),
});

export const UserValidation = {
	createUserValidation,
};
