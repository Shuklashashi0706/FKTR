import fs from "fs";
import csv from "csv-parser";

const inputFilePath = "FashionBrandName.csv";
const outputFilePath = "FashionBrandName.json";

const selectedColumns =["Name"];
const jsonData = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const selectedData = {};
    let hasValue = false;

    selectedColumns.forEach((col) => {
      if (row[col]) {
        selectedData[col] = row[col];
        hasValue = true;
      } else {
        selectedData[col] = null;
      }
    });

    if (hasValue) {
      jsonData.push(selectedData);
    }
  })
  .on("end", () => {
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
    console.log("Conversion complete. JSON data written to", outputFilePath);
  });
