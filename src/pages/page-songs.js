import { getSongs } from '../api.js'

customElements.define("page-artist-songs", class extends HTMLElement {
  connectedCallback() {
    const artistId = this.getAttribute('artist-id')

    getSongs(artistId)
      .then((songs) => {
        this.innerHTML = `
          <h4>
            Artistes > ${songs[0].artist.name}
          </h4>

          <div class="list">
          </div>
        `
        const songList = this.querySelector('.list')
        // Itérer le tableau d'artistes reçus et créer les éléments correspondants
        songs.forEach((song) => {
          // V1
          // const songItem = document.createElement('song-item')
          // songItem.setAttribute('title', song.title)
          // songList.append(songItem)

          // V2
          songList.innerHTML += `<song-item title="${song.title}" />`
        })
      })
  }
})
