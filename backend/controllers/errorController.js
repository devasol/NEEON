const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  
  
  let value = "";
  let field = "";

  if (err.keyValue) {
    const firstKey = Object.keys(err.keyValue)[0];
    field = firstKey;
    value = err.keyValue[firstKey];
  } else if (typeof err.message === "string") {
    const match = err.message.match(/(["'])(\\?.)*?\1/);
    value = match ? match[0] : "";
    // Try to extract field name from error message
    const fieldMatch = err.message.match(/index: (\w+)_\d+/);
    if (fieldMatch) field = fieldMatch[1];
  }

  const message = field
    ? `An account with this ${field} already exists. Please use a different ${field}.`
    : `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const env = process.env.NODE_ENV || "development";
  
  let normalizedError = err;
  if (err.name === "CastError") normalizedError = handleCastErrorDB(err);
  if (err.code === 11000) normalizedError = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError")
    normalizedError = handleValidationErrorDB(err);

  if (env === "development") {
    sendErrorDev(normalizedError, res);
  } else if (env === "production") {
    
    const safeError = { ...normalizedError };
    sendErrorProd(safeError, res);
  } else {
    
    sendErrorDev(normalizedError, res);
  }
};
