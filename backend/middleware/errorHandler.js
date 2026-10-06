export const errorHandler = (err, req, res, next) => {
    console.log(err);
    const status = err.status || err.statusCode || 500;   // malformed JSON body arrives here as a 400
    return res.status(status).json({
        success: false,
        message: status === 400 ? "Invalid JSON Body" : (err.message || "Internal Server Error"),
        data: []
    });
};