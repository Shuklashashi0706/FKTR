// import { transaction } from "../../FktrTest.contracts.js";
import { contract } from "../../json/sample.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const mongoUrl = process.env.MONGO_URL;
const dbName = "Contract";

let currentIndex = 0;

export const pushContract = async () => {
  if (currentIndex < contract.length) {
    const currentContract = contract[currentIndex];

    // Connect to MongoDB
    const client = new MongoClient(mongoUrl);

    try {
      await client.connect();

      console.log("Connected to the database");

      const db = client.db(dbName);
      const collection = db.collection("contract");

      await collection.insertOne(currentContract);

      console.log("Inserted into MongoDB:", currentContract);

      currentIndex++;
    } finally {
      await client.close();
    }
  } else {
    console.log("No more contracts");
  }
};
