class Product {

    static id = 1;

    constructor(name, type, price, stock){
        this.id = Product.id++;
        this.name = name;
        this.type = type;
        this.price = price;
        this.stock = stock;
    }

    decreaseStock(cant) {
        if (cant <= this.stock) {
            this.stock -= cant;
        } else {
            console.error(`No hay suficiente stock disponible para ${this.name}`);
        }
    }

    increaseStock(cant) {
        this.stock += cant;
    }

}

export default Product