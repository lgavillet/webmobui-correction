import { audioPlayer, playSong, currentSong, playNextSong, playPreviousSong } from '../player.js'
import formatTimestamp from '../lib/formatTimestamp'

customElements.define("page-player", class extends HTMLElement {
  // Attributs utilisés par le player
  // Song infos
  playerThumbnail
  playerSongTitle
  playerArtistName

  // Controls
  playerPrev
  playerNext
  playerPlay
  playerPlayIcon

  // Progress
  playerTimeCurrent
  playerTimeDuration
  playerProgress

  connectedCallback() {
    this.innerHTML = `
      <div id="player">
        <div id="player-thumbnail">
          <!-- utiliser l'id de cet élément pour changer la cover de la chanson -->
          <img src="http://placecats.com/200/300" id="player-thumbnail-image" />
        </div>

        <div id="player-infos">
          <div id="player-infos-song">
            <span class="material-icons">music_note</span>
            <!-- utiliser l'id de cet élément pour changer le titre de la chanson -->
            <span id="player-infos-song-title">
              -
            </span>
          </div>

          <div id="player-infos-artist">
            <span class="material-icons">person</span>
            <!-- utiliser l'id de cet élément pour changer le nom de l'artiste -->
            <span id="player-infos-artist-name">
              -
            </span>
          </div>
        </div>

        <div id="player-controls">
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur précédent -->
          <button type="button" class="player-control player-control-small" id="player-control-previous">
            <span class="material-icons">skip_previous</span>
          </button>
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur play/pause -->
          <button type="button" class="player-control" id="player-control-play">
            <span class="material-icons">play_arrow</span>
          </button>
          <!-- utiliser l'id de cet élément pour ajouter un listener pour le click sur suivant -->
          <button type="button" class="player-control player-control-small" id="player-control-next">
            <span class="material-icons">skip_next</span>
          </button>
        </div>

        <div id="player-progress">
          <input type="range" id="player-progress-bar" />
          <div id="player-times">
            <!-- utiliser l'id de cet élément pour changer le temps écoulé -->
            <span id="player-time-current">--:--</span>
            <!-- utiliser l'id de cet élément pour changer la durée totale -->
            <span id="player-time-duration">--:--</span>
          </div>
        </div>
      </div>
      `

    // Déclaration de tous les différents sélecteurs pour utilisation ultérieure
    // Song infos
    this.playerThumbnail = this.querySelector('#player-thumbnail-image')
    this.playerSongTitle = this.querySelector('#player-infos-song-title')
    this.playerArtistName = this.querySelector('#player-infos-artist-name')

    // Controls
    this.playerPrev = this.querySelector('#player-control-previous')
    this.playerNext = this.querySelector('#player-control-next')
    this.playerPlay = this.querySelector('#player-control-play')
    this.playerPlayIcon = this.playerPlay.querySelector('.material-icons') // see what i did there?

    // Progress
    this.playerTimeCurrent = this.querySelector('#player-time-current')
    this.playerTimeDuration = this.querySelector('#player-time-duration')
    this.playerProgress = this.querySelector('#player-progress-bar')

    this.bindEvents()
  }

  // Cette fonction a pour but de connecter les différents évenements (privilégier plusieurs petites fonctions
  // qu'une seule grande)
  bindEvents() {
    // On bind proprement le this
    this.updatePlayerInfos = this.updatePlayerInfos.bind(this)
    this.updatePlayButton = this.updatePlayButton.bind(this)

    // Dès que le tag audio a chargé une nouvelle chanson, il y a potentiellement eu un
    // playSong qui a modifié le 'src'. Le tag va alors charger le mp3 et une fois fini,
    // il va nous avertir du chargement. Hop, mise à jour.
    audioPlayer.addEventListener('loadeddata', this.updatePlayerInfos)

    // A la création de la page player, on met également la UI à jour, car il se peut qu'une
    // chanson soit déjà en lecture en arrière-plan et qu'il faille juste récupérer la valeur
    // en cours
    this.updatePlayerInfos()
    this.updatePlayButton()

    // On écoute le clique sur le bouton play et on transmets l'instruction au player
    this.playerPlay.addEventListener('click', () => {
      if (audioPlayer.paused)
        audioPlayer.play()
      else
        audioPlayer.pause()
    })

    // Bouton précédent
    this.playerPrev.addEventListener('click', playPreviousSong)

    // Bouton suivant
    this.playerNext.addEventListener('click', playNextSong)

    // Lorsque l'on click sur la barre de progression, on change sa valeur et elle émet donc un événement "change" pour
    // avertir de son changement. Comme on a défini la valeur max comme étant la durée totale de la chanson, toute valeur
    // transmise est forcément incluse dans cet interval. On peut alors la passer au player sans problème
    this.playerProgress.addEventListener('change', (event) => {
      audioPlayer.currentTime = event.currentTarget.value
    })

    // Lorsque la chanson est en cours de lecture, l'événement "timeupdate" sera envoyé plusieurs fois par seconde
    // pour avertir de l'avancée dans la lecture. C'est cet événement qui nous permet de bouger la barre de progression
    // au fur et à mesure que la chanson se lit.
    audioPlayer.addEventListener('timeupdate', () => {
      // On récupère la valeur "currentTime" qui est la position dans la chanson au sein du player et on la transmets
      // à la progress bar comme étant sa valeur. La progress bar a comme valeur minimum 0 et comme valeur max la durée
      // totale de la chanson. En lui passant le currrentTime, il sera forcément entre le min et le max et le browser
      // pourra afficher la petite boule au bon endroit
      this.playerProgress.value = audioPlayer.currentTime
      // On affiche la position de lecture, grâce à la fonction de formattage du temps
      this.playerTimeCurrent.innerText = formatTimestamp(audioPlayer.currentTime)
    })

    // Lorsque le player se met en lecture, il émet un évent "play" pour annoncer le début de lecture. Dans ce cas,
    // on change l'icône du bouton play à pause
    //
    // Pourquoi faire ça ici et non dans le "click" sur le bouton ? :) Que se passe-t-il si vous utilisez le bouton
    // "play/pause" natif qui se trouve sur votre clavier ? Cela va mettre en pause la chanson, mais l'événement "click"
    // du bouton play/pause ne sera pas émis, donc icône pas mis à jour, car vous avez utilisez votre clavier et
    // non le bouton.
    // En revanche, lorsque votre OS reçoit le click sur le clavier, il trouve l'application qui émet du son (en l'occ.
    // notre browser) et lui demande d'arrêter. Le browser va chercher quel élément audio lis actuellement de la musique
    // et va faire un "audioPlayer.pause()". Les évenements play/pause seront donc transmis et c'est pour cela qu'il est
    // mieux de gérer le changement d'icône ici
    audioPlayer.addEventListener('play', this.updatePlayButton)

    // Lorsque le player pause la lecture, il émet un évent "pause" pour annoncer le pause de lecture. Dans ce cas,
    // on change l'icône du bouton pause à play
    // voir commentaire précédent
    audioPlayer.addEventListener('pause', this.updatePlayButton)

  }

  // Se charge de mettre à jour les différentes infos de la plage player, d'après la chanson
  // en cours
  updatePlayerInfos() {
    if (!currentSong) return
    // Remplacement des différentes informations au sein des tags
    this.playerSongTitle.innerText = currentSong.title
    this.playerArtistName.innerText = currentSong.artist.name
    this.playerThumbnail.src = currentSong.artist.image_url

    // On défini la valeur maximum du slider de la chanson comme étant sa durée en secondes
    this.playerProgress.max = audioPlayer.duration
    // On affiche la durée totale, grâce à la fonction de formattage du temps
    this.playerTimeDuration.innerText = formatTimestamp(audioPlayer.duration)
  }

  // Se charge de mettre à jour l'icone du bouton play
  updatePlayButton() {
    if (audioPlayer.paused)
      this.playerPlayIcon.innerText = 'play_arrow'
    else
      this.playerPlayIcon.innerText = 'pause'

  }
})
