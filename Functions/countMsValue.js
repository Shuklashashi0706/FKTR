import {jsonData} from "./mints.js"  
  // Initialize an object to store counts and sum of values for each unique "ms"
  const msData = {};
  
  // Iterate through the JSON data
  jsonData.forEach((data) => {
    const ms = data.ms;
    const value = parseFloat(data.value || 0); // Convert value to a number, assuming it's a string
  
    // Update count and sum based on the unique "ms" value
    if (!msData[ms]) {
      msData[ms] = { count: 1, sum: value };
    } else {
      msData[ms].count += 1;
      msData[ms].sum += value;
    }
  });
  
  // Output the results
  console.log("Count and Sum of 'value' for each unique 'ms':");
  for (const ms in msData) {
    if (msData.hasOwnProperty(ms)) {
      console.log(`${ms}: Count - ${msData[ms].count}, Sum - ${msData[ms].sum}`);
    }
  }
  