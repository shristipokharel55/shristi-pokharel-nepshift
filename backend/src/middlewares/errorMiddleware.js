export const notFound = (req, res, next) => {
	res.status(404);
	next(new Error(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;
	res.status(statusCode);

	res.json({
		message: err.message || "Server error",
		...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
	});
};
