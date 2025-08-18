function ScriptData(IvFutData, FutOiData, Nifty500IndustryJson, FutOiAbs)
{
    populateDropdown(IvFutData);

    ScriptFilter.addEventListener('change', () => {
        const ScriptFilter = document.getElementById('ScriptFilter');
        let selectedStock = ScriptFilter.value;
        
        if (selectedStock === '')
        {
            const DataDiv = document.querySelector('.DataDiv');
            DataDiv.style.display = "none";
        }
        else
        {
            makeScriptDataPlot(selectedStock, IvFutData, FutOiData, Nifty500IndustryJson, FutOiAbs);

            const DataDiv = document.querySelector('.DataDiv');
            DataDiv.style.display = "inline-block";
        }
        
    });

    //  Handle preselection from URL
    const urlParams = new URLSearchParams(window.location.search);
    const Stock = urlParams.get("STOCK");
    if (Stock) {
        ScriptFilter.value = Stock;
        ScriptFilter.dispatchEvent(new Event("change")); // fire automatically
        }

    
}


function populateDropdown(IvFutData)
{
    ////////////////// Find Unique stocks  //////////////////////////
    let uniqueStockList = [];
    Object.keys(IvFutData).forEach(date => {
        Object.keys(IvFutData[date]).forEach(stock => {
            uniqueStockList = [...new Set([...uniqueStockList, stock])];
        });
    });

    ///////////// populate the dropdown /////////////
    const ScriptlFilter = document.getElementById('ScriptFilter');
    ScriptlFilter.replaceChildren(); // Removes all exiting options
    const option1 = document.createElement('option'); option1.value = '';  option1.textContent = '-- Script --'; ScriptlFilter.appendChild(option1);
    for (let i=0; i < uniqueStockList.length; i++)
    {
            const option1 = document.createElement('option');
            option1.value = uniqueStockList[i]; option1.textContent = uniqueStockList[i]; ScriptlFilter.appendChild(option1);
    }
}




function makeScriptDataPlot(selectedStock, IvFutData, FutOiData, Nifty500IndustryJson, FutOiAbs)
{
    basisChartplot(selectedStock, IvFutData);
    makeIVandIVPPlot(selectedStock, IvFutData);
    renderOiHistoryChart(FutOiData, selectedStock);
    makeFutOiAndAvgPlot(selectedStock, FutOiAbs);

    // See the Industry Fut OI History of the selected stock
    Object.keys(Nifty500IndustryJson).forEach(stock => {
        if (stock === selectedStock)
        {
            console.log('The industry : ', Nifty500IndustryJson[selectedStock]);
            let industry = Nifty500IndustryJson[selectedStock];  

            let encodedIndustry = encodeURIComponent(industry);

            document.getElementById("industryLink").href = 
                `../4_FutOiHistoty/FutOiHistoty.html?industry=${encodedIndustry}`;
                    }
    });
}




let basisChartInstance = null; // global variable

function basisChartplot(selectedStock, IvFutData)
{
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

