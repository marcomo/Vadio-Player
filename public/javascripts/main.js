// A collection of videos saved by the user to their playlist
var playlist = window.localStorage;

$(document).ready(function() {

  // An array of playlist video ids
  var playlistIDs = Object.keys(playlist);


  // An array of playlist objects
  var playlistObjs = objectifyPlaylist();


  // Messages for the user  
  var msgs = {
    'no-results': 'Sorry, no results at this time. Please try another search.',
    'no-response': 'Sorry, our servers are not responding at this time. Please try again later.',
    'no-query-data': 'Looks like you used incorrect country code. Please try again or leave it blank.'
  };


  // stageVideos holds Video objects ready to be loaded to the DOM
  var stagedVideos = [];


  // searchResults holds JSON of the most recent search data
  var searchResults = {};


  // The clear button which clears all the items in the playlist
  var clearButton = document.getElementById('clear-playlist');


  // Gets the template for list items from HTML <head>
  // and creates a clone
  function getListTemplate(type) {
    var template = document.getElementById(type + '-item');
    return document.importNode(template.content, true);
  }


  // Loads the template with the video data:
  // id, artist, title, image
  function loadVideoTemplate(clone, video) { 
    var bgUrl = 'url("' + video.image + '")';
    clone.querySelector('li').dataset.id = video.id;
    clone.querySelector('.artist').innerText = video.artist;
    clone.querySelector('.title').innerText = video.title;
    clone.querySelector('.thumb').style.backgroundImage = bgUrl;
    return clone;
  }


  // Generates a video URL based on the video type
  function getVideoUrl(video) {
    var videoPath;
    switch (video.videoType) {
      case 'yt':
        videoPath = 'http://www.youtube.com/embed/' + video.videoId + '?autoplay=1';
    }
    return videoPath;
  }


  // Adds the video url to the player iframe in the DOM
  function embedVideo(url) {
    var player = document.getElementById('player');
    player.querySelector('iframe').src = url;
  }


  // Finds the parent list [searchlist, playlist]
  // of the list item
  function parentList(item) {
    return $(item).closest('ul').attr('id');
  }


  // Expands the player 'window'
  function openPlayerView() {
    document.getElementById('player').classList.remove('closed');
  }


  // Open the player element and plays the video
  function playVideo() {
    var video;

    var listId = parentList(this);
    var listItem = $(this).closest('li');
    var id = listItem.attr('data-id');

    openPlayerView();
    
    if (listId === 'searchlist') {
      video = JSON.parse(searchResults[id]);
    } else {
      video = JSON.parse(playlist[id]);
    }

    var url = getVideoUrl(video);
    embedVideo(url);
  }


  // Adds a video in the search list to the playlist
  function addVideo() {
    var listItem = $(this).closest('li');
    var id = listItem.attr('data-id');
    video = JSON.parse(searchResults[id]);
    video = new Video(video);
    loadToList([video], 'playlist');
    addToPlaylist(video);
    removeFromSearchlist(listItem);
  }


  // Remove a video from searchlist when it's added
  // to the playlist
  function removeFromSearchlist(item) {
    delete searchResults[video.videoId];
    $(item).addClass('closed'); 
    setTimeout(function() {
      $(item).remove();
    }, 500);
  }


  // Removes a video in the playlist by way of the minus button
  function removeFromPlaylist() {
    var listItem = $(this).closest('li');
    var id = listItem.attr('data-id');
    playlist.removeItem(id);
    listItem.addClass('closed');

    setTimeout(function() {
      listItem.remove();
    }, 500);
  }


  // Binds an event listener to all play buttons
  // for a specified list
  function bindPlayEvents(listView) {
    var playButtons = listView.querySelectorAll('.play');
    
    for(var i = 0; i < playButtons.length; i++) {
      playButtons[i].addEventListener('click', playVideo, false);
    }
  }


  // Binds an event listener to all add buttons
  // for a specified list
  function bindAddEvents() {
    var searchList = document.getElementById('searchlist');
    var addButtons = searchList.querySelectorAll('.plus');
    
    for(var i = 0; i < addButtons.length; i++) {
      addButtons[i].addEventListener('click', addVideo, false);
    }
  }


  // Binds an event listener to all minus buttons
  // in the playlist
  function bindRemoveEvents() {
    var pList = document.getElementById('playlist');
    var removeButtons = pList.querySelectorAll('.minus');
    
    for(var i = 0; i < removeButtons.length; i++) {
      removeButtons[i].addEventListener('click', removeFromPlaylist, false);
    }
  }


  // Produces an array video objects similar
  // to 'playlist' but without keys
  function objectifyPlaylist() {
    return playlistIDs.map(function(value) {
      return playlist.getItem(value);
    });
  }


  // Stores video data to localStorage
  function storeLocally(video) {
    var dataString = JSON.stringify(video);
    playlist.setItem(video.videoId, dataString);
  }


  // Iterates over stagedVideos and stores
  // them to localStorage
  function addToPlaylist() {
    for (var i = 0; i < stagedVideos.length; i++) {
      storeLocally(stagedVideos[i]);
    }
  }


  // Updates stageVideos to include those in localStorage
  // Returns updated staged videos
  function videosFromLocalStorage() {
    var videos = playlistObjs.map(function(obj) {
      return JSON.parse(obj);
    });
    stagedVideos = stagedVideos.concat(makeVideos(videos));
    return stagedVideos;
  }


  // Instantiates Video objects and 
  // returns then as an array
  function makeVideos(vids) {
    var newVideos = vids.map(function(value) {
      return new Video(value);
    });
    return newVideos;
  }


  // Return an array of videoEntries from data
  function videosFromData(data) {
    var videos = Object.keys(data.videoEntries).map(function(value) {
      return data.videoEntries[value];
    });
    return makeVideos(videos);
  }


  // Adds a single search result data property
  // from searchResults object
  function storeSearchResult(video) {
    var dataString = JSON.stringify(video);
    searchResults[video.videoId] = dataString;
  }


  // Iterates over all search results for 
  // storing in searchResults array
  function addToSearchResults(videos) {
    for (var i = 0; i < videos.length; i++) {
      storeSearchResult(videos[i]);
    }
  }


  // Captures the data needed for the view
  function selectData(video) {
    return {
      'artist': video.artist,
      'title': video.title,
      'image': video.preferredThumb().url,
      'id': video.videoId
    };
  }


  // Loads videos to a list view
  function loadToList(videos, list) {
    var items = [];
    var listView = document.getElementById(list);

    // Build all the results
    for (var i = 0; i < videos.length; i++) {
      var template = getListTemplate(list);
      var data = selectData(videos[i]);
      var clone = loadVideoTemplate(template, data);
      items.push(clone);
    }

    // Then load them all at once
    for (var i = 0; i < items.length; i++) {
      var firstChild = listView.firstChild;
      listView.insertBefore(items[i], firstChild);
    }

    bindPlayEvents(listView);
    if (list === 'searchlist') {
      bindAddEvents();
    };
    if (list === 'playlist') {
      bindRemoveEvents();
    };

    revealListItems(list);
  }


  function revealListItems(list) {
    var listView = document.getElementById(list);
    var hidden = listView.querySelectorAll('.closed');
    
    function revealer(item) { 
      for (var i = 0; i < hidden.length; i++) {
        hidden[i].classList.remove('closed');
      }
    };

    setTimeout(function() { revealer() }, 500);
  }


  // Procedure for converting the API data into
  // Video objects, staging them, and getting them loaded
  function loadVideosFromAPI(data) {
    if (data === null) {
      printErrorMsg(msgs['no-results']);
    } else {
      var newVideos = videosFromData(data);
      addToSearchResults(newVideos);
      stagedVideos = newVideos;
      loadToList(stagedVideos, 'searchlist');
      revealListItems('searchlist');
    }
  }


  // Prints a message to the user for the amount
  // of time provided. If a time argument is not provided,
  // the message will not be removed from view.
  function printErrorMsg(msg, timeout) {
    console.log(msg);
    var msgBox = document.getElementById('message-box');
    var span = msgBox.querySelector('span');
    span.innerText = msg;
    span.classList.remove('invisible');
    if (timeout) {
      window.setTimeout(function() {
        span.classList.add('invisible');
      }, timeout);
    }
  }


  // Clears the message box area on next search submit
  function clearMsgs() {
    var msgBox = document.getElementById('message-box');
    msgBox.querySelector('span').classList.add('invisible');
  }


  // Clears the localStorage data and the playlist view
  function clearPlaylist() {
    var pList = document.getElementById('playlist');
    var playlistItems = pList.childNodes;


    for (var i = 0; i < playlistItems.length; i++) {
      playlistItems[i].classList.add('closed');
    }

    setTimeout(function() {
      while (pList.firstChild) {
        pList.removeChild(pList.firstChild);
      }
    }, 500);

    playlist.clear();

    console.log(playlistItems);
    console.log(playlist);
  }

  clearButton.addEventListener('click', clearPlaylist, false);


  // Loads the playlist into view
  $.ajax({
    url: '/',

    success: function() {
      var videos = videosFromLocalStorage();
      loadToList(videos, 'playlist');
    },

    error: function(req, stat, err) {
      console.log('an error has occured');
      console.log(err.message);
    }
  });


  // Sends a query to the Vadio API and loads
  // it to the view if it isn't a 504 result
  $('#search-vadio').on('submit', function(e) {
    e.preventDefault();
    clearMsgs();
    var params = $(this).serialize();
    
    $.ajax({
      dataType: 'json',
      url: '/searching',
      data: params,
      
      success: function(data) {
        if (data.meta) {
          if (data.meta.status_code === 504) {
            console.log(504);
            printErrorMsg(msgs['no-results'], 5000);
          }
        } else if (data.code === 404) {
            printErrorMsg(msgs['no-query-data']);
        } else {
          console.log(data);
          loadVideosFromAPI(data);
        }
      },

      error: function(req, stat, err) {
        console.log(stat);
        console.log(err.message);
        console.log(msgs['server-down']);
        printErrorMsg(msgs['server-down']);
      },

      complete: function(req, stat) {
        console.log(stat);
      }
    });
  });
});