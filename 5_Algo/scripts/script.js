async function populateDropdown(csvFilesListPath) {
  const response = await fetch(csvFilesListPath);
  const files = await response.json();

  // console.log(files);

  const select = document.getElementById('csvSelector');

  files.forEach(file => {
    const option = document.createElement('option');
    option.value = file;
    option.textContent = file.replace('.csv', ''); // remove .csv for display
    select.appendChild(option);
  });
}


// Load and render CSV
async function loadCSV(fileName) {
  if (!fileName) return;

  console.log(fileName);
  // let csvFile = 
  const response = await fetch(`${fileName}`);
  const text = await response.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  console.log(headers);

  let html = '<table><tr>';
  headers.forEach(h => html += `<th>${h}</th>`);
  html += '</tr>';

  lines.slice(1).forEach(line => {
    const values = line.split(',');
    html += '<tr>';
    values.forEach(val => html += `<td>${val}</td>`);
    html += '</tr>';
  });

  html += '</table>';

  document.getElementById('csvTable').innerHTML = html;
}

 