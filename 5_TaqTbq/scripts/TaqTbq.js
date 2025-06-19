function MakeTable(stockData)
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


    const TbqTaqFliter = document.getElementById('tbqTaq');
    TbqTaqFliter.replaceChildren(); // Removes all exiting options
    const option1 = document.createElement('option'); option1.value = '';  option1.textContent = '-- TBQ/TAQ --'; TbqTaqFliter.appendChild(option1);
    let TbqTaqStr = ["> 2", " > 4", "> 6", "< 0.5", "< 0.25", "< 0.16"];
    let TbqTaqValues = [2, 4, 6, 0.5, 0.25, 0.16];
    for (let i=0; i < TbqTaqStr.length; i++)
    {
            const option1 = document.createElement('option');
            option1.value = TbqTaqValues[i]; option1.textContent = TbqTaqStr[i]; TbqTaqFliter.appendChild(option1);
    }


    const filterTbqTaq = document.getElementById('tbqTaq');

    // Add Events Lisntener to the filter
    filterTbqTaq.addEventListener('change', function () {


        //const table = document.getElementById('stockTable');
        const tableBody = document.querySelector("#stockTable tbody");
        //const tbody = table.querySelector('tbody');
        tableBody.innerHTML = ''; // Clear previous rows

        if (filterTbqTaq.value === '') {
            // If no filter is selected, return
            //tableBody.innerHTML = '<tr><td colspan="3">Please select a TBQ/TAQ ratio to filter.</td></tr>';
            return;

        }
        const selectedValue = parseFloat(filterTbqTaq.value);

        

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


            //console.log(typeof selectedValue);
            // Filter based on selected TBQ/TAQ ratio
            const lastRatio = ratio[ratio.length - 1];
            //console.log(`Symbol: ${symbol}, lastRatio: ${lastRatio}`);
            if (selectedValue > 1 && lastRatio <= selectedValue) {
                return;
            } else if (selectedValue < 1 && lastRatio >= selectedValue) {
                return;
            }



            // Create row and cells
            const row = document.createElement("tr");

            const symbolCell = document.createElement("td");
            symbolCell.textContent = symbol;
            row.appendChild(symbolCell);

            const ltpCell = document.createElement("td");
            ltpCell.textContent = ltp[ltp.length - 1]; // Last ltp value
            row.appendChild(ltpCell);

            const ltpCngCell = document.createElement("td");
            ltpCngCell.textContent = ltpCng[ltpCng.length - 1]; // Last ltp Cng value
            row.appendChild(ltpCngCell);

            const ratioCell = document.createElement("td");
            ratioCell.textContent = ratio[ratio.length - 1]; // Last ratio value
            row.appendChild(ratioCell);

            const chartCell = document.createElement("td");
            const canvas = document.createElement("canvas");
            canvas.id = `chart-${index}`;
            chartCell.appendChild(canvas);
            row.appendChild(chartCell);

            tableBody.appendChild(row);

            
            canvas.width = 1500;   // 100% of td width
            canvas.height = 300;

            const formattedTimes = times.map(t => t.split(' ')[1].slice(0, 5)); // to show only HH:MM

            // Plot chart using Chart.js
            new Chart(canvas, {
                data: {
                    labels: formattedTimes,
                    datasets: [
                        {
                            type: 'line',
                            label: 'Buy Qty',
                            data: buyQty,
                            borderColor: 'green',
                            yAxisID: 'y1',
                            fill: false,
                            tension: 1,
                            pointRadius: 2.5,
                            borderWidth: 1.8,
                            // spanGaps: false
                        },
                        {
                            type: 'line',
                            label: 'Sell Qty',
                            data: sellQty,
                            borderColor: 'red',
                            yAxisID: 'y1',
                            fill: false,
                            tension: 1,
                            pointRadius: 2.5,
                            borderWidth: 1.8,
                            // spanGaps: false
                        },
                        {
                            type: 'bar',
                            label: 'TBQ/TAQ Ratio',
                            data: ratio,
                            backgroundColor: '#b3b3ff',
                            yAxisID: 'y2'
                            // barPercentage: 0.6,
                            // categoryPercentage: 0.6
                        }
                    ]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y1: {
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Buy/Sell Quantity'
                            }
                        },
                        y2: {
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            title: {
                                display: true,
                                text: 'TBQ/TAQ Ratio'
                            },
                            suggestedMin: 0,
                            suggestedMax: 2
                        }
                    }
                }
            });


        });

        //tableBody.style.display = 'table';
    });





}

