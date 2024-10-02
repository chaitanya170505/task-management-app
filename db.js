import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Destructure Pool from the default import
const { Pool } = pkg;

// Create a new pool with the connection string
const db = new Pool({
    connectionString: process.env.POSTGRES_URL, // Using connection string from .env
});

// Function to connect to the database
const connectDB = async () => {
    try {
        await db.connect();
        console.log("Database connection successful");
    } catch (err) {
        console.error("Database connection failed", err);
    }
};

connectDB();

export default db;
