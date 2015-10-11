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

function storeLocally(video) {
  var dataString = JSON.stringify(video);
  playlist.setItem(video.videoId, dataString);
}

function addToPlaylist() {
  for (var i = 0; i < stagedVideos.length; i++) {
    storeLocally(videos[i]);
  }
}

  if (data === null) {
    loadNoResults();
  } else {
    makeVideos(data);
    console.log(videos);
    loadVideoThumbs();
  }
}

function loadNoResults() {
  $("#data").html("Sorry, no results found.");
}

function hideForm() {
  $("#search-vadio").fadeOut();
}

function makeVideos(data) {
  var vids = Object.keys(data.videoEntries).map(function(value){
    return data.videoEntries[value];
  });
  for (var i = 0; i < vids.length; i++) {
    videos.push(new Video(vids[i]));
  };
}

function loadVideoThumbs() {
  for (var i = 0; i < videos.length; i++) {
    var imgTag = videos[i].thumbImageTag();
    console.log(imgTag);
    $("#images").append(imgTag);
  }
};

function showData(data) {
  $("#data").html(data);
};

$(document).ready(function() {
    $("#search-vadio").on("submit", function(e) {
        e.preventDefault();
        var params = $(this).serialize();
        $.ajax({
          dataType: 'json',
          url: "/searching",
          data: params,
          success: function(data) {
            loadResults(data);
          },
          error: function(req, stat, err) {
            console.log("an error has occured");
          }
        })
    })
});