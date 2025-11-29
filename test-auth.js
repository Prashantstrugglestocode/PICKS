import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

// Use the connection string from your .env or the one you provided
const connectionString = "postgresql://neondb_owner:npg_GCk5XRSVA2YN@ep-little-waterfall-agx4qh53-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function testRegistration() {
    const testUser = `test_user_${Date.now()}`;
    const testPass = 'password123';

    console.log(`Attempting to register user: ${testUser}`);

    try {
        // 1. Check if user exists (shouldn't)
        const checkRes = await pool.query('SELECT * FROM users WHERE username = $1', [testUser]);
        if (checkRes.rows.length > 0) {
            console.error('User already exists (unexpected)');
            return;
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(testPass, salt);

        // 3. Insert user
        const insertRes = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
            [testUser, hash]
        );

        const newUser = insertRes.rows[0];
        console.log('✅ Registration Successful!');
        console.log('Created User:', newUser);

        // 4. Verify Login (Compare hash)
        const loginRes = await pool.query('SELECT * FROM users WHERE username = $1', [testUser]);
        const loginUser = loginRes.rows[0];
        const isMatch = await bcrypt.compare(testPass, loginUser.password_hash);

        if (isMatch) {
            console.log('✅ Login Verification Successful (Password matches hash)');
        } else {
            console.error('❌ Login Verification Failed');
        }

        // Clean up (optional, but good for testing)
        await pool.query('DELETE FROM users WHERE id = $1', [newUser.id]);
        console.log('🧹 Test user cleaned up.');

    } catch (err) {
        console.error('❌ Registration Test Failed:', err);
    } finally {
        await pool.end();
    }
}

testRegistration();
