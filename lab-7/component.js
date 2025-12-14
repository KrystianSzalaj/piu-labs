// Tworzymy szablon (HTML + CSS) dla Shadow DOM
const template = document.createElement('template');

template.innerHTML = `
  <style>
    /* --- Style lokalne komponentu (izolowane) --- */
    :host {
      display: block;
      font-family: 'Open Sans', sans-serif;
    }

    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    /* --- Sekcja zdjęcia --- */
    .image-container {
      position: relative;
      width: 100%;
      padding-top: 125%; /* Aspect ratio 4:5 dla odzieży */
      background-color: #f3f4f6;
      overflow: hidden;
    }

    /* Slot na obrazek */
    ::slotted(img[slot="image"]) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    
    .card:hover ::slotted(img[slot="image"]) {
      transform: scale(1.05);
    }

    /* Slot na promocję (badge) - pozycjonowanie absolutne */
    .promo-container {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 10;
    }

    /* --- Sekcja treści --- */
    .content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .header {
      margin-bottom: 0.5rem;
    }

    /* Slot na nazwę */
    ::slotted([slot="name"]) {
      margin: 0;
      font-size: 1.1rem;
      color: #1f2937;
      font-weight: 600;
      display: block;
      margin-bottom: 0.25rem;
    }

    /* Slot na cenę */
    ::slotted([slot="price"]) {
      font-size: 1rem;
      color: #4b5563;
      font-weight: 700;
      display: block;
    }

    /* Opcje (kolory/rozmiary) */
    .options {
      margin-top: auto; /* Pycha opcje na dół sekcji contentu przed przyciskiem */
      padding-top: 1rem;
    }

    .option-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      min-height: 24px; /* Aby zachować układ nawet jak slot jest pusty */
    }

    /* --- Przycisk --- */
    .actions {
      margin-top: 1rem;
    }

    .add-btn {
      width: 100%;
      background-color: #111;
      color: #fff;
      border: none;
      padding: 0.75rem;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .add-btn:hover {
      background-color: #333;
    }

    .add-btn:active {
      transform: scale(0.98);
    }
  </style>

  <div class="card">
    
    <div class="image-container">
      <div class="promo-container">
        <slot name="promo"></slot>
      </div>
      <slot name="image"></slot>
    </div>

    <div class="content">
      <div class="header">
        <slot name="name"></slot>
        <slot name="price"></slot>
      </div>

      <div class="options">
        <div class="option-row">
           <slot name="colors"></slot>
        </div>
        <div class="option-row">
           <slot name="sizes"></slot>
        </div>
      </div>

      <div class="actions">
        <button class="add-btn">Do koszyka</button>
      </div>
    </div>
  </div>
`;

class ProductCard extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.add-btn').addEventListener('click', () => {
      const nameEl = this.querySelector('[slot="name"]');
      const name = nameEl ? nameEl.innerText : 'Produkt';
      alert(`Dodano do koszyka: ${name}`);
    });
  }
}

customElements.define('product-card', ProductCard);