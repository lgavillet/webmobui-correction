import { getArtists } from '../api.js'

customElements.define("page-artists", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h4>Artistes</h4>

      <artist-list>
      </artist-list>
    `
    const artistList = this.querySelector('artist-list')

    // Itérer le tableau d'artistes reçus et créer les éléments correspondants
    getArtists()
      .then((artists) => {
        artists.forEach((artist) => {
          // V1
          // // Créer l'élément
          // const artistItem = document.createElement('artist-cover')

          // // Mettre les attributs
          // artistItem.setAttribute('image-url', artist.image_url)
          // artistItem.setAttribute('name', artist.name)
          // artistItem.setAttribute('href', `#artists/${artist.id}`)

          // // Insérer dans la liste
          // artistList.append(artistItem)

          // V2
          artistList.innerHTML += `<artist-cover href="#artists/${artist.id}" title="${artist.name}" cover="${artist.image_url}" />`
        })
      })
  }
})
