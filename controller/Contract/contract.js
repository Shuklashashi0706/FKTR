import { contract } from "../../json/sample.js";
import { MongoClient } from "mongodb";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const mongoUrl = process.env.MONGO_URL;
const dbName = "Contract";
const indexFilePath = "./index.txt"; // Path to the file storing the current index

export const pushContract = async () => {
  let currentIndex = readIndexFromFile();

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

      writeIndexToFile(currentIndex);
    } finally {
      await client.close();
    }
  } else {
    console.log("No more contracts");
  }
};

// Function to read the current index from the file
const readIndexFromFile = () => {
  try {
    return parseInt(fs.readFileSync(indexFilePath, "utf8")) || 0;
  } catch (error) {
    console.error("Error reading index file:", error.message);
    return 0;
  }
};

// Function to write the current index to the file
const writeIndexToFile = (index) => {
  try {
    fs.writeFileSync(indexFilePath, index.toString());
  } catch (error) {
    console.error("Error writing index file:", error.message);
  }
};
