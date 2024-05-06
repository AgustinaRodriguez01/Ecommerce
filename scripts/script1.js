const productos = [];

/*NOTA: en un futuro la lógica se va a mantener, pero se van a crear como objetos*/

function crearProducto(){
    let name = prompt("Ingrese el producto (ej. teclado, mouse, etc)");
    let price = prompt("Ingrese el precio del producto");
    let stock = prompt("Ingrese la cantidad de stock del producto");

    let producto = {name: name, price: price, stock: stock};
    productos.push(producto);
    alert("El producto " + producto.name + " ha sido creado correctamente");
}

function listarProductos(){
    for (const producto of productos){
        console.table(producto);
    }
}

function buscarProducto(nombre){
    for (const producto of productos){
        if (producto.name === nombre){
            return producto;
        }
    }
}

function descontarStock(producto, cant){
    producto.stock -= cant;
    alert("El stock es ahora de: " + producto.stock);
}

function main(){
    let band = true;
    let carrito = [];
    while(band === true){
        let op = parseInt(prompt("1. Desea crear un producto, 2. Desea ver todos los productos, 3. Crear carrito"));

        switch (op){
            case 1:
                crearProducto();
                break;
            case 2:
                listarProductos();
                break;
            case 3:
                let nombre = prompt("Ingrese el nombre del producto que desea agregar al carrito");
                let producto = buscarProducto(nombre);
                let cant = prompt("Ingrese la cantidad de productos que desea agregar al carrito");
                descontarStock(producto, cant);
                carrito.push({producto, cant});
                break;
            default:
                alert("Elija una opcion valida");
                break;
        }
        band = confirm("¿Desea seguir en el menu?");
    }
}

main();