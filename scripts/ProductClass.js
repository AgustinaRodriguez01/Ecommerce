class Product {

    static id = 1;

    constructor(name, type, price, stock){
        this.id = Product.id++;
        this.name = name;
        this.type = type;
        this.price = price;
        this.stock = stock;
    }

    decreaseStock = function(cant){
        this.stock -= cant;
    }

    increaseStock = function(cant){
        this.stock += cant;
    }

}

export default Product