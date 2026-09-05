import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/acet3d';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`\n🍃 ======================================================`);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`======================================================\n`);
    return;
  } catch (error) {
    console.warn(`⚠️ Could not connect to external MongoDB at ${uri}.`);
  }

  // Try embedded MongoMemoryServer if available
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    isConnected = true;
    console.log(`\n🍃 ======================================================`);
    console.log(`✅ Embedded Native MongoDB Instance Started & Connected`);
    console.log(`🌐 URI: ${memUri}`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.log(`📁 Running with disk-backed persistent storage (server/data/database.json)`);
    isConnected = false;
  }
};

export const getDBStatus = () => isConnected;
