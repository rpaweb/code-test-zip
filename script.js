// Add the event to btnExecute
document.getElementById("btn-execute").onclick = async () => {
  await getZipCodeInfo();
};

/**
 * @description Executes the request
 * @public
 */
async function getZipCodeInfo(){
  //Ex. 90210
  const zipCode = document.getElementById("zipCode").value,
        zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/g

  if(zipCode.trim().length == 0){
    alert("You must input something!"); 
    return;
  } else if(!zipCode.trim().match(zipCodeRegex)) {
    alert("Invalid zip code!"); 
    return;
  };

  try {
    const zipCodeInfo = await fetchDataFromAPI(zipCode);
    _renderResults(zipCodeInfo);
  } catch (error) {
    alert(error);
  };
};

/**
 * @description Gets the zip code info from the API
 * @param {string} zipCode
 * @private
 * @returns 
 */
async function fetchDataFromAPI(zipCode){
  const myHeaders = new Headers();
  const myInit = {
    method: 'GET',
    headers: myHeaders,
  };

  const myRequest = new Request(`http://api.zippopotam.us/us/${zipCode}`, myInit);

  const resultFromAPI = await fetch(myRequest);
  switch(resultFromAPI.status){
    case(200):
      return resultFromAPI.json();
    case(404):
      throw `Zip code (${zipCode}) not found!`;
    default:
      throw `Something wrong happened!: ${resultFromAPI.statusText}`;
  };
}

/**
 * @description Renders the results
 * @param {object} zipCodeInfo 
 * @private
 */
function _renderResults(zipCodeInfo){
  const zipForm = document.getElementById("zip-form");
  const divResult = document.getElementById("div-input-result");

  // Show results section and reorganize sections.
  divResult.style.display = "inherit";
  zipForm.style.width = "45vw";
  zipForm.style.top = "45%";

  // Rendering the results with image included.
  divResult.innerHTML = `
    <div class="results-card">
      <h2>Search Results</h2>
      <ul>
        <li><span>Country</span>: ${zipCodeInfo["country"]} (${zipCodeInfo["country abbreviation"]})</li>
        <li><span>State</span>: ${zipCodeInfo["places"][0]["state"]} (${zipCodeInfo["places"][0]["state abbreviation"]})</li>
        <li><span>City</span>: ${zipCodeInfo["places"][0]["place name"]}</li>
        <li><span>Coords</span>: ${zipCodeInfo["places"][0]["latitude"]}, ${zipCodeInfo["places"][0]["longitude"]}</li>
      </ul>
      <div class="img-result"><img src="./states/${zipCodeInfo["places"][0]["state abbreviation"]}.svg" alt="State Image" /></div>
    </div>
  `;
};