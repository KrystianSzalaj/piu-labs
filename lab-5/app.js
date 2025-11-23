// app.js
import Store from './store.js';
import UI from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const store = new Store();
    const ui = new UI(store);

    console.log('Aplikacja Kształty (Lab-5) gotowa.');
});