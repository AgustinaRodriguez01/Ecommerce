import Product from './ProductClass.js';

class GroceryCart {

    static id = 0;

    constructor() {
        this.id = GroceryCart.id++;
        this.products = [];
    }

    addProduct(product, cant) {
        const existingProduct = this.products.find(p => p.product.id === product.id);
        if (existingProduct) {
            existingProduct.cant += cant;
        } else {
            this.products.push({ product, cant });
        }
        product.decreaseStock(cant);
    }

    deleteProduct(product, cant) {
        const index = this.products.findIndex(p => p.product.id === product.id);
        if (index !== -1) {
            if (this.products[index].cant > cant) {
                this.products[index].cant -= cant;
            } else {
                this.products.splice(index, 1);
            }
            product.increaseStock(cant);
        }
    }
}

export default GroceryCart;
