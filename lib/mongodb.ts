import { MongoClient, MongoClientOptions } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("⚠️ DATABASE_URL is not set in the .env file.");
}

// MongoDB connection options
const options: MongoClientOptions = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5,  // Minimum number of connections in the pool
  connectTimeoutMS: 10000, // Timeout for initial connection
  socketTimeoutMS: 45000,  // Timeout for socket inactivity
  retryWrites: true,       // Retry writes for transient network errors
  retryReads: true,        // Retry reads for transient network errors
  serverApi: {
    version: "1" as const, // Server API version
    strict: true,          // Enforce strict API rules
    deprecationErrors: true, // Enable deprecation warnings
  },
};

declare global {
  // Ensures a single MongoClient instance in development
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;
console.log(uri);
try {
  if (process.env.NODE_ENV === "development") {
    // Use global variable to prevent hot-reload issues in dev mode
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // For production, always create a new client instance
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  // Test the connection and log success in development
  clientPromise.then(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Successfully connected to MongoDB");
    }
  });
} catch (error) {
  console.error("❌ Failed to initialize MongoDB connection:", error);
  throw error; // Rethrow the error for visibility
}

export default clientPromise;
