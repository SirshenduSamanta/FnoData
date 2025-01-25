// Load CSV file dynamically
async function loadCSV(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.statusText}`);
    }
    return await response.text();
  }

  // Parse CSV data
  function parseCSV(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => line.split(","));

    // Fixed colors for the lines
    const fixedColors = {
        NIFTY: 'rgb(255, 99, 132)',       // Red
        BANKNIFTY: 'rgb(54, 162, 235)',  // Blue
        SENSEX: 'rgb(75, 192, 192)',     // Teal
        BANKEX: 'rgb(255, 206, 86)'      // Yellow
      };
    
    const result = {
      labels: rows.map(row => row[0]), // Time for X-axis
      datasets: headers.slice(1).map((header, i) => ({
        label: header,
        data: rows.map(row => parseFloat(row[i + 1])),
        borderColor: fixedColors[header], // Assign fixed color based on column name
        fill: false,
        tension: 0.3
      }))
    };
    return result;
  }

  // Generate a random color for each dataset
  function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
  }

  // Main function
  async function PCRPlot() {
    try {
      // Load CSV file
      const csvData = await loadCSV('../pcr.csv'); // Adjust the path if needed
      const chartData = parseCSV(csvData);

      // Create the chart
      const ctx = document.getElementById("PCRPLOT").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
              }
            },
            y: {
              title: {
                display: true,
                text: "Values",
              },
              min: 0.45,
              max: 1.1
            }
          }
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }