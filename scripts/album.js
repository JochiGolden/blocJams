// Added for Checkpoint 25 Assignment

var albumImg = document.getElementsByClassName('album-cover-art')[0],
    currentAlbumID = 0;

var albums = [
  {
    id: 0,
//----------------------------------------------------------------------------
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
  {
    id: 1,
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
// Added for Checkpoint 25 Assignment
  {
    id: 2,
    title: 'Summit',
    artist: 'Mount Hood',
    label: 'Topographic Tunes',
    year: '~498,000 B.C.E',
    albumArtUrl: 'assets/images/album_covers/09.png',
    songs: [
      { title: 'Northern Moss', duration: '0:35' },
      { title: 'Blow-Down Pine', duration: '4:32' },
      { title: 'Saints Around Us', duration: '6:04' },
      { title: 'I Slope to the Sea', duration: '2:45' },
      { title: 'Cratered', duration: '1:53' },
      { title: 'Hot Nights in 1866', duration: '7:44' },
      { title: 'Come Up (From the Mantle)', duration: '4:29' },
      { title: "Nature's Sky Scrapers", duration: '9:05' }
    ]
  }
//----------------------------------------------------------------------------
];

var createSongRow = function (songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;
  
  return template;
};

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
  
// Added for Checkpoint 25 Assignment
  currentAlbumID = album.id;
//----------------------------------------------------------------------------
};

window.onload = function () {
  setCurrentAlbum(albums[0]);
}

// Added for Checkpoint 25 Assignment
albumImg.addEventListener('click', function() {
  
  console.log(currentAlbumID);
  
  if (currentAlbumID < albums.length - 1)
    setCurrentAlbum(albums[currentAlbumID += 1]);
  else
    setCurrentAlbum(albums[0]);
});
//----------------------------------------------------------------------------