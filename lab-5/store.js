// store.js
import { generateId, getRandomColor } from './helpers.js';

export default class Store {
    constructor() {
        this.observers = [];
        this.state = {
            shapes: []
        };
        
        this.loadState();
    }


    subscribe(observer) {
        this.observers.push(observer);
    }

    notify(action, payload) {
        this.observers.forEach(observer => observer.update(action, payload));
        this.saveState(); 
    }


    addShape(type) {
        const newShape = {
            id: generateId(),
            type: type, 
            color: getRandomColor()
        };

        this.state.shapes.push(newShape);
        this.notify('ADD_SHAPE', newShape);
    }

    removeShape(id) {
        this.state.shapes = this.state.shapes.filter(shape => shape.id !== id);
        this.notify('REMOVE_SHAPE', id);
    }

    recolorShapes(typeToRecolor) {
        this.state.shapes.forEach(shape => {
            if (shape.type === typeToRecolor) {
                shape.color = getRandomColor();
            }
        });
        
        this.notify('RECOLOR_TYPE', typeToRecolor);
    }


    getShapes() {
        return this.state.shapes;
    }

    getCounts() {
        return {
            squares: this.state.shapes.filter(s => s.type === 'square').length,
            circles: this.state.shapes.filter(s => s.type === 'circle').length
        };
    }

    // --- LocalStorage ---

    saveState() {
        try {
            localStorage.setItem('shapesAppDate', JSON.stringify(this.state.shapes));
        } catch (e) {
            console.error("Błąd zapisu do localStorage", e);
        }
    }

    loadState() {
        try {
            const saved = localStorage.getItem('shapesAppDate');
            if (saved) {
                this.state.shapes = JSON.parse(saved);
            }
        } catch (e) {
            console.error("Błąd odczytu localStorage", e);
            this.state.shapes = [];
        }
    }
}