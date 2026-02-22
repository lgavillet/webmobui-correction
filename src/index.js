import './elements/artist-cover.js'

import { getArtists } from './api.js'

getArtists()
  .then((artists) => {
    const list = document.querySelector('.artist-list')
    list.innerHTML = ''

    artists.forEach((artist) => {
      // const element = document.createElement('artist-cover')
      // element.setAttribute('title', artist.name)
      // element.setAttribute('cover', artist.image_url)
      // list.append(element)

      // ou aussi... ;)
      list.innerHTML += `<artist-cover title="${artist.name}" cover="${artist.image_url}" />`
    })
  })
