
'use strict'

const apiKey ='AIzaSyAjfQM6G2-mOL0BWgN09S11d0U6906YGFM';
const searchURL
='https://maps.googleapis.com/maps/api/geocode/json';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//this function takes the users text input (searchTerm) and converts it to latitude and longitude using google maps geocode api
function getLatAndLon(query) {
  const params = {
    address: query,
    key: apiKey,
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;


  fetch(url)
  .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    // the results are passed to the searchForTrails function located in hike.js 
    .then(responseJson => searchForTrails(responseJson))
   .catch(err => {
      $('#js-error-message').text(`Location not found. Please search City and State.`);
      });
}

function watchForm() {
  $('form').submit(event => {
   event.preventDefault();
   const searchTerm = $('#js-search-term').val();
   $('#js-search-term').val('');

   getLatAndLon(searchTerm);
  });
}

$(watchForm);
console.log('app loaded');