const cartTemplate = document.createElement('template');
cartTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      background: #f9f9f9;
      min-width: 300px;
      font-family: sans-serif;
    }
    h2 { margin-top: 0; border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
    ul { list-style: none; padding: 0; margin: 0; max-height: 400px; overflow-y: auto; }
    li {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.5rem 0; border-bottom: 1px solid #eee;
    }
    li:last-child { border-bottom: none; }
    .item-info { flex-grow: 1; }
    .item-name { font-weight: bold; display: block; font-size: 0.9rem; }
    .item-price { font-size: 0.85rem; color: #666; }
    .remove-btn {
      background: transparent; color: red; border: 1px solid red;
      border-radius: 4px; cursor: pointer; margin-left: 10px; padding: 2px 6px;
    }
    .remove-btn:hover { background: red; color: white; }
    .total {
      margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #ddd;
      font-size: 1.2rem; font-weight: bold; text-align: right;
    }
    .empty-msg { color: #888; text-align: center; padding: 1rem; }
  </style>
  <h2>Twój Koszyk</h2>
  <ul id="cart-items"></ul>
  <div id="empty-msg" class="empty-msg">Koszyk jest pusty</div>
  <div class="total">Suma: <span id="total-price">0.00</span> PLN</div>
`;

export class ShoppingCart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(cartTemplate.content.cloneNode(true));
    this.items = []; // Stan koszyka
  }

  addItem(product) {
    this.items.push(product);
    this.render();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.render();
  }

  render() {
    const listEl = this.shadowRoot.getElementById('cart-items');
    const totalEl = this.shadowRoot.getElementById('total-price');
    const emptyMsg = this.shadowRoot.getElementById('empty-msg');
    
    listEl.innerHTML = '';
    let total = 0;

    if (this.items.length === 0) {
      emptyMsg.style.display = 'block';
    } else {
      emptyMsg.style.display = 'none';
      
      this.items.forEach((item, index) => {
        total += item.price;
        
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="item-info">
            <span class="item-name">${item.name}</span>
            <span class="item-price">${item.price.toFixed(2)} PLN</span>
          </div>
        `;

        const btn = document.createElement('button');
        btn.className = 'remove-btn';
        btn.textContent = 'X';
        btn.onclick = () => this.removeItem(index);
        
        li.appendChild(btn);
        listEl.appendChild(li);
      });
    }

    totalEl.textContent = total.toFixed(2);
  }
}

customElements.define('shopping-cart', ShoppingCart);