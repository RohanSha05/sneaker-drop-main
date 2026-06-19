const sendResponse = (res, payload) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    meta: payload.meta ?? null,
    data: payload.data ?? null,
  });
};

export default sendResponse;