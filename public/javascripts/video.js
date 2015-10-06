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
  // Functions go here
}