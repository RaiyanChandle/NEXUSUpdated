import 'dotenv/config';
import express from "express";
import cors from "cors";  
import {PrismaClient} from "@prisma/client";
import AdminRouter from "./routers/AdminRoutes.js"
import dotenv from "dotenv";
dotenv.config();


const app = express();
const frontend_url=process.env.VITE_FRONTEND_URL;
app.use(express.json());
app.use(cors({
    origin: [frontend_url],
    methods: ["POST", "GET"],
    credentials: true
}));
const client=new PrismaClient();

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/v1/admin", AdminRouter);








app.listen(3000, () => console.log("Server started on port 3000"));

