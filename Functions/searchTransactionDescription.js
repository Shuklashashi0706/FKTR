import { brandName } from "./FashionBrandName.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config({ path: "./.env" });

const connectionString = process.env.MONGO_URL;

const databaseName = "Contract";

// Connect to MongoDB
mongoose.connect(connectionString, { dbName: databaseName });

// Create a connection reference
const db = mongoose.connection;

// Check for connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Once connected, perform operations on the database
db.once("open", async () => {
  console.log("Connected to MongoDB");
  const openSeaCollection = db.collection("OpenSea");

  const resultsByWord = {};

  for (let i = 0; i < brandName.length; i++) {
    const word = brandName[i].Name;
    try {
      const result = await openSeaCollection
        .find({
          description: {
            $regex: word,
            $options: "i",
          },
        })
        .sort({
          total_volume: -1,
        })
        .limit(10)
        .toArray();
      // let bodies = [];

      // if (result.length > 0) {
      //   for (let j = 0; j < result.length; j++) {
      //     const body = {
      //       id: result[j]._id,
      //       name: result[j].name,
      //       description: result[j].description,
      //     };
      //     bodies.push(body);
      //   }
      //   console.log(`Found ${result.length} results for ${word}`);
      // } else {
      //   console.log(`No results for ${word}`);
      // }
      console.log(`Found ${result.length} results for ${word}`);
      resultsByWord[word] = result;
    } catch (err) {
      console.error(`Error searching for ${word}:`, err);
    }
  }

  // Close the MongoDB connection
  db.close();

  // Save the final results to a file named "result.js"
  try {
    await fs.writeFile(
      "result.js",
      `export const results = ${JSON.stringify(resultsByWord, null, 2)};\n`
    );
    console.log("Results saved to result.js");
  } catch (err) {
    console.error("Error saving results to file:", err);
  }
});
