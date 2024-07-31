const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originaUrl}`);
    res.status(404);
    next(error);
};

const errorHandle = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        msg: err?.msg,
        stack: err?.stack,
    });
};
module.exports = { errorHandle, notFound};