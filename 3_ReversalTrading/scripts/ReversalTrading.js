

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






function Reversaltrading(data) {
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
                
                console.log(ReversalType);

                var ReversalTypeID = document.getElementById(ReversalType);
                ReversalTypeID.addEventListener('change', () => {
                        var ReversalTypeIDValue = ReversalTypeID.value.split(',').map(Number);
                        //console.log(ReversalTypeIDValue);

                        /// Prepare the table
                        const table = document.getElementById('ReversalTradingTable');
                        const tbody = table.querySelector('tbody');
                        tbody.innerHTML = ''; // Clear previous rows

                        Object.keys(data).forEach(key => {
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
                        
                                        console.log(OiSupportWidth);
                                        row.innerHTML = `
                                        <td>${key}</td>
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
                                        <td>${currentPrice}</td>
                                        <td>${ResistanceFromLtp}</td>
                                        <td>${SupportFromLtp}</td>
                                        `;
                        
                                        tbody.appendChild(row);
                                }

                                });
                                table.style.display = 'table';


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
