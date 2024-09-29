"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchGlobalErrors = void 0;
const catchGlobalErrors = (err, req, res, next) => {
    console.error(err.stack); // Log the error details
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
        message: err.message || "An unexpected error occurred."
    });
};
exports.catchGlobalErrors = catchGlobalErrors;
