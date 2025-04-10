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

/*
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const usErnA = document.getElementById("username").value;
    const PAsSRd = document.getElementById("password").value;

    // Simple check (replace with a more secure check later)
    if (usErnA === Usram && PAsSRd === pAssdr) {
        localStorage.setItem("authenticated", "true");
        window.location.href = "/protected.html";
    } else {
        document.getElementById("error-msg").textContent = "Invalid username or password.";
    }
});
*/

//JavaScript Obfuscator Tool

const _0x3cdde1=_0x27f6;function _0x526b(){const _0x10db30=['6648itOpcC','7842PhDMlw','login-form','4MPUoIx','787950HyTvfR','addEventListener','password','username','/protected.html','28iSLFgP','46901VuuBTQ','href','Invalid\x20username\x20or\x20password.','2316503zIMoOl','9KFTdLt','error-msg','getElementById','1265vIjpUC','67029DXMkMx','textContent','location','1149536btZaED','submit','authenticated','3091jmHPtY'];_0x526b=function(){return _0x10db30;};return _0x526b();}function _0x27f6(_0x294ab2,_0x56a6c5){const _0x526b2f=_0x526b();return _0x27f6=function(_0x27f67c,_0x896688){_0x27f67c=_0x27f67c-0xb6;let _0x97ca1f=_0x526b2f[_0x27f67c];return _0x97ca1f;},_0x27f6(_0x294ab2,_0x56a6c5);}(function(_0x5b6d11,_0x1891b2){const _0x17b2f1=_0x27f6,_0x3e5bfe=_0x5b6d11();while(!![]){try{const _0x202b4d=parseInt(_0x17b2f1(0xc5))/0x1*(parseInt(_0x17b2f1(0xbe))/0x2)+-parseInt(_0x17b2f1(0xcd))/0x3*(-parseInt(_0x17b2f1(0xc4))/0x4)+-parseInt(_0x17b2f1(0xcc))/0x5*(parseInt(_0x17b2f1(0xbc))/0x6)+parseInt(_0x17b2f1(0xc8))/0x7+parseInt(_0x17b2f1(0xb7))/0x8*(-parseInt(_0x17b2f1(0xc9))/0x9)+-parseInt(_0x17b2f1(0xbf))/0xa+-parseInt(_0x17b2f1(0xba))/0xb*(-parseInt(_0x17b2f1(0xbb))/0xc);if(_0x202b4d===_0x1891b2)break;else _0x3e5bfe['push'](_0x3e5bfe['shift']());}catch(_0x1c0470){_0x3e5bfe['push'](_0x3e5bfe['shift']());}}}(_0x526b,0x2cd60),document[_0x3cdde1(0xcb)](_0x3cdde1(0xbd))[_0x3cdde1(0xc0)](_0x3cdde1(0xb8),function(_0x394629){const _0x110897=_0x3cdde1;_0x394629['preventDefault']();const _0x56bd0a=document[_0x110897(0xcb)](_0x110897(0xc2))['value'],_0x4ab9dc=document['getElementById'](_0x110897(0xc1))['value'];_0x56bd0a===Usram&&_0x4ab9dc===pAssdr?(localStorage['setItem'](_0x110897(0xb9),'true'),window[_0x110897(0xb6)][_0x110897(0xc6)]=_0x110897(0xc3)):document[_0x110897(0xcb)](_0x110897(0xca))[_0x110897(0xce)]=_0x110897(0xc7);}));

console.log("It's really coming here!!!!!!!");
