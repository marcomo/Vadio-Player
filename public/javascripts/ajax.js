var stagedVideos = [];
var searchResults = {};

var playlist = window.localStorage;
var playlistIDs = Object.keys(playlist);

function objectifyPlaylist() {
  return playlistIDs.map(function(value) {
    return playlist.getItem(value);
  });
}

var playlistObjs = objectifyPlaylist();

function loadNoResults() {
  $('#data').html('Sorry, no results found.');
}

// Returns an array of Video objects
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

function addToStagedVideos(videos) {
  stagedVideos = videos;
}

function storeLocally(video) {
  var dataString = JSON.stringify(video);
  playlist.setItem(video.videoId, dataString);
}

function storeSearchResult(video) {
  var dataString = JSON.stringify(video);
  searchResults[video.videoId] = dataString;
}

function addToPlaylist() {
  for (var i = 0; i < stagedVideos.length; i++) {
    storeLocally(videos[i]);
  }
}

function addToSearchResults(videos) {
  for (var i = 0; i < videos.length; i++) {
    storeSearchResult(videos[i]);
  }
}

function loadVideosFromAPI(data) {
  if (data === null) {
    loadNoResults();
  } else {
    var newVideos = videosFromData(data);
    addToSearchResults(newVideos);
    addToStagedVideos(newVideos);
    loadToSearchList(stagedVideos);
  }
}

function videosFromLocalStorage() {
  var videos = playlistObjs.map(function(obj) {
    return JSON.parse(obj);
  });
  stagedVideos = stagedVideos.concat(makeVideos(videos));
  return stagedVideos;
}

function getTemplate(type) {
  // Load search list template
  var template = document.getElementById(type + '-item');
  return document.importNode(template.content, true);
}

function loadVideoTemplate(clone, video) { 
  clone.querySelector('li').dataset.id = video.id;
  if (video.artist) {
    clone.querySelector('.artist').innerText = video.artist;
  }
  clone.querySelector('.title').innerText = video.title;
  var bgUrl = 'url("' + video.image + '")';
  clone.querySelector('.thumb').style.backgroundImage = bgUrl;
  return clone;
}

function getVideoUrl(video) {
  var videoType = video.videoType;
  var videoPath;
  switch (videoType) {
    case 'yt':
      videoPath = 'http://www.youtube.com/embed/' + video.videoId + '?autoplay=1'
  }
  return videoPath;
}

function getEmbedTemplate(type) {
  // Load embedded video template
  var template;
  switch (type) {
    case "yt":
      template = document.querySelector('#yt-embed');
  }
  return document.importNode(template.content, true);
}

function embedVideo(url) {
  var player = document.getElementById('player')
  player.querySelector('iframe').src = url;
}

function playVideo() {
  document.getElementById('player').classList.remove('closed');
  var listId = $(this).closest('ul');
  var listItem = $(this).closest('li');
  var id = listItem.attr('data-id');
  var video;
  if (listId === 'search-results') {
    // video = JSON.parse(searchResults[id]);
  } else {
    video = JSON.parse(playlist[id]);
  }
  var url = getVideoUrl(video);
  embedVideo(url);
}

function bindPlayEvents(list) {
  var list = document.getElementById(list);
  var playButtons = list.querySelectorAll('.play');
  for(var i = 0; i < playButtons.length; i++) {
    playButtons[i].addEventListener('click', playVideo, false);
  }
}

function loadToSearchList(videos) {
  var items = [];
  for (var i = 0; i < videos.length; i++) {
    var template = getTemplate('searchlist');
    var data = {
      'artist': videos[i].artist,
      'title': videos[i].title,
      'image': videos[i].preferredThumb().url,
      'id': videos[i].videoId
    };
    var clone = loadVideoTemplate(template, data);
    items.push(clone);
  };
  var searchList = document.getElementById('searchlist');
  var topResult = searchList.firstChild;
  for (var i = 0; i < items.length; i++) {
    searchList.insertBefore(items[i], topResult);
  }
  bindPlayEvents('searchlist');
}

function loadToPlaylist(videos) {
  var items = [];
  for (var i = 0; i < videos.length; i++) {
    var template = getTemplate('playlist');
    var data = {
      'artist': videos[i].artist,
      'title': videos[i].title,
      'image': videos[i].preferredThumb().url,
      'id': videos[i].videoId
    };
    var clone = loadVideoTemplate(template, data);
    items.push(clone);
  };
  var plist = document.getElementById('playlist');
  var topResult = plist.firstChild;
  for (var i = 0; i < items.length; i++) {
    plist.insertBefore(items[i], topResult);
  }
  bindPlayEvents('playlist');
}

$(document).ready(function() {


  // Load the playlist
  $.ajax({
    url: '/',
    success: function() {
      var videos = videosFromLocalStorage();
      loadToPlaylist(videos);
    },
    error: function(req, stat, err) {
      console.log('an error has occured');
      console.log(err.message);
    }
  })

  // Send a query to the Vadio API
  $('#search-vadio').on('submit', function(e) {
    console.log('submitting...');
    e.preventDefault();
    var params = $(this).serialize();
    $.ajax({
      dataType: 'json',
      url: '/searching',
      data: params,
      success: function(data) {
        loadVideosFromAPI(data);
      },
      error: function(req, stat, err) {
        console.log('an error has occured');
        console.log(err.message);
      }
    });
  });
});