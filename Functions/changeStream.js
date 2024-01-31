import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const connectionString = process.env.MONGO_URL;
const databaseName = "Contract";

mongoose.connect(connectionString, { dbName: databaseName });

// Create a connection reference
const db = mongoose.connection;

// Check for connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Once connected, perform operations on the database
db.once("open", () => {
  console.log("Connected to MongoDB");

  // Access a specific collection
  const contractCollection = db.collection("contract");
  const openSeaCollection = db.collection("OpenSea");

  const changeStream = contractCollection.watch();

  changeStream.on("change", async (contractChange) => {
    if (contractChange.operationType === "insert") {
      const currentContract = contractChange.fullDocument;
      if (currentContract.contractAddress) {
        const matchingDocuments = await openSeaCollection
          .find({
            $or: [
              {
                name: {
                  $regex: currentContract.contractAddress,
                  $options: "i",
                },
              },
            ],
          })
          .toArray();

        if (matchingDocuments.length > 0) {
          const updatedSea = await openSeaCollection.updateMany(
            {
              $or: [
                {
                  name: {
                    $regex: currentContract.contractAddress,
                    $options: "i",
                  },
                },
              ],
            },
            {
              $unset: {
                type: currentContract.Sector,
              },
              $set:{
                category:currentContract.Sector,
                noUpdate:true,
              }
            }
          );
          console.log(
            `Updated OpenSea collection for contractAddress: ${currentContract.contractAddress}`
          );
        } else {
          console.log(
            `No matching documents found in OpenSea collection for contractAddress: ${currentContract.contractAddress}`
          );
        }
      } else {
        console.log("Contract address is empty");
      }
    }
  });
});
