import express from "express";
import cors from "cors";  
import {PrismaClient} from "@prisma/client";


const app = express();
app.use(express.json());
app.use(cors());
const client=new PrismaClient();
app.listen(3000, () => console.log("Server started on port 3000"));

async function createClass() {
  const Admin=await client.Admin.create({data:{email:"admin1@gmail.com",password:"admin"}});
}

createClass()

