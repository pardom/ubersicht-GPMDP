command: 'cat ~/Library/Application\\ Support/Google\\ Play\\ Music\\ Desktop\\ Player/json_store/playback.json',

refreshFrequency: 500,

render: function (output) {
  return `
    <div id='container'>
      <div id='controls'>
        <img id='prev' src='GPMDP.widget/images/ic_skip_previous.svg' /></a>
        <img id='play' src='GPMDP.widget/images/ic_play_arrow.svg' />
        <img id='pause' src='GPMDP.widget/images/ic_pause.svg' />
        <img id='next' src='GPMDP.widget/images/ic_skip_next.svg' />
      </div>
      <div id='overlay'>
        <span id='artist'></span>
        <span id='album'></span>
        <span id='title'></span>
        <div id='progress' />
      </div>
    </div>
  `;
},

update: function(output, domEl) {
  function normalizeAlbumArtUrl(url) {
    if (url == null) return '';
    let dimenPart = url.lastIndexOf('=');
    let end = dimenPart >= 0 ? dimenPart : url.length;
    return url.substring(0, end);
  }

  try {
    let state = JSON.parse(output);
    let active = state.time.total > 0;
    let progress = (state.time.current / state.time.total) * 100;
    let albumArt = normalizeAlbumArtUrl(state.song.albumArt);

    // Visibility
    domEl.style.display = active ? 'initial' : 'none';

    // Controls
    domEl.querySelector('#play').style.display = state.playing ? 'none' : 'initial';
    domEl.querySelector('#pause').style.display = state.playing ? 'initial' : 'none';

    // Overlay
    domEl.querySelector('#container').style.backgroundImage = `url('${albumArt}')`;
    domEl.querySelector('#artist').innerText = state.song.artist;
    domEl.querySelector('#album').innerText = state.song.album;
    domEl.querySelector('#title').innerText = state.song.title;
    domEl.querySelector('#progress').style.width = `${progress}%`;
  } catch (err) {
    // Failure to parse
  }
},

style: `
  top: 10px
  left: 10px

  #container
    display: flex
    flex-direction: column
    overflow: hidden

    height: 350px
    width: 350px

    background-color: rgba(0, 0, 0, 0.8)
    background-size: cover

    border-radius: 8px
    box-shadow: 0px 25px 50px 0px rgba(0, 0, 0, 0.6)

    color: #FFF
    font-family: -apple-system
    font-size: 16px

  span
    display: block
    padding: 2px 10px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    color: rgba(255, 255, 255, 0.8)

  span#album
    font-style: italic
    color: rgba(255, 255, 255, 0.6)

  span#title
    font-weight: bold
    font-size: 24px
    color: rgba(255, 255, 255, 1)
    padding: 5px 10px 15px 10px

  #controls
    display: flex
    flex-direction: row
    justify-content: space-around
    flex: 1
    padding: 20px 50px

    background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);

    opacity: 0

    img
      height: 50px

  #container:hover #controls
      opacity: 1
      transition: all 0.2s ease-in-out;

  #overlay
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
    padding-top: 100px

  #progress
    height: 8px
    background-color: rgba(255, 255, 255, 0.8)
`
