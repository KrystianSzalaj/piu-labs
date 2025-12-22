import productsData from './data.json' with { type: 'json' };
import './ProductList.js';
import './ShoppingCart.js';
import './ProductCard.js';

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('product-list');
    const shoppingCart = document.querySelector('shopping-cart');

    productList.products = productsData;
    productList.addEventListener('add-to-cart', (e) => {
        const productToAdd = e.detail;
        console.log('Otrzymano zdarzenie add-to-cart:', productToAdd);
        
        shoppingCart.addItem(productToAdd);
    });
});