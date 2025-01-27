function OptionChain(data) {

	 //fut-vol
	const FutVol = document.getElementById('fut-vol');
	const optionFutVol = document.createElement('option'); optionFutVol.value='show'; optionFutVol.textContent = 'show'; FutVol.appendChild(optionFutVol);

	FutVol.addEventListener('change', () => {
		const Selval = optionFutVol.value;

		const tableFutVol = document.getElementById("fut-vol-table");
		const tbodyFutVol = tableFutVol.querySelector('tbody');
		tbodyFutVol.innerHTML = ''; // Clear previous rows
		if (Selval == 'show')
		{
			Object.keys(data).forEach(stock => {
				const rowFutVol = document.createElement('tr');
				
				const futOicng = data[stock].FutData.FutCng < 0  ? 'negative' : 'positive';
				const Pricecng = data[stock].PriceData.PriceCng < 0  ? 'negative' : 'positive';

				rowFutVol.innerHTML=`
				<td>${stock}</td>
				<td class="${futOicng}">${data[stock].FutData.FutCng}</td>
				<td>${data[stock].VolTimes}</td>
				<td class="${Pricecng}">${data[stock].PriceData.PriceCng}</td>
				<td>${data[stock].FutData.Fut}</td>
				`;

			tbodyFutVol.appendChild(rowFutVol);
		});
			tableFutVol.style.display = 'table';
		} else {
			tableFutVol.style.display = 'none';
		}
	});


        // Add event listener to handle stock selection
        stockSelect.addEventListener('change', () => {
          const selectedStock = stockSelect.value;

          const table2 = document.getElementById('Fut-Price-Vol');
          const tbody2 = table2.querySelector('tbody');
          tbody2.innerHTML = ''; // Clear previous rows

          if (selectedStock && data[selectedStock]) {
            const stockData = data[selectedStock];

              const row2 = document.createElement('tr');
              const futCngClass = stockData.FutData.FutCng < 0 ? 'negative' : 'positive';
              const priceCngClass = stockData.PriceData.PriceCng < 0 ? 'negative' : 'positive';

              row2.innerHTML = `
                <td>${stockData.FutData.Fut}</td>
                <td class="${futCngClass}">${stockData.FutData.FutCng}</td>
		<td class="${priceCngClass}">${stockData.PriceData.PriceCng}</td>
                <td>${stockData.VolTimes}</td>
              `;
              tbody2.appendChild(row2);

            table2.style.display = 'table';
          } else {
            table2.style.display = 'none';
          }





        });

