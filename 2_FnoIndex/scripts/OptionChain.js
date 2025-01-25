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





function OptionChain(data) {

	// Populate dropdown after fetching data
        const stockSelect = document.getElementById('stock-select');
	stockSelect.replaceChildren(); // Removes all existing options
        const option = document.createElement('option'); option.textContent = '--Select a Stock--'; stockSelect.appendChild(option);
        Object.keys(data).forEach(stock => { const option = document.createElement('option'); option.value = stock; option.textContent = stock; stockSelect.appendChild(option); }); // <option value="AAPL">AAPL</option>




	// Event linstner
	stockSelect.addEventListener('change', () => {
          const selectedStock = stockSelect.value;

	  /////////////////////////////// show PCR value
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
          //const VolTimes = document.getElementById('VolTimes');
          //VolTimes.style.display = "inline";
          //VolTimes.textContent = "VolTimes: " + data[selectedStock].PriceVol.VolTimes;

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

	  const table = document.getElementById('option-chain');
          const tbody = table.querySelector('tbody');
	  tbody.innerHTML = ''; // Clear previous rows

	//const CE_CategoryWeight = [];
        //const PE_CategoryWeight = [];

	if (selectedStock && data[selectedStock]) {
            const stockData = data[selectedStock];
            const strikes = Object.keys(stockData.OptionData.OptChain.oiCe);
            const strikeThreshold = stockData.PriceVol.CurrentPrice; // Define the threshold for CE & PE coloring

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


		row.innerHTML = `

                <td class="${highlightClassCE} ${boldClassMaxCE}">${stockData.OptionData.OptChain.oiCe[strike]}</td>
                <td class="${highlightClassCE} ${oiCeCngClass} ${boldClassMaxCE}">${stockData.OptionData.OptChain.oichpCe[strike]}</td>
                <td class="${highlightClassCE} ${boldClassMaxCE}">${stockData.OptionData.OptChain.ltpCe[strike]}</td>
                <td class="${highlightClassCE} ${ltpcecng} ${boldClassMaxCE}">${stockData.OptionData.OptChain.ltpchpCe[strike]}</td>
                <td class="${highlightClassCE} ${boldClassMaxCE}" style="background-color: ${CePositionColor};">${stockData.OptionData.OptChain.CE_Category[strike]}</td>
		
		<td class="${boldClassMaxCE} ${boldClassMaxPE} ${StrikeColumnColor}">${strike}</td>
		                
                <td class="${highlightClassPE} ${boldClassMaxPE}" style="background-color: ${PePositionColor};">${stockData.OptionData.OptChain.PE_Category[strike]}</td>
		<td class="${highlightClassPE} ${ltppecng} ${boldClassMaxPE}">${stockData.OptionData.OptChain.ltpchpPe[strike]}</td>
		<td class="${highlightClassPE} ${boldClassMaxPE}">${stockData.OptionData.OptChain.ltpPe[strike]}</td>
                <td class="${highlightClassPE} ${oiPeCngClass} ${boldClassMaxPE}">${stockData.OptionData.OptChain.oichpPe[strike]}</td>
		<td class="${highlightClassPE} ${boldClassMaxPE}">${stockData.OptionData.OptChain.oiPe[strike]}</td>
                
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
	}); // Evt listener ends here




	}
