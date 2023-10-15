import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from "next";
import {setUserId} from "utils/userIdManager";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method === 'POST'){
        const {username, password} = req.body

        try {

            const user = await prisma.user.findUnique({where: {username}});
            if (!user){
                console.error('Invalid Username or Password');
                res.status(401).json({ message: 'Incorrect Password' });
            }
            const passwordValid = await bcrypt.compare(password, user?.password ?? "");
            if (!passwordValid){
                console.error('Incorrect Password');
                res.status(401).json({ message: 'Incorrect Password' });
            }
            setUserId(user.id);
            res.status(200).json({ message: 'Sign in successful', user });
        } catch (error) {
            console.error('Sign in failed:', error);
            res.status(500).json({ message: 'Registration failed' });
        }     
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}