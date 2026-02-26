customElements.define("page-home", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h1 class="hero">Bienvenue</h1>
      <h4>Playlists</h4>
    `
  }
})
