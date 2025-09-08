import express from "express";
import cors from "cors";  
import {PrismaClient} from "@prisma/client";
import AdminRouter from "./routers/AdminRoutes.js"


const app = express();
app.use(express.json());
app.use(cors());
const client=new PrismaClient();

app.use("/api/v1/admin", AdminRouter);








app.listen(3000, () => console.log("Server started on port 3000"));

