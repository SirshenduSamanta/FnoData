// Function to load JSON data from a file
async function loadJSON(url) {
  try {
    //console.log("This is properly linked.")
    const response = await fetch(url); // Fetch the JSON file from the provided URL
    //if (!response.ok) {
    //  throw new Error(`Failed to load JSON data from ${url}`);
    //}
    const data = await response.json(); // Parse the JSON
    //console.log(Object.keys(data));
    return data; // Return the JSON object
  } catch (error) {
    console.error('Error loading JSON:', error);
    return null; // Return null if an error occurs
  }
}
