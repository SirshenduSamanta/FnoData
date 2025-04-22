function getColor(value) {
	if (value < 0) {
	  // Negative values: shades of red
	  const intensity = Math.min(Math.abs(value) * 2.55, 255); // Scale to 0-255
	  return `rgb(${intensity}, 0, 0)`; // Red increases with negativity
	} else {
	  // Positive values: shades of green
	  const intensity = Math.min(value * 2.55, 255); // Scale to 0-255
	  return `rgb(0, ${intensity}, 0)`; // Green increases with positivity
	}
  }



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
		option6.value = Values5[i]; option6.textContent = "> "+Values5[i]; BullBearFilter.appendChild(option6);
	}

	// for 5-20Ema Filter
	const EmaFilter5_20 = document.getElementById('5_20EmaFilter');
	EmaFilter5_20.replaceChildren(); // Removes all exiting options
	const option7 = document.createElement('option'); option7.value = 0; option7.textContent = '-- 5-20Ema --'; EmaFilter5_20.appendChild(option7);
	let Values6 = ['Price > 5-20','5 > Price > 20', 'Price < 5-20', '5 < Price < 20'];
	for (let i=0; i < Values6.length; i++)
	{
		const option7 = document.createElement('option');
		option7.value = Values6[i]; option7.textContent = Values6[i]; EmaFilter5_20.appendChild(option7);
	}

	// for 20-30Ema Filter
	const EmaFilter20_30 = document.getElementById('20_30EmaFilter');
	EmaFilter20_30.replaceChildren(); // Removes all exiting options
	const option8 = document.createElement('option'); option8.value = 0; option8.textContent = '--20-30Ema(Price within Ema±3%)--'; EmaFilter20_30.appendChild(option8);
	let Values7 = ['20 > 30','20 < 30'];
	for (let i=0; i < Values7.length; i++)
	{
		const option8 = document.createElement('option');
		option8.value = Values7[i]; option8.textContent = Values7[i]; EmaFilter20_30.appendChild(option8);
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

function evaluate5_20EmaCondition(value, MktPrice, Ema5, Ema20) {
	switch (value) {
		case 'Price > 5-20': return MktPrice > Ema5 && MktPrice > Ema20;
		case '5 > Price > 20': return Ema5 > MktPrice && MktPrice > Ema20;
		case 'Price < 5-20': return MktPrice < Ema5 && MktPrice < Ema20;
		case '5 < Price < 20': return Ema5 < MktPrice && MktPrice < Ema20;
		case '0': return true;
		default: throw new Error("Invalid value Ema5-20");
	}
}

function evaluate20_30EmaCondition(value, MktPrice, Ema20, Ema30) {
	switch (value) {
		case '20 > 30': return Ema20 > Ema30 && (Math.abs((MktPrice - Ema30) / Ema30) <= 0.03);
		case '20 < 30': return Ema20 < Ema30 && (Math.abs((MktPrice - Ema30) / Ema30) <= 0.03);
		case '0': return true;
		default: throw new Error("Invalid value Ema20-30");
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
	const Filter5_20Ema = document.getElementById('5_20EmaFilter').value;
	const Filter20_30Ema = document.getElementById('20_30EmaFilter').value;
	//console.log("value : ", typeof Filter5_20Ema);

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
		const MktPrice = data[key].PriceVol.CurrentPrice;
		const Ema5 = data[key].PriceVol.ema_5;
		const Ema20 = data[key].PriceVol.ema_20;
		const Ema30 = data[key].PriceVol.ema_30;

		//console.log(Pcr);

		const Bullishness = (2*(data[key].OptionData.BullishFactor) -1).toFixed(2);

		// For possible Support/Resistance
		const strikes = Object.keys(data[key].OptionData.OptChain.oiCe);
		let maxOiCe = 0; let maxOiPe = 0;
		let maxOiCeKey = null; let maxOiPeKey = null;
		strikes.forEach(strike => {

				if (data[key].OptionData.OptChain.oiCe[strike] > maxOiCe)
				{
						maxOiCe = data[key].OptionData.OptChain.oiCe[strike];
						maxOiCeKey = strike;
				}

				if (data[key].OptionData.OptChain.oiPe[strike] > maxOiPe)
				{
						maxOiPe = data[key].OptionData.OptChain.oiPe[strike];
						maxOiPeKey = strike;
				}

				});
		let support = maxOiPeKey;
		let resistance = maxOiCeKey;

		const currentPrice = data[key].PriceVol.CurrentPrice;

		let ResistanceFromLtp = (((resistance-currentPrice)/currentPrice)*100).toFixed(2);
		let SupportFromLtp = (((support-currentPrice)/currentPrice)*100).toFixed(2);

		//if (ReversalType === 'ResistanceReversal') {var Compare = ResistanceFromLtp;}
		//if (ReversalType === 'SupportReversal') {var Compare = SupportFromLtp;}

		// For OI color
		const OiResistanceWidth = (data[key].OptionData.OptChain.oiCe[resistance] / (maxOiCe+maxOiPe))*70; // Maximum width would be 85 px
		const OiSupportWidth = (data[key].OptionData.OptChain.oiPe[support] / (maxOiCe+maxOiPe))*70; // Maximum width would be 85 px



		if (FilterPosition == '')
		{
			if (Voltimes >= FilterVolTimes && FutOICng >= FilterFutOICng && SpotCng >= FilterSpotCng && BullBear >= FilterBullBear && evaluatePCrCondition(Pcr, FilterPCR) && evaluate5_20EmaCondition(Filter5_20Ema, MktPrice, Ema5, Ema20) && evaluate20_30EmaCondition(Filter20_30Ema, MktPrice, Ema20, Ema30))
			{
				const row = document.createElement('tr');
									row.innerHTML = `

											<td class="stockName">${key}</td>
											<td>${data[key].PriceVol.CurrentPrice}</td>
											<td>${data[key].FutureData.FutOi}</td>
											<td>${data[key].FutureData.Fut_category}</td>
											<td>${data[key].FutureData.FutOiPer}</td>
											<td style="text-align: left; left:5px;">
                                                <div style="margin: 0; left: 0; height: 17px; width: ${OiSupportWidth}px; background-color: rgba(21, 255, 0, 0.62); border-radius: 0 10px 10px 0;">
                                                ${support}
                                                </div>
                                        </td>
                                        <td style="text-align: left; left:5px;">
                                                <div style="margin: 0; left: 0; height: 17px; width: ${OiResistanceWidth}px; background-color: rgba(255, 0, 0, 0.5); border-radius: 0 10px 10px 0;">
                                                ${resistance}
                                                </div>
                                        </td>
											<td>${data[key].OptionData.OptChain.PE_Category[maxOiPeKey]}</td>
											<td>${data[key].OptionData.OptChain.CE_Category[maxOiCeKey]}</td>
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
			if (position == FilterPosition && Voltimes >= FilterVolTimes && FutOICng >= FilterFutOICng && SpotCng >= FilterSpotCng && BullBear >= FilterBullBear && evaluatePCrCondition(Pcr, FilterPCR) && evaluate5_20EmaCondition(Filter5_20Ema, MktPrice, Ema5, Ema20) && evaluate20_30EmaCondition(Filter20_30Ema, MktPrice, Ema20, Ema30))
				{
					const row = document.createElement('tr');
										row.innerHTML = `
	
												<td class="stockName">${key}</td>
												<td>${data[key].PriceVol.CurrentPrice}</td>
												<td>${data[key].FutureData.FutOi}</td>
												<td>${data[key].FutureData.Fut_category}</td>
												<td>${data[key].FutureData.FutOiPer}</td>
												<td style="text-align: left; left:5px;">
                                                <div style="margin: 0; left: 0; height: 17px; width: ${OiSupportWidth}px; background-color: rgba(21, 255, 0, 0.62); border-radius: 0 10px 10px 0;">
                                                ${support}
                                                </div>
                                        </td>
                                        <td style="text-align: left; left:5px;">
                                                <div style="margin: 0; left: 0; height: 17px; width: ${OiResistanceWidth}px; background-color: rgba(255, 0, 0, 0.5); border-radius: 0 10px 10px 0;">
                                                ${resistance}
                                                </div>
                                        </td>
												<td>${data[key].OptionData.OptChain.PE_Category[maxOiPeKey]}</td>
												<td>${data[key].OptionData.OptChain.CE_Category[maxOiCeKey]}</td>
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

	FindStockName();
	
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

	// clear option chain
	const PCR = document.getElementById('PCR'); PCR.style.display="none";
	const VolTimes = document.getElementById('VolTimes'); VolTimes.style.display = "none";
	const FutOICng = document.getElementById('FutOICng');  FutOICng.style.display = "none";
	const SpotPriceCng = document.getElementById('SpotPriceCng');  SpotPriceCng.style.display = "none";
	const BullBearFactor = document.getElementById('BullBearFactor');  BullBearFactor.style.display = "none";

	const tableOp = document.getElementById('option-chain'); tableOp.style.display = "none";

	const selStock = document.getElementsByClassName("left-header"); selStock[0].style.display = "none";

	const middleSec = document.getElementsByClassName("middle-section"); middleSec[0].style.display = "none";

	
	//const tbodyOp = tableOp.querySelector('tbody');
	//tbodyOp.innerHTML = ''; // Clear previous rows

}



function FindStockName()
{
        let selectedStock = '';
        document.querySelectorAll(".stockName").forEach(element => {
                element.addEventListener("click", function(evt) {
                        selectedStock = evt.target.innerText;
                            console.log(selectedStock);
							OptionChain(data, selectedStock);
                });
        });

		//return selectedStock;
}


/* Option Chain Function */


function OptionChain(data, selectedStock) {

	//var cou = 0;
	
	//document.querySelectorAll(".stockName").forEach(element => {
	//        element.addEventListener("click", function(evt) {
	//                var selectedStock = evt.target.innerText;
	//                    console.log(selectedStock);

// Populate dropdown after fetching data
	//const stockSelect = document.getElementById('stock-select');
//stockSelect.replaceChildren(); // Removes all existing options
//const option = document.createElement('option'); option.textContent = '--Select a Stock--'; stockSelect.appendChild(option);
	//Object.keys(data).forEach(stock => { const option = document.createElement('option'); option.value = stock; option.textContent = stock; stockSelect.appendChild(option); }); // <option value="AAPL">AAPL</option>



	// load the json data
//(async function() {
//	data = await loadJSON('../data.json'); // Load the JSON data
//});

// Event linstner
//stockSelect.addEventListener('change', () => {
	  //const selectedStock = stockSelect.value;

  /////////////////////////////// show PCR value
  const middleSec = document.getElementsByClassName("middle-section"); middleSec[0].style.display = "inline";

  const selStock = document.getElementsByClassName("left-header");
  selStock[0].innerText = selectedStock + "  Option Chain"; selStock[0].style.display = "inline";
  const PCR = document.getElementById('PCR');
	  PCR.style.display = "inline";
  PCR.textContent = "PCR: " + data[selectedStock].OptionData.PCR;
	PCR.className = "bold-row";
  if ( data[selectedStock].OptionData.PCR > 1 )
	{
		PCR.className = "positive";
	}
  if ( data[selectedStock].OptionData.PCR < 1 )
			{
					PCR.className = "negative";
			}

  ///////////////////////// Show Volume times
	  const VolTimes = document.getElementById('VolTimes');
	//   VolTimes.style.display = "inline";
	//   VolTimes.textContent = "VolTimes: " + data[selectedStock].PriceVol.VolTimes;

  ///////////////// FutOICng show
	  const FutOICng = document.getElementById('FutOICng');
	//   FutOICng.style.display = "inline";
	//   FutOICng.textContent = "FutOICng: " + data[selectedStock].FutureData.FutOiPer + "%";

	 /////////////// SpotPriceCng show
	 const SpotPriceCng = document.getElementById('SpotPriceCng');
	//  SpotPriceCng.style.display = "inline";
	//  SpotPriceCng.textContent = "SpotPriceCng: " + data[selectedStock].PriceVol.PriceCng + "%";

 //////////// BullBearFactor show
	const BullBearFactor = document.getElementById('BullBearFactor');
	const Bullishness = (2*(data[selectedStock].OptionData.BullishFactor) -1).toFixed(2);
	// BullBearFactor.style.display = "inline";
	// BullBearFactor.textContent = "BullBearFactor: " + Bullishness ;


if ( Bullishness > 0 )
			{       
					BullBearFactor.className = "positive";
			}
	  if ( Bullishness < 0 )
			{       
					BullBearFactor.className = "negative";
			}


	  //PCR.style.display = "inline";

  const table = document.getElementById('option-chain');
	  const tbody = table.querySelector('tbody');
  tbody.innerHTML = ''; // Clear previous rows

//const CE_CategoryWeight = [];
	//const PE_CategoryWeight = [];

if (selectedStock && data[selectedStock]) {
		const stockData = data[selectedStock];
		const strikes = Object.keys(stockData.OptionData.OptChain.oiCe);
		const strikeThreshold = stockData.PriceVol.CurrentPrice; // Define the threshold for CE & PE coloring

		// Find max OI
		let maxOiCe = 0; let maxOiPe = 0;
		let maxOiCeKey = null; let maxOiPeKey = null;

		strikes.forEach(strike => {

				if (stockData.OptionData.OptChain.oiCe[strike] > maxOiCe)
				{
						maxOiCe = stockData.OptionData.OptChain.oiCe[strike];
						maxOiCeKey = strike;
				}

				if (stockData.OptionData.OptChain.oiPe[strike] > maxOiPe)
				{
						maxOiPe = stockData.OptionData.OptChain.oiPe[strike];
						maxOiPeKey = strike;
				}

			});


			// Maximum Oi
			let MaxOI = Math.max(maxOiCe, maxOiPe);


   
		  strikes.forEach(strike => {
		  const row = document.createElement('tr');
		  const oiCeCngClass = stockData.OptionData.OptChain.oichpCe[strike] < 0 ? 'negative' : 'positive';
		  const oiPeCngClass = stockData.OptionData.OptChain.oichpPe[strike] < 0 ? 'negative' : 'positive';
		  const highlightClassCE = parseFloat(strike) < strikeThreshold ? 'highlight' : '';
		  const highlightClassPE = parseFloat(strike) > strikeThreshold ? 'highlight' : '';
		  const boldClassMaxCE = ( strike == maxOiCeKey ) ? 'bold-row' : '';
		  const boldClassMaxPE = ( strike == maxOiPeKey ) ? 'bold-row' : '';
	  const ltpcecng = stockData.OptionData.OptChain.ltpchpCe[strike] < 0 ? 'negative' : 'positive';
	  const ltppecng = stockData.OptionData.OptChain.ltpchpPe[strike] < 0 ? 'negative' : 'positive';
	  const StrikeColumnColor = strike > 0 ? 'strikeColumnColor' : '';

	  // condition for position shifting cell color
	  const PositionShiftWeightCE = stockData.OptionData.OptChain.PositionShiftWeightCE[strike];
	  const CeColorIntensity = Math.min(Math.abs(PositionShiftWeightCE) * 50, 255); // Scale the value to a max of 255
	  const CePositionColor = PositionShiftWeightCE > 0 ? `rgba(0, 255, 0, ${CeColorIntensity / 255})` : `rgba(255, 0, 0, ${CeColorIntensity / 255})`;

	  const PositionShiftWeightPE = stockData.OptionData.OptChain.PositionShiftWeightPE[strike];
		  const PeColorIntensity = Math.min(Math.abs(PositionShiftWeightPE) * 50, 255); // Scale the value to a max of 255
		  const PePositionColor = PositionShiftWeightPE > 0 ? `rgba(0, 255, 0, ${PeColorIntensity / 255})` : `rgba(255, 0, 0, ${PeColorIntensity / 255})`;

		  const OiLevelWidthCe = (stockData.OptionData.OptChain.oiCe[strike] / MaxOI)*90; // Maximum width would be 85 px
		  const OiLevelWidthPe = (stockData.OptionData.OptChain.oiPe[strike] / MaxOI)*90; // Maximum width would be 85 px

		  // <td class="${highlightClassCE} ${boldClassMaxCE}">${stockData.OptionData.OptChain.oiCe[strike]}</td>

		  /*
	row.innerHTML = `
			<td class="${highlightClassCE} ${boldClassMaxCE}" style="text-align: left;">
					<div style="margin :0; left: 0; height: 17px; width: ${OiLevelWidthCe}px; background-color: rgba(255, 0, 0, 0.5); border-radius : 0 10px 10px 0">
							${stockData.OptionData.OptChain.oiCe[strike]}
					</div>
					

			</td>
			<td class="${highlightClassCE} ${oiCeCngClass} ${boldClassMaxCE}">${stockData.OptionData.OptChain.oichpCe[strike]}</td>
			<td class="${highlightClassCE} ${boldClassMaxCE}">${stockData.OptionData.OptChain.ltpCe[strike]}</td>
			<td class="${highlightClassCE} ${ltpcecng} ${boldClassMaxCE}">${stockData.OptionData.OptChain.ltpchpCe[strike]}</td>
			<td class="${highlightClassCE} ${boldClassMaxCE}" style="background-color: ${CePositionColor};">${stockData.OptionData.OptChain.CE_Category[strike]}</td>
	
	<td class="${boldClassMaxCE} ${boldClassMaxPE} ${StrikeColumnColor}">${strike}</td>
					
			<td class="${highlightClassPE} ${boldClassMaxPE}" style="background-color: ${PePositionColor};">${stockData.OptionData.OptChain.PE_Category[strike]}</td>
	<td class="${highlightClassPE} ${ltppecng} ${boldClassMaxPE}">${stockData.OptionData.OptChain.ltpchpPe[strike]}</td>
	<td class="${highlightClassPE} ${boldClassMaxPE}">${stockData.OptionData.OptChain.ltpPe[strike]}</td>
			<td class="${highlightClassPE} ${oiPeCngClass} ${boldClassMaxPE}">${stockData.OptionData.OptChain.oichpPe[strike]}</td>
	<td class="${highlightClassPE} ${boldClassMaxPE}" style="text-align: left;">
					<div style="margin :0; left: 0; height: 17px; width: ${OiLevelWidthPe}px; background-color: rgba(21, 255, 0, 0.62); border-radius : 0 10px 10px 0">
							${stockData.OptionData.OptChain.oiPe[strike]}
					</div>
					
			</td>
		  `;
		  */

		  row.innerHTML = `
			<td class="${highlightClassCE} ${boldClassMaxCE}" style="text-align: left;">
					<div style="margin :0; left: 0; height: 17px; width: ${OiLevelWidthCe}px; background-color: rgba(255, 0, 0, 0.5); border-radius : 0 10px 10px 0">
							${stockData.OptionData.OptChain.oiCe[strike]}
					</div>
			</td>
			<td class="${highlightClassCE} ${boldClassMaxCE}" style="background-color: ${CePositionColor};">${stockData.OptionData.OptChain.CE_Category[strike]}</td>
	
			<td class="${boldClassMaxCE} ${boldClassMaxPE} ${StrikeColumnColor}">${strike}</td>
					
			<td class="${highlightClassPE} ${boldClassMaxPE}" style="background-color: ${PePositionColor};">${stockData.OptionData.OptChain.PE_Category[strike]}</td>
			<td class="${highlightClassPE} ${boldClassMaxPE}" style="text-align: left;">
					<div style="margin :0; left: 0; height: 17px; width: ${OiLevelWidthPe}px; background-color: rgba(21, 255, 0, 0.62); border-radius : 0 10px 10px 0">
							${stockData.OptionData.OptChain.oiPe[strike]}
					</div>	
			</td>
		  `;


		  tbody.appendChild(row);
		});

	table.style.display = 'table';
	  } else { table.style.display = 'none';} 

			  // show PCR value
	  //const PCR = document.getElementById('PCR');
	  //PCR.style.display = "inline";
	  //PCR.textContent = "PCR: " + stockData.OptionData.PCR;
	  //PCR.style.display = "inline";
//}); // Evt listener ends here



}

