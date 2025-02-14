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



function PopulateDropDown()
{
	// Populate dropdown after fetching data

	// for position shifting
	const FutDatalabel = document.getElementById('FutDatalabelFilter');
	FutDatalabel.replaceChildren(); // Removes all exiting options
	const option1 = document.createElement('option'); option1.value = '';  option1.textContent = '-- Position --'; FutDatalabel.appendChild(option1);
	let FutPosition = ["Long Buildup", "Short Covering", "Short Buildup", "Long Unwinding", "No Change"];
	for (let i=0; i < FutPosition.length; i++)
	{
		const option1 = document.createElement('option');
		option1.value = FutPosition[i]; option1.textContent = FutPosition[i]; FutDatalabel.appendChild(option1);
	}

	// for volTimes
	const VolTimeFilter = document.getElementById('VolTimesFilter');
	VolTimeFilter.replaceChildren(); // Removes all exiting options
	const option2 = document.createElement('option'); option2.value = 0; option2.textContent = '-- VolTimes --'; VolTimeFilter.appendChild(option2);
	let Values1 = [1.5, 2, 3, 5, 10]; 
	for (let i=0; i < Values1.length; i++)
	{
		const option2 = document.createElement('option');
		option2.value = Values1[i]; option2.textContent = "> "+Values1[i]; VolTimeFilter.appendChild(option2);
	}

	// for FutOICng Filter
	const FutOICngFilter = document.getElementById('FutoicngFilter');
	FutOICngFilter.replaceChildren(); // Removes all exiting options
	const option3 = document.createElement('option'); option3.value = 0; option3.textContent = '-- FutOICng% --'; FutOICngFilter.appendChild(option3);
	let Values2 = [1.5, 2, 3, 5, 10]; 
	for (let i=0; i < Values2.length; i++)
	{
		const option3 = document.createElement('option');
		option3.value = Values2[i]; option3.textContent = "> "+Values2[i]+"%"; FutOICngFilter.appendChild(option3);
	}

	// for SpotPriceCng Filter
	const SpotPriceCngFilter = document.getElementById('spotcngFilter');
	SpotPriceCngFilter.replaceChildren(); // Removes all exiting options
	const option4 = document.createElement('option'); option4.value = 0; option4.textContent = '-- SpotCng% --'; SpotPriceCngFilter.appendChild(option4);
	let Values3 = [1.5, 2, 3, 5, 10]; 
	for (let i=0; i < Values3.length; i++)
	{
		const option4 = document.createElement('option');
		option4.value = Values3[i]; option4.textContent = "> "+Values3[i]+"%"; SpotPriceCngFilter.appendChild(option4);
	}

	// for PCR Filter
	const PCRFilter = document.getElementById('PcrFilter');
	PCRFilter.replaceChildren(); // Removes all exiting options
	const option5 = document.createElement('option'); option5.value = 0; option5.textContent = '-- PCR --'; PCRFilter.appendChild(option5);
	let Values4 = [ '< 0.7', '< 1.0', '= 1.0', '> 1.0', '> 1.3']; 
	for (let i=0; i < Values4.length; i++)
	{
		const option5 = document.createElement('option');
		option5.value = Values4[i]; option5.textContent = Values4[i]; PCRFilter.appendChild(option5);
	}

	// for BullBear Filter
	const BullBearFilter = document.getElementById('bullbearFilter');
	BullBearFilter.replaceChildren(); // Removes all exiting options
	const option6 = document.createElement('option'); option6.value = 0; option6.textContent = '-- BullBear --'; BullBearFilter.appendChild(option6);
	let Values5 = [0.70,0.80,0.90, 0.95]; 
	for (let i=0; i < Values5.length; i++)
	{
		const option6 = document.createElement('option');
		option6.value = Values4[i]; option6.textContent = "> "+Values5[i]; BullBearFilter.appendChild(option6);
	}

}

function evaluatePCrCondition(number, conditionStr) {
	if ( conditionStr == 0)
	{
		return true;
	}
    let operator = conditionStr.trim().charAt(0);  // Extract operator ('>')
    let value = parseFloat(conditionStr.substring(1).trim()); // Extract value (0.7)

    switch (operator) {
        case '>': return number > value;
        case '<': return number < value;
        case '=': return number === value; // Strict equality
        case '!': return number !== value; // Not equal
        default: throw new Error("Invalid operator");
    }
}


function applyFilter()
{
	const FilterPosition = document.getElementById('FutDatalabelFilter').value;
	const FilterVolTimes = document.getElementById('VolTimesFilter').value;
	const FilterFutOICng = document.getElementById('FutoicngFilter').value;
	const FilterSpotCng = document.getElementById('spotcngFilter').value;
	const FilterBullBear = document.getElementById('bullbearFilter').value;
	const FilterPCR = document.getElementById('PcrFilter').value; // let PCRoperatorString = FilterPCR.trim().charAt(0); let PCRValue = parseFloat(FilterPCR.substring(1).trim());

	//console.log(typeof(PCRValue));

	// load the json data
	(async function() {
		data = await loadJSON('../data.json'); // Load the JSON data
	});

	// select the table
	const table = document.getElementById('FutData');
	const tbody = table.querySelector('tbody');
	tbody.innerHTML = ''; // Clear previous rows

	Object.keys(data).forEach(key => {

		const position = data[key].FutureData.Fut_category;
		const Voltimes = data[key].PriceVol.VolTimes;
		const FutOICng = Math.abs(data[key].FutureData.FutOiPer);
		const SpotCng = Math.abs(data[key].PriceVol.PriceCng);
		const BullBear = Math.abs((2*(data[key].OptionData.BullishFactor) -1).toFixed(2));
		const Pcr = data[key].OptionData.PCR;

		//console.log(Pcr);

		const Bullishness = (2*(data[key].OptionData.BullishFactor) -1).toFixed(2);

		if (FilterPosition == '')
		{
			if (Voltimes >= FilterVolTimes && FutOICng >= FilterFutOICng && SpotCng >= FilterSpotCng && BullBear >= FilterBullBear && evaluatePCrCondition(Pcr, FilterPCR))
			{
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
		}
		else
		{
			if (position == FilterPosition && Voltimes >= FilterVolTimes && FutOICng >= FilterFutOICng && SpotCng >= FilterSpotCng && BullBear >= FilterBullBear && evaluatePCrCondition(Pcr, FilterPCR))
				{
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
		}

	});
	table.style.display = 'table';
	
}

function FutData() {


	//FilterVolTimes(data);
	PopulateDropDown();

	const filters = document.querySelectorAll('.filter'); 
	// Attach event listener to each filter
	filters.forEach(filter => {
	filter.addEventListener('change', applyFilter);
  	});


} // FutData Function  closes here


function resetFilters()
{
	PopulateDropDown();
	// select the table
	const table = document.getElementById('FutData');
	const tbody = table.querySelector('tbody');
	tbody.innerHTML = ''; // Clear previous rows
	table.style.display = 'none';

}

