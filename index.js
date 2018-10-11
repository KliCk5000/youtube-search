// Create the search URL
// const YOUTUBE_SEARCH_URL = '';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_BEGINNING_URL = 'https://www.youtube.com/watch?v=';
const debug = {};

// Watch for a listener on the Submit button
// function watchSubmit()
function watchSubmit() {
  $(".js-search-form").submit(event => {
    // is going to prevent default
    event.preventDefault();
    // get the query Target and pull the value from it
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // Clear the input
    queryTarget.val("");
    // Send the query to the API and set a callback
    getDataFromApi(query, displayYoutubeSearchData);
  })
}

// Callback displayYoutubeSearchData will need to
function displayYoutubeSearchData(data) {
  // map each data.items and show each result
  const results = data.items.map( (item, index) => renderResult(item) );
  $('.js-search-results').html(results);

  // Debugging code below
  Object.assign(debug, data);
  console.log(data);
}

// When you send query to API you are getting the Data from the API
// function getDataFromApi(searchTerm, callback)
function getDataFromApi(searchTerm, callback) {
  const query = {
    part: `snippet`,
    key: `AIzaSyBUOKAhKo_sHBhVQ5ZAbBzhUvWNyub9hiM`,
    q: `${searchTerm}`,
    maxResults: 25,
    type: `video`
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}
// You need to set up a query based on your searchTerm
// then call $.getJSON(url, query, callback);

// show each result using renderResult(result)
// result is each item result
// We will be returning the HTML
function renderResult(result) {
  return `
  <div class="search-result clearfix">
    <img src="${result.snippet.thumbnails.medium.url}" alt="" width="${result.snippet.thumbnails.medium.width}" height="${result.snippet.thumbnails.medium.height}">
    <h2> <a class="js-result-name" href="${YOUTUBE_BEGINNING_URL}${result.id.videoId}" target="_blank">
    ${result.snippet.title}</h2> </a>
    <p>${result.snippet.description}</p>
  </div>
  `;

// <a class="js-result-name" href="${result.html_url}" target="_blank">${result.name}</a> by <a class="js-user-name" href="${result.owner.html_url}" target="_blank">${result.owner.login}</a>
//     </h2>
//     <p>Number of watchers: <span class="js-watchers-count">${result.watchers_count}</span></p>
//     <p>Number of open issues: <span class="js-issues-count">${result.open_issues}</span></p>

}

$(watchSubmit);