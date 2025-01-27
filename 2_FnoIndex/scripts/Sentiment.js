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



function GetSentiment(data) {
	const indices = [ 'NIFTY', 'BANKNIFTY', 'SENSEX', 'BANKEX' ];
	const num = ['1', '2']
	// NIFTY
	indices.forEach( index => {
		num.forEach( n => {
			const bar = document.getElementById(index+'-'+n);
				bar.style.borderRadius = '5px';
			if (n=='1') 
			{
				const barHeight = data[index].OptionData.BullishFactor * 150; // Random height (max 150px)
				bar.style.height = barHeight + 'px';
				bar.style.backgroundColor = '#28a745'; //'#7ef1a1';
				//bar.style.borderRadius = '5px';
				labelText = data[index].OptionData.BullishFactor.toFixed(2);
			};
			if (n=='2')
			{
				const barHeight = data[index].OptionData.BearishFactor * 150; // Random height (max 150px)
				bar.style.height = barHeight + 'px';
				bar.style.backgroundColor = '#dc3545' // '#f18a73';
				//bar.style.borderRadius = '5px';
				labelText = data[index].OptionData.BearishFactor.toFixed(2);
			};

			///// add label on the bar
			bar.textContent = '';
			const label = document.createElement('span');
			label.textContent = labelText;
			label.style.position = 'absolute';
			label.style.top = '30%';
			label.style.left = '50%';
			label.style.transform = 'translateX(-50%)';
			label.style.color = 'black'; // Adjust color for visibility
			label.style.fontSize = '12px';
			label.style.fontWeight = 'bold';

			bar.style.position = 'relative'; // Ensure bar is positioned for the label
            		bar.appendChild(label);
		});
		
	});



	}
