import express from "express";
import { PrismaClient } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";

const client = new PrismaClient();

export const AdminSingUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password)
        const Admin = await client.admin.findFirst({
            where: {
                email: email
            }
        });
        if (Admin) {
            return res.status(200).json({ message: "Admin already exists" })
        }
        const bcrypt = (await import('bcrypt')).default;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await client.admin.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })
        return res.status(200).json({ message: "Admin created successfully" })
    } catch (e){
        console.error(e);
        res.status(500).json({
            message:"internal server error"
        })
    }
}


export const AdminSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const bcrypt = (await import('bcrypt')).default;
        const Admin = await client.admin.findFirst({
            where: {
                email: email
            }
        });
        if (Admin && await bcrypt.compare(password, Admin.password)) {
            const token = jsonwebtoken.sign({ email: email, id: Admin.id }, process.env.JWT_SECRET);
            return res.status(200).json({ message: "Sign in successful", token: token });
        }
        return res.status(401).json({ message: "Invalid credentials" });
    } catch (e){
        console.error(e);
        res.status(500).json({
            message:"internal server error"
        })
    }
}

