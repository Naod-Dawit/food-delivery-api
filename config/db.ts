import dotenv from "dotenv";

dotenv.config();
import mongoose from "mongoose";

export const ConnectDb = async () => {
  try {
    const mongoUrl = process.env.MONGOURL as string;
    if (!mongoUrl) {
      throw new Error("MONGOURL environment variable is not defined.");
    }
    await mongoose.connect(mongoUrl);
    console.log(`Database connected`);
  } catch (err: any) {
    console.error(err);

    console.error(err?.message);
  }
};