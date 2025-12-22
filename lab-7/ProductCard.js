const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; font-family: sans-serif; }
    .card {
      background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
      overflow: hidden; display: flex; flex-direction: column; height: 100%;
      transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .image-container { position: relative; padding-top: 125%; background: #f3f4f6; }
    .image-container img {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;
    }
    .badge {
      position: absolute; top: 10px; left: 10px; padding: 4px 8px;
      color: white; font-size: 0.75rem; border-radius: 4px; font-weight: bold;
    }
    .content { padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; }
    h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; }
    .price { font-weight: bold; color: #4b5563; }
    .meta { margin-top: auto; padding-top: 1rem; font-size: 0.85rem; color: #666; }
    button {
      width: 100%; background: #111; color: #fff; border: none; padding: 0.75rem;
      margin-top: 1rem; cursor: pointer; text-transform: uppercase; font-weight: bold;
    }
    button:hover { background: #333; }
  </style>
  <div class="card">
    <div class="image-container">
        <img id="img" src="" alt="">
        <span id="badge" class="badge" style="display:none"></span>
    </div>
    <div class="content">
        <h3 id="name"></h3>
        <span id="price" class="price"></span>
        <div id="meta" class="meta"></div>
        <button id="add-btn">Do koszyka</button>
    </div>
  </div>
`;

export class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._data = null; // Wewnętrzne przechowywanie danych
  }

  connectedCallback() {
    this.shadowRoot.getElementById('add-btn').addEventListener('click', () => {
      // Emitujemy zdarzenie. bubbles: true pozwala mu "wypłynąć" w górę DOM.
      // composed: true pozwala mu przejść przez granicę Shadow DOM.
      this.dispatchEvent(new CustomEvent('add-to-cart', {
        detail: this._data,
        bubbles: true,
        composed: true
      }));
    });
  }

  // Setter dla właściwości 'data'
  set data(product) {
    this._data = product;
    this.render();
  }

  get data() {
    return this._data;
  }

  render() {
    if (!this._data) return;

    // Bindowanie danych do widoku
    const { name, price, image, promo, colors, sizes } = this._data;
    
    this.shadowRoot.getElementById('name').textContent = name;
    this.shadowRoot.getElementById('price').textContent = `${price.toFixed(2)} PLN`;
    this.shadowRoot.getElementById('img').src = image;
    this.shadowRoot.getElementById('img').alt = name;

    // Obsługa promocji
    const badge = this.shadowRoot.getElementById('badge');
    if (promo) {
      badge.textContent = promo;
      badge.style.display = 'block';
      badge.style.backgroundColor = promo === 'NEW' ? '#3b82f6' : '#ef4444';
    } else {
      badge.style.display = 'none';
    }

    // Obsługa meta danych (rozmiary/kolory jako tekst dla uproszczenia)
    const metaDiv = this.shadowRoot.getElementById('meta');
    let metaText = [];
    if (colors) metaText.push(`Kolory: ${colors.length}`);
    if (sizes) metaText.push(`Rozmiary: ${sizes.join(', ')}`);
    metaDiv.textContent = metaText.join(' | ');
  }
}

customElements.define('product-card', ProductCard);