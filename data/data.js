import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const database = await mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log(err);
    });

export default database;
