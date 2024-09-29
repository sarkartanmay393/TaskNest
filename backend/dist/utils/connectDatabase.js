"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const connectDatabase = async (callbackfn) => {
    const prisma = new client_1.PrismaClient();
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully!');
        callbackfn();
    }
    catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1);
    }
};
exports.default = connectDatabase;
