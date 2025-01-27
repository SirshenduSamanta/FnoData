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

function FilterVolTimes(data)
{
	// Populate dropdown after fetching data
	const FutOiCng = document.getElementById('VolTimesFilter');
	FutOiCng.replaceChildren(); // Removes all exiting options
	const option = document.createElement('option'); option.textContent = '-- VolTimes --'; FutOiCng.appendChild(option);
	let Values = [1.5, 2, 3, 5, 10]; 
	for (let i=0; i < Values.length; i++)
	{
		const option = document.createElement('option');
		option.value = Values[i]; option.textContent = "> "+Values[i]; FutOiCng.appendChild(option);
	}

	
	// Event linstner
	FutOiCng.addEventListener('change', () => {
		const VALUE = FutOiCng.value;

		// select the table
		const table = document.getElementById('FutData');
          	const tbody = table.querySelector('tbody');
          	tbody.innerHTML = ''; // Clear previous rows


		Object.keys(data).forEach(key => {
			if ( data[key].PriceVol.VolTimes > VALUE )
			{
				// BullBear Factor
				const Bullishness = (2*(data[key].OptionData.BullishFactor) -1).toFixed(2);

				const row = document.createElement('tr');
                                row.innerHTML = `

                                        <td>${key}</td>
                                        <td>${data[key].FutureData.FutOi}</td>
                                        <td>${data[key].FutureData.Fut_category}</td>
                                        <td>${data[key].FutureData.FutOiPer}</td>
                                        <td>${data[key].PriceVol.VolTimes}</td>
                                        <td>${data[key].PriceVol.PriceCng}</td>
                                        <td>${data[key].OptionData.PCR}</td>
                                        <td>${Bullishness}</td>
										<td>
											<div class="bar-container">
											<!-- Bullish bar -->
											<div class="bar bullish" style="height:${data[key].OptionData.BullishFactor * 100}%;">
												<div class="tooltip">Bullish: ${data[key].OptionData.BullishFactor.toFixed(2)}</div>
											</div>
											<!-- Bearish bar -->
											<div class="bar bearish" style="height:${data[key].OptionData.BearishFactor * 100}%;">
												<div class="tooltip">Bearish: ${data[key].OptionData.BearishFactor.toFixed(2)}</div>
											</div>
											</div>
										</td>

                                      `;

                                      tbody.appendChild(row);
			}
		});
		table.style.display = 'table';

	});


}

function FutData(data) {


	FilterVolTimes(data);

	// Populate dropdown after fetching data
	const FutDatalabel = document.getElementById('FutDatalabel');
	FutDatalabel.replaceChildren(); // Removes all exiting options
	const option = document.createElement('option'); option.textContent = '--Select--'; FutDatalabel.appendChild(option);
	let FutPosition = ["Long Buildup", "Short Covering", "Short Buildup", "Long Unwinding", "No Change", "All"];
	for (let i=0; i < FutPosition.length; i++)
	{
		const option = document.createElement('option');
		option.value = FutPosition[i]; option.textContent = FutPosition[i]; FutDatalabel.appendChild(option);
	}


	// Event linstner
        FutDatalabel.addEventListener('change', () => {

		const FutPosition = FutDatalabel.value;

		// select the table
		const table = document.getElementById('FutData');
          	const tbody = table.querySelector('tbody');
          	tbody.innerHTML = ''; // Clear previous rows



		if (FutPosition == "All")
		{
			Object.keys(data).forEach(key => {

				// BullBear Factor
        			const Bullishness = (2*(data[key].OptionData.BullishFactor) -1).toFixed(2);


				const row = document.createElement('tr');
                                row.innerHTML = `

                                        <td>${key}</td>
                                        <td>${data[key].FutureData.FutOi}</td>
                                        <td>${data[key].FutureData.Fut_category}</td>
                                        <td>${data[key].FutureData.FutOiPer}</td>
                                        <td>${data[key].PriceVol.VolTimes}</td>
                                        <td>${data[key].PriceVol.PriceCng}</td>
                                        <td>${data[key].OptionData.PCR}</td>
                                        <td>${Bullishness}</td>
										<td>
											<div class="bar-container">
											<!-- Bullish bar -->
											<div class="bar bullish" style="height:${data[key].OptionData.BullishFactor * 100}%;">
												<div class="tooltip">Bullish: ${data[key].OptionData.BullishFactor.toFixed(2)}</div>
											</div>
											<!-- Bearish bar -->
											<div class="bar bearish" style="height:${data[key].OptionData.BearishFactor * 100}%;">
												<div class="tooltip">Bearish: ${data[key].OptionData.BearishFactor.toFixed(2)}</div>
											</div>
											</div>
										</td>

                                      `;

                                      tbody.appendChild(row);
				});
			table.style.display = 'table';
		}
		else
		{
		
		// Polulate the rows
		Object.keys(data).forEach(key => {

			if (data[key].FutureData.Fut_category == FutPosition){

				// BullBear Factor
                                const Bullishness = (2*(data[key].OptionData.BullishFactor) -1).toFixed(2);

				const row = document.createElement('tr');
				row.innerHTML = `

					<td>${key}</td>
					<td>${data[key].FutureData.FutOi}</td>
                                        <td>${data[key].FutureData.Fut_category}</td>
					<td>${data[key].FutureData.FutOiPer}</td>
					<td>${data[key].PriceVol.VolTimes}</td>
					<td>${data[key].PriceVol.PriceCng}</td>
					<td>${data[key].OptionData.PCR}</td>
					<td>${Bullishness}</td>
					<td>
						<div class="bar-container">
						<!-- Bullish bar -->
						<div class="bar bullish" style="height:${data[key].OptionData.BullishFactor * 100}%;">
							<div class="tooltip">Bullish: ${data[key].OptionData.BullishFactor.toFixed(2)}</div>
						</div>
						<!-- Bearish bar -->
						<div class="bar bearish" style="height:${data[key].OptionData.BearishFactor * 100}%;">
							<div class="tooltip">Bearish: ${data[key].OptionData.BearishFactor.toFixed(2)}</div>
						</div>
						</div>
					</td>
					
				      `;

				      tbody.appendChild(row);

			}
		}); // Populate rows ends here
		table.style.display = 'table';

		}


	}); // Event listener closes here



        } // FutData Function  closes here

