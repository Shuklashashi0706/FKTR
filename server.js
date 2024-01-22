import express from "express"
import dotenv from "dotenv"
import database from "./data/data.js";
dotenv.config({path:"./.env"});
import { pushContract } from "./controller/Contract/contract.js";
const PORT = process.env.PORT;

const app = express();

//connecting to database
database;
setInterval(pushContract, 5000);

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.listen(PORT,(req,res)=>{
    console.log(`Listening at ${PORT}`)
})  