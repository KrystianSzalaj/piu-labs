// ui.js

export default class UI {
    constructor(store) {
        this.store = store;
        
        this.container = document.getElementById('shapes-container');
        this.squareCountEl = document.getElementById('count-squares');
        this.circleCountEl = document.getElementById('count-circles');

        this.initButtons();
        
        this.initDelegation();

        this.store.subscribe(this);

        this.initialRender();
    }

    initButtons() {
        document.getElementById('add-square').addEventListener('click', () => {
            this.store.addShape('square');
        });
        document.getElementById('add-circle').addEventListener('click', () => {
            this.store.addShape('circle');
        });
        document.getElementById('recolor-squares').addEventListener('click', () => {
            this.store.recolorShapes('square');
        });
        document.getElementById('recolor-circles').addEventListener('click', () => {
            this.store.recolorShapes('circle');
        });
    }

    initDelegation() {
        this.container.addEventListener('click', (e) => {
            const shapeEl = e.target.closest('.shape');
            
            if (shapeEl && shapeEl.dataset.id) {
                this.store.removeShape(shapeEl.dataset.id);
            }
        });
    }

    update(action, payload) {
        switch (action) {
            case 'ADD_SHAPE':
                this.appendShapeToDOM(payload);
                break;
            case 'REMOVE_SHAPE':
                this.removeShapeFromDOM(payload);
                break;
            case 'RECOLOR_TYPE':
                this.updateColorsInDOM(payload);
                break;
        }
        this.updateCounters();
    }


    appendShapeToDOM(shape) {
        const el = document.createElement('div');
        el.classList.add('shape', shape.type);
        el.dataset.id = shape.id;
        el.dataset.type = shape.type;
        el.style.backgroundColor = shape.color;
        
        this.container.appendChild(el);
    }

    removeShapeFromDOM(id) {
        const el = this.container.querySelector(`[data-id="${id}"]`);
        if (el) {
            el.remove();
        }
    }

    updateColorsInDOM(type) {
        const shapesInStore = this.store.getShapes();
        const domElements = this.container.querySelectorAll(`[data-type="${type}"]`);

        domElements.forEach(el => {
            const id = el.dataset.id;
            const shapeData = shapesInStore.find(s => s.id === id);
            if (shapeData) {
                el.style.backgroundColor = shapeData.color;
            }
        });
    }

    updateCounters() {
        const counts = this.store.getCounts();
        this.squareCountEl.textContent = counts.squares;
        this.circleCountEl.textContent = counts.circles;
    }

    initialRender() {
        this.container.innerHTML = '';
        const shapes = this.store.getShapes();
        shapes.forEach(shape => this.appendShapeToDOM(shape));
        this.updateCounters();
    }
}