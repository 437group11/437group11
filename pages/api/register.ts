// pages/api/register.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { requestAccessToken } from './request-token';
import { setToken } from 'utils/tokenManager';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in the database
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      let token = await requestAccessToken()
      setToken(token ?? "")
      res.status(200).json({ message: 'Registration successful', user });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
