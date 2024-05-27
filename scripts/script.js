//Se exporta la clase usuario

import User from './UserClass.js'
import GroceryCart from './GroceryCartClass.js'
import Product from './ProductClass.js'

const cartIcon = document.getElementById("cartIcon")
const userIcon = document.getElementById("userIcon")
const cartModal = document.getElementById("cartModal")
const userModal = document.getElementById("userModal")
const closeUserModal = document.getElementById('closeUserModal')
const closeCartModal = document.getElementById('closeCartModal')


// Modales
function openModal(modal){
    modal.style.display = "block";
}

function closeModal(modal){
    modal.style.display = "none";
}

// Abrir modales
userIcon.addEventListener("click", () => openModal(userModal))
cartIcon.addEventListener("click", () => openModal(cartModal))

// Cerrar modales
closeUserModal.addEventListener("click", () => closeModal(userModal))
closeCartModal.addEventListener("click", () => closeModal(cartModal))


// Cerrar modal por fuera del mismo
window.addEventListener('click', (event) => {
    if (event.target === userModal) {
        closeModal(userModal);
    }
    if (event.target === cartModal) {
        closeModal(cartModal);
    }
})

window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
      document.body.classList.add('sticky-footer');
    } else {
      document.body.classList.remove('sticky-footer');
    }
  });

// Se accede a usuario
let users = JSON.parse(localStorage.getItem("users")) || []

const btnAcceder = document.getElementById("btnAcceder")
btnAcceder.addEventListener("click", () => {
    const mail = document.getElementById("email").value
    const psw = document.getElementById("password").value

    const user = users.find(user => user.email === mail && user.password === psw)

    if (user){
        const helloName = document.getElementById("userIcon")
        helloName.innerHTML = `<p>Hola, ${user.email}</p>`
        closeModal(userModal)
    }
    else{
        let us = new User(mail, psw)

        users.push(us)
        localStorage.setItem("users", JSON.stringify(users))
    }
})


// Se carga la página
let productos = JSON.parse(localStorage.getItem("productos")) || []
const divProductos = document.getElementById("container-products")

const main = () => {
    productos.forEach(produ => {
        const div = document.createElement("div")
        div.innerHTML = `
        <div class="product">
                <h3>${produ.name}</h3>
                <p>${produ.type}</p>
        </div>`
        divProductos.appendChild(div)
    })
}

main()