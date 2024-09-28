import { PrismaClient } from "@prisma/client";

const connectDatabase = async (callbackfn: Function) => {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    callbackfn();
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
};

export default connectDatabase;
