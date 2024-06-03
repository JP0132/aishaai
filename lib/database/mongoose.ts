import mongoose, {Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection{
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if(!cached){
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

// Everytime try connect to the database
export const connectToDatabase = async () => {
    //If there is a cached connection then, exit out of trying to connect to it
    if(cached.conn) return cached.conn;

    // If mongodb url is null/empty then output error
    if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    // Check if cached.promise is already set. If not, establish a new MongoDB connection.
    cached.promise = cached.promise || mongoose.connect (MONGODB_URL, {
        dbName: 'aisha-ai', bufferCommands: false
    })

    // Wait for the connection promise to resolve and assign the connection object to cached.conn.
    cached.conn = await cached.promise;

    return cached.conn;
}