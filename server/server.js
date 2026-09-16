import 'dotenv/config';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import User from './models/User.js';

const app = express();
const port = process.env.PORT || 5000;
const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

app.use(cors());
app.use(express.json());
app.use(express.static(rootDirectory));

const createToken = (user) => jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET || 'development-secret-change-me',
  { expiresIn: '7d' },
);

app.post('/api/auth/register', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) return response.status(400).json({ message: 'All fields are required.' });
    if (password.length < 6) return response.status(400).json({ message: 'Password must contain at least 6 characters.' });
    if (await User.findOne({ email })) return response.status(409).json({ message: 'An account already exists for this email.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    return response.status(201).json({ token: createToken(user), user: { name: user.name, email: user.email } });
  } catch (error) {
    return response.status(500).json({ message: 'Could not create the account.' });
  }
});

app.post('/api/auth/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password || '', user.password))) return response.status(401).json({ message: 'Invalid email or password.' });
    return response.json({ token: createToken(user), user: { name: user.name, email: user.email } });
  } catch (error) {
    return response.status(500).json({ message: 'Could not sign in.' });
  }
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hackelite')
  .then(() => console.log('MongoDB connected.'))
  .catch((error) => console.error(`MongoDB connection failed: ${error.message}`));

app.listen(port, () => console.log(`HackElite is running at http://localhost:${port}`));
