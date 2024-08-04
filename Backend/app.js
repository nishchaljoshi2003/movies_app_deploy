const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://movies-app-api.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: '*',
  }));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(express.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/'(req,res)=>{
    res.send("Hello, The server is working properly");
});
app.post('/api/register', async (req, res) => {
    const { email, password, age } = req.body;

    if (!email || !password || !age) {
        return res.status(400).json({ error: 'Please provide email, password, and age' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO login (email, password, age) VALUES ($1, $2, $3) RETURNING *';
        const values = [email, hashedPassword, age];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const query = 'SELECT * FROM login WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        console.log('Backend response:', { 
            message: 'Login successful', 
            token, 
            userId: user.id, 
            email: user.email 
        });

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            userId: user.id, 
            email: user.email 
        });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/api/favorites', authenticateToken, async (req, res) => {
    const { movie_id, movie_title, movie_poster, movie_desc } = req.body;
    const user_id = req.user.id;

    if (!movie_id || !movie_title || !movie_poster || !movie_desc) {
        return res.status(400).json({ error: 'Please provide movie_id, movie_title, movie_poster, and movie_desc' });
    }

    try {
        const query = 'INSERT INTO favorites (user_id, movie_id, movie_title, movie_poster, movie_desc) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [user_id, movie_id, movie_title, movie_poster, movie_desc];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
    const user_id = req.user.id;

    try {
        const query = 'SELECT * FROM favorites WHERE user_id = $1';
        const values = [user_id];
        const result = await pool.query(query, values);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/favorites', authenticateToken, async (req, res) => {
    const { movie_id } = req.body;
    const user_id = req.user.id;

    if (!movie_id) {
        return res.status(400).json({ error: 'Please provide movie_id' });
    }

    try {
        const query = 'DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2 RETURNING *';
        const values = [user_id, movie_id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
