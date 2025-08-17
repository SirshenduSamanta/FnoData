function renderFutOiHistory(data, uniqueStockList, Nifty500IndustryJson) {
    const table = document.getElementById('FutOiHistory');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Clear previous rows

    const selectedValue = IndustrylFilter.value;

    uniqueStockList.forEach(stock => {
        let StockIndustry = "";
        try {
            StockIndustry = Nifty500IndustryJson[stock];
        } catch (err) {
            console.log(`Industry error for : ${stock}`);
        }

        if (selectedValue === '' || StockIndustry === selectedValue) {
            ////// make the table
            const row = document.createElement('tr');
            let rowContent = `
                <td>
                    <div style="font-size:18px; font-weight: 300; background-color : #e8eaed">
                        ${stock}
                    </div>
                </td>
                <td style="width: 50px;">${StockIndustry}</td>
                <td>
                    <div class="TableOiHistory">
            `;

            Object.keys(data).forEach(date => {
                // Convert "DD-MM-YYYY" to Date object
                const [day, month, year] = date.split("-").map(Number);
                const dateObj = new Date(year, month - 1, day);

                // Calculate 2 months ago from today
                const twoMonthsAgo = new Date();
                twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

                if (dateObj < twoMonthsAgo) {
                    return; // Skip if older than 2 months
                }

                if (data[date][stock]) {
                    let FutOiCngList = [];
                    Object.keys(data).forEach(DATE => {
                        if (data[DATE][stock]) {
                            FutOiCngList.push(Math.abs(data[DATE][stock].FutOiPer));
                        }
                    });

                    let colo = "red";
                    let DivHeight = data[date][stock].FutOiPer;
                    let AbsDivHeight = (
                        Math.abs(Math.log10(1 + Math.abs(DivHeight))) /
                        Math.log10(1 + Math.max(...FutOiCngList))
                    ) * 50;

                    let positionType = data[date][stock].Fut_category;
                    let pricecng = data[date][stock].PriceCng;

                    if (positionType === "Long Buildup") {
                        colo = "green";
                    } else if (positionType === "Short Covering") {
                        colo = "#ffff66";
                    } else if (positionType === "Short Buildup") {
                        colo = "red";
                    } else {
                        colo = "#3366ff";
                    }

                    let translateY = (colo === "green" || colo === '#ffff66')
                        ? -AbsDivHeight / 2
                        : AbsDivHeight / 2;

                    rowContent += `
                        <div class="TableOiHistoryDiv" 
                            style="
                                background-color: ${colo}; 
                                height: ${AbsDivHeight}px;
                                bottom: 50%; 
                                transform: translateY(${translateY}px);
                            "
                            onmouseover="showTooltip(event, '${date}', '${pricecng.toFixed(2)}%', '${positionType}', '${DivHeight.toFixed(2)}%')"
                            onmouseout="hideTooltip()">
                        </div>
                    `;
                }
            });

            rowContent += `</div></td>`;
            row.innerHTML = rowContent;
            tbody.appendChild(row);
        }
    });

    table.style.display = 'table';
}



function MakeTable(data, Nifty500IndustryJson)
{

    ////////////////// Find Unique stocks length  //////////////////////////
    let uniqueStockList = [];
    Object.keys(data).forEach(date => {
        //console.log(Object.keys(data[date]));

        Object.keys(data[date]).forEach(stock => {
            uniqueStockList = [...new Set([...uniqueStockList, stock])];
        });
        
    });

    ////////////////// Find Unique Industry and populate in the Industry Filter  //////////////////////////
    let uniqueIndustryList = [];
    Object.keys(Nifty500IndustryJson).forEach(stock => {
        uniqueIndustryList = [...new Set([...uniqueIndustryList, Nifty500IndustryJson[stock]])];
    });

    // console.log(uniqueIndustryList);

    const IndustrylFilter = document.getElementById('IndustrylFilter');
    IndustrylFilter.replaceChildren(); // Removes all exiting options
    const option1 = document.createElement('option'); option1.value = '';  option1.textContent = '-- Industry --'; IndustrylFilter.appendChild(option1);
    //let FutPosition = ["Long Buildup", "Short Covering", "Short Buildup", "Long Unwinding", "No Change"];
    for (let i=0; i < uniqueIndustryList.length; i++)
    {
            const option1 = document.createElement('option');
            option1.value = uniqueIndustryList[i]; option1.textContent = uniqueIndustryList[i]; IndustrylFilter.appendChild(option1);
    }



    const filterIndustry = document.getElementById('IndustrylFilter');
    
    // Attach event listener
    //IndustrylFilter.addEventListener('change', renderFutOiHistory);
    IndustrylFilter.addEventListener('change', (event) => {
    		renderFutOiHistory(data, uniqueStockList, Nifty500IndustryJson);
	});


    //  Handle preselection from URL
    const urlParams = new URLSearchParams(window.location.search);
    const industry = urlParams.get("industry");
    if (industry) {
        IndustrylFilter.value = industry;
        IndustrylFilter.dispatchEvent(new Event("change")); // fire automatically
        }

 
    
    
}



// Create tooltip div
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
document.body.appendChild(tooltip);

// Show tooltip on hover
function showTooltip(event, date, pricecng, position, FutOiCng) {
    tooltip.innerHTML = `Date: ${date}<br>
                        PriceCng: ${pricecng}<br>
                        FutOiCng: ${FutOiCng}<br>
                        PositionShifting: ${position}
                        `;

    tooltip.style.display = "block";
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
}

// Hide tooltip when mouse leaves
function hideTooltip() {
    tooltip.style.display = "none";
}
