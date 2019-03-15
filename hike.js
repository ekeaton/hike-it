'use strict'

const hikeApiKey ='200426138-2a5221ab1f2d875b336bde856267e5ca';
const hikeSearchURL ='https://www.hikingproject.com/data/get-trails';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson){
  // if there are previous results remove them
  $('#results-list').empty();
  // iterate through the array
  for (let i=0; i < responseJson.trails.length; i++){
    // for each hking object in the data array,
    //add a list item to the results 
    //list with the hikes name, location, star rating,
      //trail length, website URL and img
  $('#results-list').append(
        `<li role="listitem">
          <div id="search-result" class="search-result">
          <img class="hiking-image" src="${responseJson.trails[i].imgSqSmall}" alt="image of trail">
          <h3 class="trail-name">${responseJson.trails[i].name}</h3>
           <p class="trail-info">Location: ${responseJson.trails[i].location}</p>
           <p class="trail-info">Star rating: ${responseJson.trails[i].stars}</p>
            <p class="trail-info">Length: ${responseJson.trails[i].length} miles</p>

           <button type="submit" class="trail-button"> <a href="${responseJson.trails[i].url}" target="_blank" class="trail-label-a">Link to trail</a></button>
    
				  </div>
        </li>`
  )};
  //display the results
  $('#results').removeClass('hidden');
};

// using the responseJson results from googlemaps api searchForTrails takes the lat and lon to pass in as values to retrieve the data
//from hiking projects api
function searchForTrails(responseJson) {
  const params ={
    lat: responseJson.results[0].geometry.location.lat,
    lon: responseJson.results[0].geometry.location.lng,
    maxDistance: 100,
    maxResults: 10,
    minStars: 3,
    key: hikeApiKey
  };
  const queryString = formatQueryParams(params);
  const url = hikeSearchURL + '?' + queryString;


  fetch(url)
  .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
