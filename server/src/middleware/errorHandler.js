//Global centralized JSON error handler for Express
function errorHandler(err, req, res, next) {
  console.error("Server Error:", err);
  const status = err.status || 500;
  const message = status >= 500 ? "Internal Server Error" : err.message || "An error occurred";

  res.status(status).json({
    errors: [{ field: "server", message }]
  });
}

export { errorHandler };