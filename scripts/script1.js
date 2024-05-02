const usuarios = [];

/*NOTA: decidí que por ahora solo haré los usuarios con arrays, porque en el futuro serán los usuarios, los productos a vender, el carrito creados con objects*/

function crearUsuario(){
    let fullName = prompt("Ingrese su nombre y apellido");
    let email = prompt("Ingrese su email");

    let usuario = {name: fullName, email: email};
    usuarios.push(usuario);
    alert("El usuario " + usuario.name + " ha sido creado correctamente");
}

function listarUsuarios(){
    for (const usuario of usuarios){
        console.table(usuarios);
    }
}

function main(){
    let band = true;
    while(band === true){
        let op = parseInt(prompt("1. Desea crear un usuario, 2. Desea ver los usuarios"));

        switch (op){
            case 1:
                crearUsuario();
                break;
            case 2:
                listarUsuarios();
                break;
            default:
                alert("Elija una opcion valida");
                break;
        }
        band = confirm("¿Desea seguir en el menu?");
    }
}

main();