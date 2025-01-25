// tableSorting.js

// Sorting function
function sortTable(table, columnIndex, ascending) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Sort rows based on the content of the specified column
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].innerText.trim();
    const cellB = rowB.cells[columnIndex].innerText.trim();

    // Check if the content is numeric
    const numA = parseFloat(cellA);
    const numB = parseFloat(cellB);

    if (!isNaN(numA) && !isNaN(numB)) {
      // Numeric comparison
      return ascending ? numA - numB : numB - numA;
    } else {
      // String comparison
      return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    }
  });

  // Append sorted rows back to tbody
  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}

// Attach click listeners to all <th> elements in sortable tables
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('table.sortable th').forEach((header) => {
    header.addEventListener('click', () => {
      const table = header.closest('table'); // Get the parent table
      const columnIndex = Array.from(header.parentNode.children).indexOf(header); // Get column index
      const ascending = !header.classList.contains('asc'); // Determine sort direction

      sortTable(table, columnIndex, ascending);

      // Update class to reflect sorting order
      header.classList.toggle('asc', ascending);
      header.classList.toggle('desc', !ascending);
    });
  });
});

