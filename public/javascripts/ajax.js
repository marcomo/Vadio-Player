var searchData;
var videos = [];

function loadResults(data) {
  // showData(JSON.stringify(data));
  hideForm();
  console.log(data);
  if (data === null) {
    loadNoResults();
  } else {
    makeVideos(data);
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
    var images = videos[i].images;
    for (var i = 0; i < images.length; i++) {
      $("#images").append("<div class='thumb' style='background-image:url(" + images[i] + ");background-size: cover;background-position: center'>");

    }
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
            loadResults(data)
          },
          error: function(req, stat, err) {
            console.log("an error has occured");
          }
        })
    })
});
