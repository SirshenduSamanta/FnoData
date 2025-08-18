

function PopulateReversalDropdown()
{
        // Populate dropdown after fetching data
        const Reversal = document.getElementById('NearSupportResistanceFilter');
	Reversal.replaceChildren(); // Removes all existing options
        const option0 = document.createElement('option'); option0.value = ''; option0.textContent = '--Reversal--'; Reversal.appendChild(option0);
	const option = document.createElement('option'); option.value = 'ReversalFromResistance'; option.textContent = '--ReversalFromResistance--'; Reversal.appendChild(option);
        const option1 = document.createElement('option'); option1.value = 'ReversalFromSupport'; option1.textContent = '--ReversalFromSupport--'; Reversal.appendChild(option1);
        //Object.keys(data).forEach(stock => { const option = document.createElement('option'); option.value = stock; option.textContent = stock; stockSelect.appendChild(option); }); // <option value="AAPL">AAPL</option>
}

function ResistanceReversalDropdown()
{
        // Populate dropdown after fetching data
        const ResistanceReversal = document.getElementById('ResistanceReversal');
	ResistanceReversal.replaceChildren(); // Removes all existing options
        const option0 = document.createElement('option'); option0.value = [0,0]; option0.textContent = '--ReversalFromResistance--'; ResistanceReversal.appendChild(option0);
	const option = document.createElement('option'); option.value = [0, 0.5]; option.textContent = '--Close to Resistance--'; ResistanceReversal.appendChild(option);
        const option1 = document.createElement('option'); option1.value = [0.5, 1.5]; option1.textContent = '--Near Resistance--'; ResistanceReversal.appendChild(option1);
        const option2 = document.createElement('option'); option2.value = [-0.5, 0]; option2.textContent = '--Break Resistance--'; ResistanceReversal.appendChild(option2);
        ResistanceReversal.style.display = 'inline';
}

function SupportReversalDropdown()
{
        // Populate dropdown after fetching data
        const SupportReversal = document.getElementById('SupportReversal');
	SupportReversal.replaceChildren(); // Removes all existing options
        const option0 = document.createElement('option'); option0.value = [0, 0]; option0.textContent = '--ReversalFromSupport--'; SupportReversal.appendChild(option0);
	const option = document.createElement('option'); option.value = [-0.5, 0]; option.textContent = '--Close to Support--'; SupportReversal.appendChild(option);
        const option1 = document.createElement('option'); option1.value = [-1.5, -0.5]; option1.textContent = '--Near Support--'; SupportReversal.appendChild(option1);
        const option2 = document.createElement('option'); option2.value = [0, 0.5]; option2.textContent = '--Break Support--'; SupportReversal.appendChild(option2);
        SupportReversal.style.display = 'inline';
}






function Reversaltrading(data, IvFutData, FutOiData, Nifty500IndustryJson, FutOiAbs) {
        PopulateReversalDropdown();
        const Reversal = document.getElementById('NearSupportResistanceFilter');
        //var ReversalType = '';
        Reversal.addEventListener('change', () => {
                const ReversalValue = Reversal.value;
                if (ReversalValue === 'ReversalFromResistance')
                {
                        const ResistanceReversal = document.getElementById('ResistanceReversal');
                        ResistanceReversal.style.display = 'none';
                        SupportReversal.style.display = 'none';
                        const table = document.getElementById('ReversalTradingTable');
                        table.style.display = 'none';
                        ResistanceReversalDropdown();

                        var ReversalType = 'ResistanceReversal';
                }
                if (ReversalValue === 'ReversalFromSupport')
                {
                        const SupportReversal = document.getElementById('SupportReversal');
                        ResistanceReversal.style.display = 'none';
                        SupportReversal.style.display = 'none';
                        const table = document.getElementById('ReversalTradingTable');
                        table.style.display = 'none';
                        SupportReversalDropdown();

                        var ReversalType = 'SupportReversal';     
                }
                
                //console.log(ReversalType);

                var ReversalTypeID = document.getElementById(ReversalType);
                ReversalTypeID.addEventListener('change', () => {
                        var ReversalTypeIDValue = ReversalTypeID.value.split(',').map(Number);
                        //console.log(ReversalTypeIDValue);

                        /// Prepare the table
                        const table = document.getElementById('ReversalTradingTable');
                        const tbody = table.querySelector('tbody');
                        tbody.innerHTML = ''; // Clear previous rows

                        Object.keys(data).forEach(key => {
                                ///// BullBear Factor
                                const Bullishness = (2*(data[key].OptionData.BullishFactor) -1).toFixed(2);
                                ///////////////////////////    Find max OI stike
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

                                ////// current price
                                const currentPrice = data[key].PriceVol.CurrentPrice;

                                let ResistanceFromLtp = (((resistance-currentPrice)/currentPrice)*100).toFixed(2);
                                let SupportFromLtp = (((support-currentPrice)/currentPrice)*100).toFixed(2);

                                if (ReversalType === 'ResistanceReversal') {var Compare = ResistanceFromLtp;}
                                if (ReversalType === 'SupportReversal') {var Compare = SupportFromLtp;}

                                //console.log(JSON.parse(ReversalTypeIDValue)[1]);

                                // For OI color
                                const OiResistanceWidth = (data[key].OptionData.OptChain.oiCe[resistance] / (maxOiCe+maxOiPe))*85; // Maximum width would be 85 px
                                const OiSupportWidth = (data[key].OptionData.OptChain.oiPe[support] / (maxOiCe+maxOiPe))*85; // Maximum width would be 85 px

                                if ( Compare >= ReversalTypeIDValue[0] && Compare < ReversalTypeIDValue[1])
                                {
                                        ////// make the table
                                        const row = document.createElement('tr');
                        
                                        //console.log(OiSupportWidth);
                                        row.innerHTML = `
                                        <td class="stockName">${key}</td>
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

                                        <td>${currentPrice}</td>
                                        <td>${ResistanceFromLtp}</td>
                                        <td>${SupportFromLtp}</td>
                                        <td>${data[key].FutureData.FutOiPer}</td>
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


                                FindStockName(IvFutData);
                        });

                
        });

        

        //// Resistance or Support evt listener
        //if (ReversalType != ''){}
        

	// Populate dropdown after fetching data
        //const stockSelect = document.getElementById('stock-select');
	//stockSelect.replaceChildren(); // Removes all existing options
	//const option = document.createElement('option'); option.textContent = '--Select a Stock--'; stockSelect.appendChild(option);
        //Object.keys(data).forEach(stock => { const option = document.createElement('option'); option.value = stock; option.textContent = stock; stockSelect.appendChild(option); }); // <option value="AAPL">AAPL</option>




	// Event linstner
	//stockSelect.addEventListener('change', () => {

          //const selectedStock = stockSelect.value;

	  /////////////////////////////// show PCR value
	  //const PCR = document.getElementById('PCR');
          //PCR.style.display = "inline";
	  //PCR.textContent = "PCR: " + data[selectedStock].OptionData.PCR;
	  //PCR.className = "bold-row";
          /*
	  if ( data[selectedStock].OptionData.PCR > 1 )
		{
			PCR.className = "positive";
		}
	  if ( data[selectedStock].OptionData.PCR < 1 )
                {
                        PCR.className = "negative";
                }
          */
         /*
	  ///////////////////////// Show Volume times
          const VolTimes = document.getElementById('VolTimes');
          VolTimes.style.display = "inline";
          VolTimes.textContent = "VolTimes: " + data[selectedStock].PriceVol.VolTimes;

	  ///////////////// FutOICng show
          const FutOICng = document.getElementById('FutOICng');
          FutOICng.style.display = "inline";
          FutOICng.textContent = "FutOICng: " + data[selectedStock].FutureData.FutOiPer + "%";
	
         /////////////// SpotPriceCng show
         const SpotPriceCng = document.getElementById('SpotPriceCng');
         SpotPriceCng.style.display = "inline";
         SpotPriceCng.textContent = "SpotPriceCng: " + data[selectedStock].PriceVol.PriceCng + "%";

 	//////////// BullBearFactor show
        const BullBearFactor = document.getElementById('BullBearFactor');
	const Bullishness = (2*(data[selectedStock].OptionData.BullishFactor) -1).toFixed(2);
        BullBearFactor.style.display = "inline";
        BullBearFactor.textContent = "BullBearFactor: " + Bullishness ;
	if ( Bullishness > 0 )
                {       
                        BullBearFactor.className = "positive";
                }
          if ( Bullishness < 0 )
                {       
                        BullBearFactor.className = "negative";
                }


          //PCR.style.display = "inline";
        */

	  


}



function FindStockName(IvFutData)
        {
                let selectedStock = '';
                document.querySelectorAll(".stockName").forEach(element => {
                        element.addEventListener("click", function(evt) {
                                selectedStock = evt.target.innerText;
                                //console.log(selectedStock);

				// Go to the new page
				let encodedselectedStock = encodeURIComponent(selectedStock);
				let targetUrl = `../6_DataHistory/DataHistory.html?STOCK=${encodedselectedStock}`;
					// Open in a new tab
        			window.open(targetUrl, "_blank");



                                document.querySelector(".SelectedStockHistory").style.display = "inline-block";
                                // OptionChain(data, selectedStock);
                                makeSelectedStockHistoryDivPlots(selectedStock, IvFutData, FutOiData, Nifty500IndustryJson, FutOiAbs);
                        });
                });
                
                        //return selectedStock;
        }



        



let basisChartInstance = null; // global variable

function makeSelectedStockHistoryDivPlots(selectedStock, IvFutData, FutOiData, Nifty500IndustryJson, FutOiAbs) {
    const labels = [];
    const basisValues = [];

    Object.keys(IvFutData).forEach(date => {
        const stockData = IvFutData[date][selectedStock];
        if (stockData) {
            const { FutLtp, SpotLtp } = stockData;
            const basis = (FutLtp - SpotLtp) / SpotLtp;
            labels.push(date);
            basisValues.push(basis);
        }
    });



    // Destroy previous chart if it exists
    if (basisChartInstance) {
        basisChartInstance.destroy();
    }
    // Create new chart
    const ctx = document.getElementById('basisChart').getContext('2d');
    basisChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Basis for ${selectedStock}`,
                data: basisValues,
                borderColor: 'blue',
                backgroundColor: 'lightblue',
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        callback: val => (val * 100).toFixed(2) + '%'
                    }
                }
            }
        }
    });



    //// plot iv/ivp chart
    makeIVandIVPPlot(selectedStock, IvFutData);
    //makeFutHistoryPPlot(selectedStock, FutOiData)
    //renderOiHistory(FutOiData, selectedStock);
    renderOiHistoryChart(FutOiData, selectedStock);
    makeFutOiAndAvgPlot(selectedStock, FutOiAbs);

    Object.keys(Nifty500IndustryJson).forEach(stock => {
        //uniqueIndustryList = [...new Set([...uniqueIndustryList, Nifty500IndustryJson[stock]])];
        if (stock === selectedStock)
        {
            //console.log('The industry : ', Nifty500IndustryJson[selectedStock]);
            let industry = Nifty500IndustryJson[selectedStock];  // <-- you can change/set this value dynamically

            // Encode industry safely for URL
            let encodedIndustry = encodeURIComponent(industry);

            // Update the href of the link
            document.getElementById("industryLink").href = 
                `../4_FutOiHistoty/FutOiHistoty.html?industry=${encodedIndustry}`;
                    }
    });
}






let ivChartInstance = null; // store chart instance globally

function makeIVandIVPPlot(selectedStock, IvFutData) {
    const labels = [];
    const ivValues = [];
    const ivpValues = [];

    // Sort dates to ensure chronological order
    const sortedDates = Object.keys(IvFutData).sort((a, b) => new Date(a) - new Date(b));

    // Calculate IV for each date
    sortedDates.forEach(date => {
        const stockData = IvFutData[date][selectedStock];
        if (stockData) {
            const ceIv = stockData.AtmCeIv;
            const peIv = stockData.AtmPeIv;

            let iv = null;
            if (ceIv && peIv) {
                iv = (ceIv + peIv) / 2;
            } else if (ceIv) {
                iv = ceIv;
            } else if (peIv) {
                iv = peIv;
            } else {
                iv = 0;
            }

            if (iv !== null && iv !== 0) {
                labels.push(date);
                ivValues.push(iv);
            }
        }
    });

    // Calculate IVP only for dates with full 2-month history
    labels.forEach((date, idx) => {
        const currentDate = new Date(date);
        const twoMonthsAgo = new Date(currentDate);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        // Collect IVs in the last 2 months (including current)
        const windowIVs = [];
        labels.forEach((d, i) => {
            const dDate = new Date(d);
            if (dDate >= twoMonthsAgo && dDate <= currentDate) {
                windowIVs.push(ivValues[i]);
            }
        });

        // Only calculate if window covers full 2 months
        const earliestInWindow = new Date(labels[0]);
        if (twoMonthsAgo >= earliestInWindow && windowIVs.length > 0) {
            const currentIV = ivValues[idx];
            const belowOrEqual = windowIVs.filter(v => v <= currentIV).length;
            const percentile = (belowOrEqual / windowIVs.length) * 100;
            ivpValues.push(percentile);
        } else {
            ivpValues.push(null); // leave gap in chart
        }
    });

    // Destroy old chart if exists
    if (ivChartInstance) {
        ivChartInstance.destroy();
    }

    // Create chart
    const ctx = document.getElementById('ivChart').getContext('2d');
    ivChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `IV for ${selectedStock}`,
                    data: ivValues,
                    borderColor: 'blue',
                    yAxisID: 'y',
                    fill: true,
                },
                {
                    label: `IVP (2 months) for ${selectedStock}`,
                    data: ivpValues,
                    borderColor: 'red',
                    yAxisID: 'y1',
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'IV'
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'IVP (%)'
                    },
                    ticks: {
                        callback: val => val.toFixed(0) + '%'
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}



let oiHistoryChartInstance = null; // store chart globally


function renderOiHistoryChart(FutOiData, selectedStock) {
    const today = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);

    const labels = [];
    const values = [];
    const colors = [];
    //const positionShift = []

    Object.keys(FutOiData).forEach(date => {
        const [day, month, year] = date.split("-").map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (dateObj < twoMonthsAgo) return;

        if (FutOiData[date][selectedStock]) {
            let FutOiCngList = [];
            Object.keys(FutOiData).forEach(DATE => {
                if (FutOiData[DATE][selectedStock]) {
                    FutOiCngList.push(Math.abs(FutOiData[DATE][selectedStock].FutOiPer));
                }
            });

            let DivHeight = FutOiData[date][selectedStock].FutOiPer;
            let AbsDivHeight = (
                Math.abs(Math.log10(1 + Math.abs(DivHeight))) /
                Math.log10(1 + Math.max(...FutOiCngList))
            ) * 50; // in natural log --> log(1+x)

            let positionType = FutOiData[date][selectedStock].Fut_category;
            let pricecng = FutOiData[date][selectedStock].PriceCng;

            let colo;
            if (positionType === "Long Buildup") colo = "green";
            else if (positionType === "Short Covering") colo = "#ffff66";
            else if (positionType === "Short Buildup") { colo = "red"; DivHeight = -DivHeight;}
            else {colo = "#3366ff"; DivHeight = -DivHeight;}

            labels.push(date);
            values.push(DivHeight); // actual percentage change
            colors.push(colo);
            //positionShift.push(positionType);
        }
    });

    const ctx = document.getElementById("oiHistoryChart").getContext("2d");

    // Destroy old chart if it exists
    if (oiHistoryChartInstance) {
        oiHistoryChartInstance.destroy();
    }

    // Create new chart
    oiHistoryChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Fut OI Cng(%) : `,
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `Position Shift ${selectedStock}`
                //     font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: "#ccc" },
                    // Draw horizontal line at 0
                    afterDataLimits: (scale) => {
                        scale.min = Math.min(scale.min, 0);
                        scale.max = Math.max(scale.max, 0);
                    }
                },
                x: {
                    grid: { display: true }
                }
            }
        }
    });
}



let futOiChartInstance = null; // store chart instance globally

function makeFutOiAndAvgPlot(selectedStock, FutOiAbs) {
    const labels = [];
    const futOiValues = [];
    const avgValues = [];

    // Sort dates chronologically
    const sortedDates = Object.keys(FutOiAbs).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(date => {
        const stockData = FutOiAbs[date][selectedStock];
        if (stockData && stockData.FutOI) {
            labels.push(date);
            futOiValues.push(stockData.FutOI);
        } else {
            labels.push(date);
            futOiValues.push(null);
        }
    });

    // Calculate rolling average (last 10 periods)
    // Calculate rolling average (last 10 periods)
    futOiValues.forEach((val, idx) => {
        if (val !== null) {
            const start = Math.max(0, idx - 9); // last 10 including current
            const window = futOiValues.slice(start, idx + 1).filter(v => v !== null);

            if (window.length === 10) {   // ✅ only calculate if we have full 10 values
                const avg = window.reduce((a, b) => a + b, 0) / 10;
                avgValues.push(avg);
            } else {
                avgValues.push(null); // not enough data, leave a gap
            }
        } else {
            avgValues.push(null);
        }
    });


    // Destroy old chart if exists
    if (futOiChartInstance) {
        futOiChartInstance.destroy();
    }

    // Create chart
    const ctx = document.getElementById('futOiChart').getContext('2d');
    futOiChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: `Fut OI for ${selectedStock}`,
                    data: futOiValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    yAxisID: 'y',
                },
                {
                    type: 'line',
                    label: `10-period Avg Fut OI`,
                    data: avgValues,
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Fut OI'
                    },
                    ticks: {
                        callback: function (value) {
                          return (value / 1_000_000).toFixed(1) + 'M';
                        }
                      }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}



// Example call:
// renderOiHistory(data, "TATAMOTORS");

