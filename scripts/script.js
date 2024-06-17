// Importar las clases creadas y los productos de ejemplo
import User from './UserClass.js';
import Product from './ProductClass.js';

// Variable global para guardar el usuario que inició sesión
let userActivo = null;

// Elementos para manejo de modales
const cartIcon = document.getElementById("cartIcon");
const userIcon = document.getElementById("userIcon");
const cartModal = document.getElementById("cartModal");
const userModal = document.getElementById("userModal");
const closeUserModal = document.getElementById('closeUserModal');
const closeCartModal = document.getElementById('closeCartModal');

// Modales
function openModal(modal) {
    modal.style.display = "block";
}

function closeModal(modal) {
    modal.style.display = "none";
}

// Abrir modales
userIcon.addEventListener("click", () => openModal(userModal));
cartIcon.addEventListener("click", () => openModal(cartModal));

// Cerrar modales
closeUserModal.addEventListener("click", () => closeModal(userModal));
closeCartModal.addEventListener("click", () => closeModal(cartModal));

// Cerrar modal por fuera del mismo
window.addEventListener('click', (event) => {
    if (event.target === userModal) {
        closeModal(userModal);
    }
    if (event.target === cartModal) {
        closeModal(cartModal);
    }
});

/* MANEJO DE USUARIOS */
const inicioExitoso = (user) => {
    const helloName = document.getElementById("userIcon");
    helloName.innerHTML = `<p>Hola, ${user.email}</p>`;
    closeModal(userModal);
    userActivo = Object.assign(new User(), user);
    actualizarCarrito();
}

const btnAcceder = document.getElementById("btnAcceder");

btnAcceder.addEventListener("click", () => {
    const mail = document.getElementById("email").value;
    const psw = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === mail && user.password === psw);

    if (user) {
        inicioExitoso(user);
        Swal.fire({
            title: 'Perfecto!',
            text: 'Has iniciado sesión con una cuenta ya creada',
            icon: 'success'
        });
    } else {
        let newUser = new User(mail, psw);
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        inicioExitoso(newUser);
        Swal.fire({
            title: 'Perfecto!',
            text: 'Se ha creado un nuevo usuario',
            icon: 'success'
        });
    }
});

const replicarCarrito = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === userActivo.email);
    if (userIndex !== -1) {
        users[userIndex].carrito = userActivo.carrito;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

/* MANEJO DE PRODUCTOS */
const divProductos = document.getElementById("container-products");

const main = async () => {
    filtrarProductos("Todos");
}

const traerProductos = async () => {
    try {
        const respuesta = await fetch('./scripts/Productos.json');
        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error('Error al cargar los productos: ', error);
    }
}

// Filtrar productos según lo pedido
const todosLink = document.getElementById("todosLink");
const mousesLink = document.getElementById("mousesLink");
const tecladosLink = document.getElementById("tecladosLink");
const monitoresLink = document.getElementById("monitoresLink");

const filtrarProductos = async (tipo) => {
    const productos = await traerProductos();

    divProductos.innerHTML = '';
    let productosFiltrados;

    if (tipo === "Todos") {
        productosFiltrados = productos;
    } else {
        productosFiltrados = productos.filter(prod => prod.type === tipo);
    }

    productosFiltrados.forEach(prod => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="product">
            <h3>${prod.name}</h3>
            <p>${prod.type}</p>
            <p>Precio: ${prod.price}</p>
            <button id="btnAgregar_${prod.name}" class="btn-agregar-producto">Agregar al carrito</button>
        </div>`;
        divProductos.appendChild(div);

        const btnAgregar = document.getElementById(`btnAgregar_${prod.name}`);
        btnAgregar.addEventListener("click", () => {
            agregarProductoAlCarrito(prod.name);
        });
    });
}

todosLink.addEventListener("click", () => { filtrarProductos("Todos") });
mousesLink.addEventListener("click", () => { filtrarProductos("Mouse") });
tecladosLink.addEventListener("click", () => { filtrarProductos("Teclado") });
monitoresLink.addEventListener("click", () => { filtrarProductos("Monitor") });

/* MANEJO DEL CARRITO */
const agregarProductoAlCarrito = async (productoNombre) => {
    const productos = await traerProductos();

    const producto = productos.find(p => p.name === productoNombre);
    if (producto && userActivo) {
        agregarCarritoCliente(producto);
        actualizarCarrito();
        Swal.fire({
            title: 'Perfecto!',
            text: 'Se ha agregado el producto al carrito',
            icon: 'success'
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Debes iniciar sesión para agregar productos al carrito',
            icon: 'error'
        });
    }
}

const agregarCarritoCliente = (product) => {
    const existingProduct = userActivo.carrito.find(p => p.product.name === product.name);
    if (existingProduct) {
        existingProduct.cant += 1;
    } else {
        userActivo.carrito.push({ product, cant: 1 }); // La cantidad inicial es 1
    }
    replicarCarrito();
}

const EliminarProductCarrito = (product) => {
    userActivo.carrito = userActivo.carrito.filter(p => p.product.name !== product.name);
    replicarCarrito();
}

const actualizarCarrito = () => {
    const cartProductsDiv = document.getElementById('cartProducts');
    const cartSummaryDiv = document.querySelector('.cart-summary');
    cartProductsDiv.innerHTML = '';
    cartSummaryDiv.innerHTML = '<h3>Resumen del Pedido</h3>';

    let total = 0;

    if (userActivo) {
        userActivo.carrito.forEach(({ product, cant }) => {
            const div = document.createElement('div');
            div.classList.add('cart-product');
            div.innerHTML = `
                <p>Producto: ${product.name}</p>
                <p>Cantidad: ${cant}</p>
                <p>Precio unitario: $${product.price.toFixed(2)}</p>
                <button id="btnDelete_${product.name}" class="btn-eliminar-producto">Eliminar</button>
            `; 
            cartProductsDiv.appendChild(div);

            const btnEliminar = document.getElementById(`btnDelete_${product.name}`);
            btnEliminar.addEventListener('click', () => {
                EliminarProductCarrito(product);
                actualizarCarrito();
            });

            const summaryItem = document.createElement('p');
            const subtotal = product.price * cant;
            total += subtotal;
            summaryItem.textContent = `${product.name} x${cant}: $${subtotal.toFixed(2)}`;
            cartSummaryDiv.appendChild(summaryItem);
        });

        const btnVaciarCarrito = document.createElement('button');
        btnVaciarCarrito.innerHTML = `<button id="btnVaciarCarrito" class="btn-vaciar-carrito">Vaciar Carrito</button>`
        btnVaciarCarrito.addEventListener('click', () => {
            userActivo.carrito = [];
            replicarCarrito();
            actualizarCarrito();
        });
        cartProductsDiv.appendChild(btnVaciarCarrito);
    }

    const totalDiv = document.createElement('p');
    totalDiv.innerHTML = `<hr><p>Total: $${total.toFixed(2)}</p>`;
    const btnPagar = document.createElement('button');
    btnPagar.classList.add('pay-button');
    btnPagar.textContent = 'Pagar';
    cartSummaryDiv.appendChild(totalDiv);
    cartSummaryDiv.appendChild(btnPagar);

    btnPagar.addEventListener('click', async () => {
        if (userActivo.carrito.length > 0) {
            // Elegir método de pago
            const inputOptions = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        "Transferencia": "Transferencia",
                        "Débito": "Débito",
                        "Crédito": "Crédito"
                    });
                }, 1000);
            });
            const { value: metodoPago } = await Swal.fire({
                title: "Seleccione un método de pago",
                input: "radio",
                inputOptions,
                inputValidator: (value) => {
                    if (!value) {
                        return "Debe elegir un método de pago";
                    }
                }
            });
            if (metodoPago) {
                Swal.fire({ html: `Has seleccionado: ${metodoPago}` });
            }

            // Validar la compra
            const result = await Swal.fire({
                title: "Desea confirmar la compra?",
                icon: "warning",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                width:400,
                timer:5000,
                position:"center",
                padding:"20px",
                color:"#fff",
                background:"#000",
            })
            if(result.isConfirmed){
                Swal.fire({
                    title: 'Compra realizada con éxito!',
                    text: 'Gracias por su compra',
                    icon: 'success'
                });
                
                closeModal(cartModal);

                // Vaciar carrito
                userActivo.carrito = [];
                replicarCarrito();
                actualizarCarrito();
            }
        }
        else {
            Swal.fire({
                title: 'Error',
                text: 'No hay productos en el carrito',
                icon: 'error'
            });
        }
        
    })
}

// Se carga la página principal
main();