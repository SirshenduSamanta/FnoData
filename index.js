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

  
    let Usram = '';
    let pAssdr = '';
    (async function() {
       data = await loadJSON('psswrd.json'); // Load the JSON data
                    if (data)
        {
          console.log("Coming HREEEEE");
          Usram = data.Username;
          pAssdr = data.psswrd;
          console.log("Username and password loaded.");
        }
    })();


function _0x34b3(){const _0x255f56=['580385fkGfDM','657uwpdYI','login-form','authenticated','238794yTbNjp','username','3265406pFVios','setItem','password','addEventListener','1objIJS','preventDefault','85983OjiBVj','7LfqnfV','getElementById','true','4903148UUDMcd','value','43336BtCNbY','submit','location','9292140vRfEQU','Invalid\x20username\x20or\x20password.','error-msg'];_0x34b3=function(){return _0x255f56;};return _0x34b3();}const _0xe26126=_0x344f;function _0x344f(_0x391650,_0x64549c){const _0x34b31b=_0x34b3();return _0x344f=function(_0x344f60,_0x15a230){_0x344f60=_0x344f60-0x8e;let _0x4ecd0f=_0x34b31b[_0x344f60];return _0x4ecd0f;},_0x344f(_0x391650,_0x64549c);}(function(_0x57336b,_0x5c0ff2){const _0x508439=_0x344f,_0x28bc02=_0x57336b();while(!![]){try{const _0x492961=parseInt(_0x508439(0x9d))/0x1*(-parseInt(_0x508439(0x99))/0x2)+parseInt(_0x508439(0x9f))/0x3+parseInt(_0x508439(0xa3))/0x4+-parseInt(_0x508439(0x93))/0x5+-parseInt(_0x508439(0x97))/0x6*(-parseInt(_0x508439(0xa0))/0x7)+-parseInt(_0x508439(0xa5))/0x8*(-parseInt(_0x508439(0x94))/0x9)+parseInt(_0x508439(0x90))/0xa;if(_0x492961===_0x5c0ff2)break;else _0x28bc02['push'](_0x28bc02['shift']());}catch(_0x1e7dc2){_0x28bc02['push'](_0x28bc02['shift']());}}}(_0x34b3,0xd46ea),document[_0xe26126(0xa1)](_0xe26126(0x95))[_0xe26126(0x9c)](_0xe26126(0x8e),function(_0x116f82){const _0x5b7353=_0xe26126;_0x116f82[_0x5b7353(0x9e)]();const _0x50634b=document[_0x5b7353(0xa1)](_0x5b7353(0x98))['value'],_0x5a0790=document[_0x5b7353(0xa1)](_0x5b7353(0x9b))[_0x5b7353(0xa4)];_0x50634b===Usram&&_0x5a0790===pAssdr?(sessionStorage[_0x5b7353(0x9a)](_0x5b7353(0x96),_0x5b7353(0xa2)),window[_0x5b7353(0x8f)]['href']='/protected.html'):document['getElementById'](_0x5b7353(0x92))['textContent']=_0x5b7353(0x91);}));
