export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

export const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

export const validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    error: 'Validation failed',
    details: errors
  });
};
