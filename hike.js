'use strict'

const hikeApiKey ='200426138-2a5221ab1f2d875b336bde856267e5ca';
const hikeSearchURL ='https://www.hikingproject.com/data/get-trails';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson){
  console.log(responseJson);
  // if there are previous results remove them
  $('#results-list').empty();
  // iterate through the array
  for (let i=0; i < responseJson.trails.length; i++){
    // for each hking object in the data array,
    //add a list item to the results 
    //list with the hikes name, location, star rating,
      //summary, trail length, conditions, website URL and img
  $('#results-list').append(
    `<li><h3>${responseJson.trails[i].name}</h3>
      <p>Location: ${responseJson.trails[i].location}</p>
      <p>Star rating: ${responseJson.trails[i].stars}</p>
      <p>Summary: ${responseJson.trails[i].summary}</p>
      <p>Length: ${responseJson.trails[i].length} miles</p>
      <p>Conditions: ${responseJson.trails[i].conditionDetails}</p>
      <a href="${responseJson.trails[i].url}">${responseJson.trails[i].url}</a>
      <img src="${responseJson.trails[i].imgMedium}" alt="image of trail">
      </li>`
  )};
  //display the results
  $('.js-start-search').remove(); 
  $('#results').removeClass('hidden');
};

// using the responseJson results from googlemaps api searchForTrails takes the lat and lon to pass in as values to retrieve the data
//from hiking projects api
function searchForTrails(responseJson) {
  const params ={
    lat: responseJson.results[0].geometry.location.lat,
    lon: responseJson.results[0].geometry.location.lng,
    maxDistance: 100,
    maxResults: 15,
    minStars: 3,
    key: hikeApiKey
  };
  const queryString = formatQueryParams(params);
  const url = hikeSearchURL + '?' + queryString;

  console.log(url)

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
