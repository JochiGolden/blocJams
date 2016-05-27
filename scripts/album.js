var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { title: 'Blue', duration: '4:26' },
    { title: 'Green', duration: '3:14' },
    { title: 'Red', duration: '5:01' },
    { title: 'Pink', duration: '3:21' },
    { title: 'Magenta', duration: '2:15' }
  ]
},
  albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
      { title: 'Hello, Operator?', duration: '1:01' },
      { title: 'Ring, ring, ring', duration: '5:01' },
      { title: 'Fits in Your Pocket', duration: '3:21' },
      { title: 'Can You Hear Me Now?', duration: '3:14' },
      { title: 'Wrong Number', duration: '2:15' }
    ]
  },
  createSongRow = function (songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

    return template;
  },
  songListContainer = document.getElementsByClassName('album-view-song-list')[0],
  songRows = document.getElementsByClassName('album-view-song-item'),
  playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
  pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
  currentlyPlayingSong = null;

var setCurrentAlbum = function (album) {
  
  var albumTitle = document.getElementsByClassName('album-view-title')[0],
      albumArtist = document.getElementsByClassName('album-view-artist')[0],
      albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0],
      albumImage = document.getElementsByClassName('album-cover-art')[0],
      albumSongList = document.getElementsByClassName('album-view-song-list')[0];
  
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);
  
  albumSongList.innerHTML = '';
  
  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

// write function findParentByClassName
var findParentByClassName = function (element, parentClassName) {
  if (element) {
    var currentParent = element.parentElement;
    if (!currentParent) {
      alert('No parent found');
    } else {
      while (currentParent.className !== null) {
        currentParent = currentParent.parentElement;
      }
      if (currentParent.className !== parentClassName)
        alert('No parent found with that class name');
      return currentParent; 
    }
  }
}

// write function getSongItem
var getSongItem = function(element) {
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
      return element;
    default:
      return;
  }
};

var clickHandler = function(targetElement) {
  console.log('click handler')
  var songItem = getSongItem(targetElement);
  
  if (currentlyPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
    songItem.innerHTML = playButtonTemplate;
    currentlyPlayingSong = null;
  } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
    currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }
};

window.onload = function () {
  setCurrentAlbum(albumPicasso);
  
  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function (event) {
      var songItem = getSongItem(event.target),
          songItemNumber = songItem.getAttribute('data-song-number');
      
      if (songItemNumber !== currentlyPlayingSong)
        songItem.innerHTML = songItemNumber;
    });
    
    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }
}

songListContainer.addEventListener('mouseover', function (event) {
  var songItem = getSongItem(event.target);
  
  if (songItem.parentElement.className === 'album-view-song-item')
    songItem.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
    if (songItem.getAttribute('data-song-number') === currentlyPlayingSong)
      songItem.innerHTML = pauseButtonTemplate;
});