
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import ApiError from '../../shared/errors/ApiError.js';

const auth = () => {
	return async (req, res, next) => {
		try {
			const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

			if (!token) {
				throw new ApiError(401, 'You are not authorized!');
			}

			const verifiedUser = jwt.verify(token, config.jwtSecret);

			req.user = verifiedUser;
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default auth;