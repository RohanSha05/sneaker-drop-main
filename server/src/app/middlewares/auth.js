
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import ApiError from '../../shared/errors/ApiError.js';

const auth = () => {
	return async (req, res, next) => {
		try {
			// const token =
			// 	req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
			// if (!token) {
			// 	throw new ApiError(401, "You are not authorized!");
			// }
			// const verifiedUser = jwt.verify(token, config.jwtSecret);

			// req.user = verifiedUser;

			const userId = req.headers["user_id"];
			if (!userId) {
				throw new ApiError(401, "User ID missing");
			}
			req.user = {
				id: userId,
			};

			next();
		} catch (error) {
			next(error);
		}
		// req.user = {
		// 	id: req.query.userId,
		// };
		// next();
	};
};

export default auth;