const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_BEGINNING_URL = 'https://www.youtube.com/watch?v=';
const debug = {};
const k1 = "AIzaSyAEIMbf";
const k2 = "K2xqjXhd3kacL8";
const k3 = "KG59ZDmwKq8wO";
const currentQuery = {
  part: `snippet`,
  key: `${k1}${k3}${k2}`,
  q: ``,
  maxResults: 5,
  type: `video`,
  pageToken: ``
};

// Watch for a listener on the Submit button
// function watchSubmit()
function watchSubmit() {
  $('.js-search-form').submit(event => {
    // is going to prevent default
    event.preventDefault();
    // get the query Target and pull the value from it
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // Clear the input
    // queryTarget.val("");
    // Send the query to the API and set a callback
    getDataFromApi(query, displayYoutubeSearchData);
  })
}

// Watch for a listener on the result Next or Previous buttons
function watchNext() {
  $('.js-navigate-buttons').on('click', event => {
    event.preventDefault();

    console.log(event.target);
    if ($(event.target).hasClass("js-next-button")) {
      getNextPageDataFromApi("next", displayYoutubeSearchData);
    }
    else if ($(event.target).hasClass("js-previous-button")) {
      getNextPageDataFromApi("previous", displayYoutubeSearchData);
    }

  })
}

// Callback displayYoutubeSearchData will need to
function displayYoutubeSearchData(data) {
  // map each data.items and show each result
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
  currentQuery.nextPageToken = data.nextPageToken;
  currentQuery.prevPageToken = data.prevPageToken;
  displayNavigationButtons(data);

  // Debugging code below
  // Object.assign(debug, data);
  console.log(data);
}

// Once results are rendered, we will need a way to navigate them
function displayNavigationButtons(data) {
  $('.js-navigate-buttons').html(
    `<div class="row">
      <ul>
        <li><a class="js-previous-button">\< Previous</a></li>
        <li><a class="js-next-button">Next \></a></li>
      </ul>
    </div>
    `
  );
}

// When you send query to API you are getting the Data from the API
// function getDataFromApi(searchTerm, callback)
function getDataFromApi(searchTerm, callback) {
  currentQuery.q = `${searchTerm}`;

  $.getJSON(YOUTUBE_SEARCH_URL, currentQuery, callback);
}
// You need to set up a query based on your searchTerm
// then call $.getJSON(url, query, callback);


// I couldn't figure out a better way to do the navigation buttons
// So what I did was made another JSON query in a seperate function,
// after making the query a global variable so I could edit it in this
// seperate function.
function getNextPageDataFromApi(page, callback) {
  if (page === "next") {
    currentQuery.pageToken = currentQuery.nextPageToken;
  }
  else if (page === "previous") {
    currentQuery.pageToken = currentQuery.prevPageToken;
  }

  $.getJSON(YOUTUBE_SEARCH_URL, currentQuery, callback);
}


// show each result using renderResult(result)
// result is each item result
// We will be returning the HTML
function renderResult(result) {
  return `
  <div class="search-result clearfix row">
    <div class="col-6">
    <a href="${YOUTUBE_BEGINNING_URL}${result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.medium.url}" alt=""> </a>
    </div>
    <div class="col-6">
      <h2> <a class="js-result-name" id="${result.id.videoId}" href="#" target="_blank">
      ${result.snippet.title}</h2> </a>
      <p>${result.snippet.description}</p>
      <p><a href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">More from this Channel</a></p>
    </div>
  </div>
  `;
}

// Watch for a listener on the title links
function watchLinkToModal() {
  $('.js-search-results').on('click', '.js-result-name', (event) => {
    event.preventDefault();

    $('.modal-overlay').toggleClass('hidden');
    $('.modal-container').toggleClass('hidden');
    $('.modal-content').html(`
      <iframe
        src="https://www.youtube.com/embed/${event.target.id}?autoplay=1">
      </iframe>
      <button class="close">Close</button>
      </div>
     `);
  });
}

// Watch for a listener on the overlay when the user clicks away from the video
function watchCloseModal() {
  $('.modal-overlay').on('click', (event) => {
    event.preventDefault();

    $('.modal-overlay').toggleClass('hidden');
    $('.modal-container').toggleClass('hidden');
    $('.modal-content').html(``);
  })
}

$(watchSubmit);
$(watchNext);
$(watchLinkToModal);
$(watchCloseModal);