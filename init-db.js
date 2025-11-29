import pg from 'pg';

const { Pool } = pg;

const connectionString = "postgresql://neondb_owner:npg_GCk5XRSVA2YN@ep-little-waterfall-agx4qh53-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- History Table
CREATE TABLE IF NOT EXISTS history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster history lookups
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
`;

async function run() {
    try {
        console.log("Connecting to database...");
        const client = await pool.connect();
        console.log("Connected. Running schema...");
        await client.query(schema);
        console.log("Schema applied successfully!");
        client.release();
    } catch (err) {
        console.error("Error applying schema:", err);
    } finally {
        await pool.end();
    }
}

run();
