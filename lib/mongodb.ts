// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "Cluster0";

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Allow global caching in development
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Returns a reference to the MongoDB database.
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
} // use mongoosle insted of mondodb lobrary
