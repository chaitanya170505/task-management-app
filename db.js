import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();


const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'UsersToDoList',
  password: 'Chaitanya@2004',
  port: 5432
});

try {
  await db.connect();
  console.log('Connected to the database');
} catch (err) {
  console.error('Error connecting to the database:', err);
}

export default db;
