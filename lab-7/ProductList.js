import { ProductCard } from './ProductCard.js'; // Import, by upewnić się że jest zdefiniowany

export class ProductList extends HTMLElement {
  constructor() {
    super();
    // Używamy otwartego Shadow DOM lub po prostu appendujemy do this (Light DOM).
    // Tutaj dla izolacji stylów siatki użyjemy Shadow DOM.
    this.attachShadow({ mode: 'open' });
  }

  set products(list) {
    this._products = list;
    this.render();
  }

  render() {
    // Style siatki
    this.shadowRoot.innerHTML = `
      <style>
        :host {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
        }
      </style>
    `;

    // Generowanie kart
    this._products.forEach(product => {
      const card = document.createElement('product-card');
      // KLUCZOWE: Ustawiamy właściwość (property), a nie atrybut HTML
      card.data = product; 
      this.shadowRoot.appendChild(card);
    });
  }
}

customElements.define('product-list', ProductList);