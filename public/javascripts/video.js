var resPrefs = ["medium", "high", "default"];

function Video(obj) { 
  this.artist = obj.artist;
  this.title = obj.title;
  this.id = obj.videoId;
  this.type = obj.type;
  this.duration = obj.duration;
  this.thumbs = obj.thumbnails;
  this.images = imageURLs(this.thumbs);


  function imageURLs(thumbs){
    return thumbs.map(function(thumb){
      return thumb.url;
    });
  };
}

Video.prototype = {

  preferredThumb: function() {
    var thumb;
    var i = 0;
    while (thumb == undefined) {
      var res = resPrefs[i];
      var thumbAtRes = this.findByRes(this.thumbs, res);
      if (thumbAtRes)
        thumb = thumbAtRes;
      i++;
    }
    return thumb;
  },

  thumbImageTag: function() {
    return "<div " +
           "class='thumb' " +
           "style='background-image:" +
           "url(" + this.preferredThumb().url + ")" +
           "'></div>";
  },

  findByRes: function(thumbs, res) {
    return thumbs.filter(function(i) {
      return i.resolution == res;
    })[0];
  }
}