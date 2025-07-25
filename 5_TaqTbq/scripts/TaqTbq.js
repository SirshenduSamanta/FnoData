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

function MakeTable()
{
    // Object.keys(data).forEach(stock => {
    //     Object.keys(data[stock]).forEach(time => {
    //         console.log(`Stock: ${stock}, Time: ${time}, Price: ${data[stock][time].ltp}`);
    //     });
        
    // });

    //     const stockData = {
    //     "NSE:360ONE-EQ": {
    //         "2025-06-18 15:14:00": {
    //             "ltp": 1116.55,
    //             "chp": -2.5868,
    //             "tot_buy_qty": 35696.0,
    //             "tot_sell_qty": 45486.0
    //         },
    //         "2025-06-18 15:15:00": {
    //             "ltp": 1118.75,
    //             "chp": -2.3949,
    //             "tot_buy_qty": 35652.0,
    //             "tot_sell_qty": 43409.0
    //         },
    //         "2025-06-18 15:16:00": {
    //             "ltp": 1117.95,
    //             "chp": -2.4647,
    //             "tot_buy_qty": 33999.0,
    //             "tot_sell_qty": 43581.0
    //         }
    //     },
    //     "NSE:3MINDIA-EQ": {
    //         "2025-06-18 15:14:00": {
    //             "ltp": 29275.0,
    //             "chp": 1.0528,
    //             "tot_buy_qty": 823.0,
    //             "tot_sell_qty": 1008.0
    //         },
    //         "2025-06-18 15:15:00": {
    //             "ltp": 29280.0,
    //             "chp": 1.0611,
    //             "tot_buy_qty": 801.0,
    //             "tot_sell_qty": 999.0
    //         },
    //         "2025-06-18 15:16:00": {
    //             "ltp": 29290.0,
    //             "chp": 1.0800,
    //             "tot_buy_qty": 850.0,
    //             "tot_sell_qty": 950.0
    //         }
    //     }
    // };


    PopulateDropDown();
    applyFilter(); // Initial call to populate the table with all data
    const filters = document.querySelectorAll('.filter');
    // Attach event listener to each filter
    filters.forEach(filter => {
        filter.addEventListener('change', applyFilter);
    });



    // Add Events Lisntener to the filter
    //filterTbqTaq.addEventListener('change', function () {

        //tableBody.style.display = 'table';
    //});

}


function applyFilter()
{
    const filterTbqTaq = document.getElementById('tbqTaq');
    const filterVolAvg3dVol = document.getElementById('vol_Avg3dVol');

    // load the data
    //(async function() {
    //    stockData = await loadJSON("../market_data.json");
     //   volData = await loadJSON("../VolDetailLast3d.json");

    //console.log("COme to herrrrrrrrrrrr");
    //console.log(Object.keys(volData));

    //const table = document.getElementById('stockTable');
    const tableBody = document.querySelector("#stockTable tbody");
    //const tbody = table.querySelector('tbody');
    tableBody.innerHTML = ''; // Clear previous rows

    if (filterTbqTaq.value === '' && filterVolAvg3dVol.value === '') {
        // If no filter is selected, return
        //tableBody.innerHTML = '<tr><td colspan="3">Please select a TBQ/TAQ ratio to filter.</td></tr>';
        return;
    }

    const TbqTaqValue = parseFloat(filterTbqTaq.value);
    const volAvg3dVolValue = parseFloat(filterVolAvg3dVol.value);


    Object.entries(stockData).forEach(([symbol, timeData], index) => {

            // Prepare data for plotting
            const times = Object.keys(timeData);
            const buyQty = times.map(t => timeData[t].tot_buy_qty);
            const sellQty = times.map(t => timeData[t].tot_sell_qty);

            const ratio = times.map(t => {
                const sell = timeData[t].tot_sell_qty || 1;
                return (timeData[t].tot_buy_qty / sell).toFixed(2);
            });

            const ltp = times.map(t => {
                return timeData[t].ltp;
            });

            const ltpCng = times.map(t => {
                return (timeData[t].chp).toFixed(2);
            });

            const vol_traded_today = times.map(t => {
                return (timeData[t].vol_traded_today);
            });

            const volRatio = (vol_traded_today[vol_traded_today.length - 1] / volData[symbol].Last3dAvgVol || 0).toFixed(2);
            //console.log(volData[symbol]);
            //console.log(typeof selectedValue);
            // Filter based on selected TBQ/TAQ ratio
            const lastRatio = ratio[ratio.length - 1];
            //console.log(`Symbol: ${symbol}, lastRatio: ${lastRatio}`);
            if (TbqTaqValue > 1 && lastRatio <= TbqTaqValue) {
                return;
            } else if (TbqTaqValue < 1 && lastRatio >= Math.abs(TbqTaqValue)) {
                return;
            } else if (volAvg3dVolValue >= 0 && volRatio < volAvg3dVolValue) {
                return;
            }



            // Create row and cells
            const row = document.createElement("tr");

            const symbolCell = document.createElement("td");
            symbolCell.textContent = symbol;
            row.appendChild(symbolCell);

            const PreDayVolCell = document.createElement("td");
            PreDayVolCell.textContent = volData[symbol] ? volData[symbol].LastDayVol : 'N/A'; // Pre Day Vol
            row.appendChild(PreDayVolCell);

            const Pre30mVolCell = document.createElement("td");
            Pre30mVolCell.textContent = volData[symbol] ? volData[symbol].LastDaylast30minVol : 'N/A'; // Pre 30m Vol
            row.appendChild(Pre30mVolCell);

            const VolTodayCell = document.createElement("td");
            VolTodayCell.textContent = vol_traded_today[vol_traded_today.length - 1]; // Last Vol Today value
            row.appendChild(VolTodayCell);

            const VolTodaypreCell = document.createElement("td");
            VolTodaypreCell.textContent = volRatio; // Last Vol Today value
            row.appendChild(VolTodaypreCell);

            //const ltpCell = document.createElement("td");
            //ltpCell.textContent = ltp[ltp.length - 1]; // Last ltp value
            //row.appendChild(ltpCell);

            const ratioCell = document.createElement("td");
            ratioCell.textContent = ratio[ratio.length - 1]; // Last ratio value
            row.appendChild(ratioCell);

            const ltpCngCell = document.createElement("td");
            ltpCngCell.textContent = ltpCng[ltpCng.length - 1]; // Last ltp Cng value
            row.appendChild(ltpCngCell);

            const TBQCell = document.createElement("td");
            TBQCell.textContent = buyQty[buyQty.length - 1]; // Last buyQty value
            row.appendChild(TBQCell);

            const TAQCell = document.createElement("td");
            TAQCell.textContent = sellQty[sellQty.length - 1]; // Last sellQty value
            row.appendChild(TAQCell);

            

            

            // const chartCell = document.createElement("td");
            // const canvas = document.createElement("canvas");
            // canvas.id = `chart-${index}`;
            // chartCell.appendChild(canvas);
            // row.appendChild(chartCell);

            // tableBody.appendChild(row);


            // canvas.width = 1070;   // 100% of td width
            // canvas.height = 300;

            // const formattedTimes = times.map(t => t.split(' ')[1].slice(0, 5)); // to show only HH:MM

            // // Plot chart using Chart.js
            // new Chart(canvas, {
            //     data: {
            //         labels: formattedTimes,
            //         datasets: [
            //             {
            //                 type: 'line',
            //                 label: 'Buy Qty',
            //                 data: buyQty,
            //                 borderColor: 'green',
            //                 yAxisID: 'y1',
            //                 fill: false,
            //                 tension: 1,
            //                 pointRadius: 2.5,
            //                 borderWidth: 1.8,
            //                 // spanGaps: false
            //             },
            //             {
            //                 type: 'line',
            //                 label: 'Sell Qty',
            //                 data: sellQty,
            //                 borderColor: 'red',
            //                 yAxisID: 'y1',
            //                 fill: false,
            //                 tension: 1,
            //                 pointRadius: 2.5,
            //                 borderWidth: 1.8,
            //                 // spanGaps: false
            //             },
            //             {
            //                 type: 'bar',
            //                 label: 'TBQ/TAQ Ratio',
            //                 data: ratio,
            //                 backgroundColor: '#b3b3ff',
            //                 yAxisID: 'y2'
            //                 // barPercentage: 0.6,
            //                 // categoryPercentage: 0.6
            //             }
            //         ]
            //     },
            //     options: {
            //         responsive: false,
            //         maintainAspectRatio: false,
            //         plugins: {
            //             legend: {
            //                 position: 'top'
            //             },
            //             tooltip: {
            //                 mode: 'index',
            //                 intersect: false
            //             }
            //         },
            //         scales: {
            //             x: {
            //                 title: {
            //                     display: true,
            //                     text: 'Time'
            //                 }
            //             },
            //             y1: {
            //                 position: 'left',
            //                 title: {
            //                     display: true,
            //                     text: 'Buy/Sell Quantity'
            //                 }
            //             },
            //             y2: {
            //                 position: 'right',
            //                 grid: { drawOnChartArea: false },
            //                 title: {
            //                     display: true,
            //                     text: 'TBQ/TAQ Ratio'
            //                 },
            //                 suggestedMin: 0,
            //                 suggestedMax: 2
            //             }
            //         }
            //     }
            // });


        });

    //});
}



function PopulateDropDown()
{
    // Tbq/TAQ Filter
    const TbqTaqFliter = document.getElementById('tbqTaq');
    TbqTaqFliter.replaceChildren(); // Removes all exiting options
    //const option1 = document.createElement('option'); option1.value = '';  option1.textContent = '-- TBQ/TAQ --'; TbqTaqFliter.appendChild(option1);
    let TbqTaqStr = ["> 1", " < 1"];
    let TbqTaqValues = [1, -1];
    for (let i=0; i < TbqTaqStr.length; i++)
    {
            const option1 = document.createElement('option');
            option1.value = TbqTaqValues[i]; option1.textContent = TbqTaqStr[i]; TbqTaqFliter.appendChild(option1);
    }

    // Vol / Avg3dVol Filter
    // const VolAvg3dVolFilter = document.getElementById('vol_Avg3dVol');
    // VolAvg3dVolFilter.replaceChildren(); // Removes all exiting options
    // const option2 = document.createElement('option'); option2.value = '';  option2.textContent = '-- Vol / Avg3dVol --'; VolAvg3dVolFilter.appendChild(option2);
    // let VolAvg3dVolStr = ["> 2", " > 4", "> 6", "< 0.5", "< 0.25", "< 0.16"];
    // let VolAvg3dVolValues = [2, 4, 6, 0.5, 0.25, 0.16];
    // for (let i=0; i < VolAvg3dVolStr.length; i++)
    // {
    //         const option2 = document.createElement('option');
    //         option2.value = VolAvg3dVolValues[i]; option2.textContent = VolAvg3dVolStr[i]; VolAvg3dVolFilter.appendChild(option2);
    // }

    // Vol / Avg3dVol Filter
    const VolAvg3dVolFilter = document.getElementById('vol_Avg3dVol');
    VolAvg3dVolFilter.replaceChildren(); // Removes all existing options

    // Add default option
    // const defaultOption = document.createElement('option');
    // defaultOption.value = '';
    // defaultOption.textContent = '-- Vol / Avg3dVol --';
    // VolAvg3dVolFilter.appendChild(defaultOption);

    // Get current time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();  // minutes since midnight

    // Define thresholds
    const minutes_915  = 9 * 60 + 15;
    const minutes_1015 = 10 * 60 + 15;
    const minutes_1100 = 11 * 60;
    const minutes_1130 = 11 * 60 + 30;
    const minutes_1230 = 12 * 60 + 30;
    const minutes_1330 = 13 * 60 + 30;
    const minutes_1430 = 14 * 60 + 30;

    // Default values
    let VolAvg3dVolValues = [0] //[2.5, 3, 5, 7, 10];

    // Time-based override
    // if (currentMinutes > minutes_1430) {
    //     VolAvg3dVolValues = [2.5, 3, 5, 7, 10];
    // } else if (currentMinutes > minutes_1330) {
    //     VolAvg3dVolValues = [2, 3, 5, 7, 10];
    // } else if (currentMinutes > minutes_1230) {
    //     VolAvg3dVolValues = [1.5, 2, 3, 5, 7, 10];
    // } else if (currentMinutes > minutes_1130) {
    //     VolAvg3dVolValues = [1, 2, 3, 5, 7, 10];
    // } else if (currentMinutes > minutes_1100) {
    //     VolAvg3dVolValues = [0.7, 1, 2, 3, 5, 7, 10];
    // } else if (currentMinutes > minutes_1015) {
    //     VolAvg3dVolValues = [0.5, 0.7, 1, 2, 3, 5, 7, 10];
    // } else if (currentMinutes > minutes_915) {
    //     VolAvg3dVolValues = [0.3, 0.5, 1, 2, 3, 5, 7, 10];
    // }

    // Construct corresponding display strings
    let VolAvg3dVolStr = [">= 0"] //VolAvg3dVolValues.map(v => `> ${v}`);
    // Populate select options
    for (let i = 0; i < VolAvg3dVolStr.length; i++) {
        const option = document.createElement('option');
        option.value = VolAvg3dVolValues[i];
        option.textContent = VolAvg3dVolStr[i];
        VolAvg3dVolFilter.appendChild(option);
    }

}


