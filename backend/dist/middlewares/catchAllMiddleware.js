"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAllMiddleware = void 0;
const catchAllMiddleware = (_, res) => {
    return res.status(404).json({
        error: "Not Found",
        message: "The requested URL or Method is mismatched with the server's API."
    });
};
exports.catchAllMiddleware = catchAllMiddleware;
