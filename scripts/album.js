// Play and pause button images
// Variables to store the current play information
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
    pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
    playerBarPlayButton = '<span class="ion-play"></span>',
    playerBarPauseButton = '<span class="ion-pause"></span>',
    $previousButton = $('.main-controls .previous'),
    $nextButton = $('.main-controls .next'),
    currentAlbum = null,
    currentlyPlayingSongNumber = null,
    currentSongFromAlbum = null
    currentSoundFile = null,
    currentVolume = 80;

var createSongRow = function (songNumber, songName, songLength) {
  
  // HTML template to inject into main.album-view
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  + '</tr>'
  ;

  // Convert the template variable into a jQuery object
  var $row = $(template);

  // Handle mouse hover over song items in table.album-view-song-list
  var onHover = function (event) {

    // Get the first cell of the row that is presently under the cursor (this)
    // Get the number value from that <td/> element
    var $songNumberCell = $(this).find('.song-item-number'),
        songNumber = parseInt($songNumberCell.attr('data-song-number'));
    
    // If the cursor moves over a <tr/> whos' play button icon is not toggled,
    //   set this <tr/>'s td.song-item-number to the play button icon
    if (songNumber !== currentlyPlayingSongNumber) {
      $songNumberCell.html(playButtonTemplate);
    }
  };
  
  // Opposite action as above (toggle back to song number)
  var offHover = function (event) {

    var $songNumberCell = $(this).find('.song-item-number'),
        songNumber = parseInt($songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      $songNumberCell.html(songNumber);
    }    
  };

  // When the first element in a <tr/> in table.view-item-song-list is clicked:
  var clickHandler = function () {
    
    var songNumber = parseInt($(this).attr('data-song-number'));
    
    // If the currentlyPlayingSong variable has been set, find the <td/> with
    // class song-item-number which also has the data-song-number value of
    // the currentlyPlayingSong variable. Then set it's inner content to the
    // value stored in the currentlyPlayingSong variable
    if (currentlyPlayingSongNumber !== null) {
      $getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
    }
    
    // Toggles a new song to the current song
    if (currentlyPlayingSongNumber !== songNumber){
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play();
      updatePlayerBarSong();
    // Toggles a song 'off' if it is currently playing and clicked
    } else if (currentlyPlayingSongNumber === songNumber) {
      // This has some weirdness $(this).html(playButtonTemplate);
      if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        $('.main-controls .play-pause').html(playerBarPauseButton);
        $(this).html(pauseButtonTemplate);
      } else {
        currentSoundFile.pause();
        $('.main-controls .play-pause').html(playerBarPlayButton);
        $(this).html(playButtonTemplate);
      }
    }
    
    updateSeekBarWhileSongPlays();
    updateSeekPercentage($('.volume .seek-bar'), currentVolume);
    
  };

  // Attach click event listener
  $row.find('.song-item-number').click(clickHandler);

  // Attach mouser over and mouse out event listeners
  $row.hover(onHover, offHover);

  // return the created row
  return $row;
};

// Executed on page load
var setCurrentAlbum = function (album) {
  
  // Update currentAlbum variable
  currentAlbum = album;
  
  // grab elements by class name
  var $albumTitle = $('.album-view-title'),
      $albumArtist = $('.album-view-artist'),
      $albumReleaseInfo = $('.album-view-release-info'),
      $albumImage = $('.album-cover-art'),
      $albumSongList = $('.album-view-song-list');
  
  // Populate those elements
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
  
  // Empty any previous data from this element
  $albumSongList.innerHTML = '';
  
  // Create a new row for each song read in from the album parameter (JSON object)
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

function setSong (songNumber) {
  
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  
  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum = songNumber === null ? null : currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });
}

function seek (time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}

function setVolume (volume) {
  if (currentSoundFile) {
    volume = Math.max(0, volume);
    volume = Math.min(100, volume);
    currentSoundFile.setVolume(volume);
  }
}

function filterTimeCode (timeInSeconds) {
  var totalSeconds = Math.floor(parseFloat(timeInSeconds)),
      minutes = Math.floor(totalSeconds / 60),
      seconds = totalSeconds % 60;
      if (seconds < 10) { seconds = '0' + seconds; }
  
  return minutes + ':' + seconds;
}

function currentTimeInPlayerBar (currentTime) {
  currentTime = filterTimeCode(currentTime);
  $('.current-time').text(currentTime);
}

function setTotalTimeInPlayerBar (totalTime) {
  totalTime = filterTimeCode(totalTime);
  $('.total-time').text(totalTime);
}

function updatePlayerBarSong () {
  $('.song-name').html(currentSongFromAlbum.title);
  $('.artist-name').html(currentAlbum.artist);
  $('.artist-song-mobile').html(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
}

function updateSeekBarWhileSongPlays () {
  
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      
      var seekBarFillRatio = this.getTime() / this.getDuration(),
          $seekBar = $('.seek-control .seek-bar');
      
      updateSeekPercentage($seekBar, seekBarFillRatio);
      currentTimeInPlayerBar(this.getTime());
    });
  }
}

function updateSeekPercentage ($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);
  
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
}

function setupSeekBars () {
  
  var $seekBars = $('.player-bar .seek-bar');
  
  $seekBars.click( function (event) {
    
    var offsetX = event.pageX - $(this).offset().left,
        barWidth = $(this).width(),
        seekBarFillRatio = offsetX / barWidth;
    
    if ($(this).parent().hasClass('seek-control')) {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else if ($(this).parent().hasClass('volume')) {
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);
  });
  
  $seekBars.find('.thumb').mousedown( function (event) {
    
    var $seekBar = $(this).parent();
    
    $(document).bind('mousemove.thumb', function (event) {
      var offsetX = event.pageX - $seekBar.offset().left,
        barWidth = $seekBar.width(),
        seekBarFillRatio = offsetX / barWidth;
            
      if ($seekBar.hasClass('seek-control')) {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else if ($seekBar.hasClass('volume')){
        setVolume(seekBarFillRatio);
      }
      
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
    
    $(document).bind('mouseup.thumb', function (event) {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
}

function $getSongNumberCell (number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
}

function trackIndex (album, song) {
  return album.songs.indexOf(song);
}

function nextSong () {
  var index = trackIndex(currentAlbum, currentSongFromAlbum),
      albumLength = currentAlbum.songs.length,
      nextSongNumber = index + 1 === albumLength ? 1 : index + 2,
      prevSongNumber = index + 1 === 0 ? albumLength : index + 1;
  
  setSong(nextSongNumber);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updateSeekPercentage($('.volume .seek-bar'), currentVolume);
  updatePlayerBarSong();
  
  $getSongNumberCell(prevSongNumber).html(prevSongNumber);
  $getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
}

function prevSong () {
  var index = trackIndex(currentAlbum, currentSongFromAlbum),
      albumLength = currentAlbum.songs.length,
      nextSongNumber = index === 0 ? albumLength : index,
      prevSongNumber = index === albumLength ? 1 : index + 1;
    
  setSong(nextSongNumber);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updateSeekPercentage($('.volume .seek-bar'), currentVolume);
  updatePlayerBarSong();
  
  $getSongNumberCell(prevSongNumber).html(prevSongNumber);
  $getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
}

// Execute these functions when the DOM has loaded
$(document).ready(function () {
  
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(prevSong);
  $nextButton.click(nextSong);

});
