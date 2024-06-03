// Importar las clases creadas y los productos de ejemplo
import User from './UserClass.js';
import GroceryCart from './GroceryCartClass.js';
import Product from './ProductClass.js';
import productos from './productos.js';

// Variable global para guardar el usuario que inició sesión
let userActivo = null;

// Elementos para manejo de modales
const cartIcon = document.getElementById("cartIcon");
const userIcon = document.getElementById("userIcon");
const cartModal = document.getElementById("cartModal");
const userModal = document.getElementById("userModal");
const closeUserModal = document.getElementById('closeUserModal');
const closeCartModal = document.getElementById('closeCartModal');
const loginModal = document.getElementById('loginModal');
const productAddedModal = document.getElementById('productAddedModal');
const closeProductAddedModal = document.getElementById('productAddedModal');
const closeLoginModal = document.getElementById('loginModal');

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
closeLoginModal.addEventListener("click", () => closeModal(loginModal));
closeProductAddedModal.addEventListener("click", () => closeModal(productAddedModal));

// Cerrar modal por fuera del mismo
window.addEventListener('click', (event) => {
    if (event.target === userModal) {
        closeModal(userModal);
    }
    if (event.target === cartModal) {
        closeModal(cartModal);
    }
});

const inicioExitoso = (user) => {
    const helloName = document.getElementById("userIcon");
    helloName.innerHTML = `<p>Hola, ${user.email}</p>`;
    closeModal(userModal);
    userActivo = Object.assign(new User(), user);
    if (!userActivo.carrito) {
        userActivo.carrito = new GroceryCart();
    }
}

const btnAcceder = document.getElementById("btnAcceder");

btnAcceder.addEventListener("click", () => {
    const mail = document.getElementById("email").value;
    const psw = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === mail && user.password === psw);

    if (user) {
        inicioExitoso(user);
    } else {
        let user = new User(mail, psw);
        user.carrito = new GroceryCart();
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        inicioExitoso(user);
    }
});

const divProductos = document.getElementById("container-products");

const main = () => {
    filtrarProductos("Todos");
}

// Filtrar productos según lo pedido
const todosLink = document.getElementById("todosLink");
const mousesLink = document.getElementById("mousesLink");
const tecladosLink = document.getElementById("tecladosLink");
const monitoresLink = document.getElementById("monitoresLink");

const filtrarProductos = (tipo) => {
    divProductos.innerHTML = '';
    let productosFiltrados;

    if (tipo === "Todos") {
        productosFiltrados = productos;
    } else {
        productosFiltrados = productos.filter(produ => produ.type === tipo);
    }

    productosFiltrados.forEach(produ => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="product">
            <h3>${produ.name}</h3>
            <p>${produ.type}</p>
            <p>Precio: ${produ.price}</p>
            <button id="btnAgregar_${produ.name}" class="add-to-cart-button">Agregar al carrito</button>
        </div>`;
        divProductos.appendChild(div);

        // Agregar evento al botón de agregar al carrito
        const btnAgregar = document.getElementById(`btnAgregar_${produ.name}`);
        btnAgregar.addEventListener("click", () => {
            agregarProductoAlCarrito(produ.name);
        });
    });
}

todosLink.addEventListener("click", () => { filtrarProductos("Todos") });
mousesLink.addEventListener("click", () => { filtrarProductos("Mouse") });
tecladosLink.addEventListener("click", () => { filtrarProductos("Teclado") });
monitoresLink.addEventListener("click", () => { filtrarProductos("Monitor") });

// Agregar producto al carrito
const agregarProductoAlCarrito = (productoNombre) => {
    const producto = productos.find(p => p.name === productoNombre);
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (producto && userActivo) {
        if (!userActivo.carrito) {
            userActivo.carrito = new GroceryCart();
        }
        addProductToCart(producto);
        actualizarCarrito();
        localStorage.setItem("users", JSON.stringify(users));
        openModal(productAddedModal);
    } else {
        openModal(loginModal);
    }
}

// Agregar producto al carrito (función auxiliar)
const addProductToCart = (product) => {
    const existingProduct = userActivo.carrito.products.find(p => p.product.name === product.name);
    if (existingProduct) {
        existingProduct.cant += 1;
    } else {
        userActivo.carrito.products.push({ product, cant: 1 }); // La cantidad inicial es 1
    }
}

// Eliminar producto del carrito
const deleteProductFromCart = (product, cant) => {
    const index = userActivo.carrito.products.findIndex(p => p.product.id === product.id);
    if (index !== -1) {
        if (userActivo.carrito.products[index].cant > cant) {
            userActivo.carrito.products[index].cant -= cant;
        } else {
            userActivo.carrito.products.splice(index, 1);
        }
        product.increaseStock(cant);
    }
}

// Actualizar carrito
const actualizarCarrito = () => {
    const cartProductsDiv = document.getElementById('cartProducts');
    const cartSummaryDiv = document.querySelector('.cart-summary');
    cartProductsDiv.innerHTML = '';
    cartSummaryDiv.innerHTML = '<h3>Resumen del Pedido</h3>';

    let total = 0;

    if (userActivo && userActivo.carrito) {
        userActivo.carrito.products.forEach(({ product, cant }) => {
            const div = document.createElement('div');
            div.classList.add('cart-product');
            div.innerHTML = `
                <p>Producto: ${product.name}</p>
                <p>Cantidad: ${cant}</p>
                <p>Precio unitario: $${product.price.toFixed(2)}</p>
            `;
            cartProductsDiv.appendChild(div);

            const summaryItem = document.createElement('p');
            const subtotal = product.price * cant;
            total += subtotal;
            summaryItem.textContent = `${product.name} x${cant}: $${subtotal.toFixed(2)}`;
            cartSummaryDiv.appendChild(summaryItem);
        });
    }

    const totalDiv = document.createElement('p');
    totalDiv.innerHTML = `<hr><p>Total: $${total.toFixed(2)}</p>`;
    const btnPagar = document.createElement('button');
    btnPagar.classList.add('pay-button');
    btnPagar.textContent = 'Pagar';
    cartSummaryDiv.appendChild(totalDiv);
    cartSummaryDiv.appendChild(btnPagar);
}

// Se carga la página principal
main();