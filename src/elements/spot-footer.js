customElements.define("spot-footer", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <a href="#home" class="active">
          <span class="material-icons">home</span>
          <span>Home</span>
        </a>
        <a href="#player">
          <span class="material-icons">subscriptions</span>
          <span>Lecteur</span>
        </a>
        <a href="#artists">
          <span class="material-icons">library_music</span>
          <span>Musique</span>
        </a>
        <a href="#favorites">
          <span class="material-icons">favorite</span>
          <span>Favoris</span>
        </a>
      </nav>
    `

    // On bind l'event hashchange + le bon this à la method hashChange
    // De cette manière, ce sera mis à jour lors d'un changement de hash
    this.hashChange = this.hashChange.bind(this)
    window.addEventListener("hashchange", this.hashChange)

    // on appelle une fois à vide à la création de l'élément pour mettre le bon
    // icône en surbrillance
    this.hashChange()
  }

  hashChange() {
    // on prend la première partie du hash
    const current = window.location.hash.split('/')[0]

    // on cherche l'élément actif, si on le trouve, la classe "active" est enlevée
    this.querySelector(`nav a.active`)?.classList.remove('active')

    // on cherche le nouvel élément correspondant à l'url en cours et si on le trouve,
    // la classe "active" est ajoutée
    this.querySelector(`nav a[href="${current}"]`)?.classList.add('active')
  }
})
