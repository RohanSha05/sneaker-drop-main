const validateRequest = (schema) => async (req, res, next) => {
  try {
    const parsedData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (parsedData.body) {
      req.body = parsedData.body;
    }

    if (parsedData.query) {
      req.query = parsedData.query;
    }

    if (parsedData.params) {
      req.params = parsedData.params;
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export default validateRequest;