import "dotenv/config";

const defaultClientUrls = ["http://localhost:5173", "http://localhost:3000"];

const clientUrls = process.env.CLIENT_URL
	? process.env.CLIENT_URL.split(",")
			.map((url) => url.trim())
			.filter(Boolean)
	: defaultClientUrls;

const config = {
	port: process.env.PORT || 5000,
	nodeEnv: process.env.NODE_ENV || "development",
	clientUrl: clientUrls[0],
	clientUrls,
	clientOrigins: clientUrls, // or use CLIENT_ORIGINS separately
	databaseUrl: process.env.DATABASE_URL,
	jwtSecret: process.env.JWT_SECRET || "abcd",
};

export default config;