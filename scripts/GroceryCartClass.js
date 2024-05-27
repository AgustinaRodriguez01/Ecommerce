class GroceryCart {

    static id = 0;

    constructor(){
        this.id = GroceryCart.id++;
    }

    addProduct = function(product, cant){
        this.products.push({product, cant});
        product.decreaseStock(cant);
    }

    deleteProduct = function(product, cant){
        let index = this.products.indexOf(product);
        this.products.splice(index, 1);
        product.increaseStock(cant);
    }
}

export default GroceryCart