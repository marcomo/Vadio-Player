// Preferred image resolution order
var resPrefs = ["medium", "high", "default"];

// Video class
function Video(obj) {
  this.artist = obj.artist;
  this.title = obj.title;
  this.videoId = obj.videoId;
  this.duration = obj.duration;
  this.thumbnails = obj.thumbnails;
  this.videoType = obj.videoType;
}

$(document).ready(function() {

  // Video class functions
  Video.prototype = {
    preferredThumb: function() {
      var thumb;
      var i = 0;
      while (thumb == undefined) {
        var res = resPrefs[i];
        var thumbAtRes = this.findByRes(res);
        if (thumbAtRes)
            thumb = thumbAtRes;
        i++;
      }
      return thumb;
    },

    findByRes: function(res) {
      return this.thumbnails.filter(function(i) {
          return i.resolution == res;
      })[0];
    },

    inPlaylist: function(playlist) {
      return playlist.indexOf(this.videoId) >= 0
    }
  }
});
