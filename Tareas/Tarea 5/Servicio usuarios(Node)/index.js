
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Mock user data
const users = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin' },
    { id: 2, username: 'usuario', password: 'usuario', role: 'user' }
];

const SECRET_KEY = 'your-secret-key';

// Register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).send('User already exists');
    }
    const newUser = {
        id: users.length + 1,
        username,
        password, // In a real app, you should hash the password
        role: 'user'
    };
    users.push(newUser);
    res.status(201).send('User registered successfully');
});

// Login and get a JWT token
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.listen(port, () => {
    console.log(`User service listening at http://localhost:${port}`);
});
