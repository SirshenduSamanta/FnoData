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

  
    let Usram = '';
    let pAssdr = '';
    (async function() {
       data = await loadJSON('psswrd.json'); // Load the JSON data
                    if (data)
        {
          console.log("Coming HREEEEE");
          Usram = data.Username;
          pAssdr = data.psswrd;
          console.log("Username and password loaded.");
        }
    })();


document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const usErnA = document.getElementById("username").value;
    const PAsSRd = document.getElementById("password").value;

    // Simple check (replace with a more secure check later)
    if (usErnA === Usram && PAsSRd === pAssdr) {
        localStorage.setItem("authenticated", "true");
        window.location.href = "/protected.html";
    } else {
        document.getElementById("error-msg").textContent = "Invalid username or password.";
    }
});