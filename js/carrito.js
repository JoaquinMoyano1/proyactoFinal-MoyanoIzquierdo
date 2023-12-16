let cartStorage = localStorage.getItem("cartProducts");

cartStorage = JSON.parse(cartStorage);

let cartContainer = document.getElementById("cartSection");
let totalContainer = document.getElementById("totalSection");

function groupAndCountProducts(cartItems) {
    const productMap = new Map();

    cartItems.forEach(producto => {
        const productId = producto.id;

        if (productMap.has(productId)) {
            const existingProduct = productMap.get(productId);
            existingProduct.quantity += 1;
        } else {
            productMap.set(productId, { ...producto, quantity: 1 });
        }
    });

    return Array.from(productMap.values());
}

function renderCarrito(cartItems) {
    let total = 0;

    // Actualiza el contador en el icono del carrito
    const cartItemCount = document.getElementById("cartItemCount");
    cartItemCount.innerText = cartItems.reduce((sum, producto) => sum + producto.quantity, 0);

    cartItems.forEach(producto => {
        const cart = document.createElement("div");
        cart.innerHTML = `
        
            <img src=${producto.imagen} class="card-img-top" alt=${producto.alt}>
            
            <h3>${producto.nombre} x${producto.quantity}</h3>
            <p>$${producto.precio * producto.quantity}</p>
            <button class="increment" data-id="${producto.id}">+</button>
            <button class="decrement" data-id="${producto.id}">-</button>
            <button class="btn button mb-5 is-responsive is-primary is-outlined delete-button" data-id="${producto.id}">Quitar del carrito</button>
            
            `;
        cartContainer.appendChild(cart);

        total += producto.precio * producto.quantity;
    });

    const totalElement = document.createElement("div");
    totalElement.innerHTML = `<h3>Total:</h3>
                              <p>$${total}</p>`;
    totalContainer.appendChild(totalElement);

    const incrementButtons = document.querySelectorAll(".increment");
    const decrementButtons = document.querySelectorAll(".decrement");
    const deleteButtons = document.querySelectorAll(".delete-button");

    incrementButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.dataset.id);
            updateQuantity(productId, 1);
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.dataset.id);
            updateQuantity(productId, -1);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.dataset.id);
            deleteProduct(productId);
        });
    });
}

// Agrega el botón a la variable de referencia
const clearCartButton = document.getElementById("clearCartButton");

// Agrega un listener al botón
clearCartButton.addEventListener("click", () => {
    
    // Muestra el aviso de confirmación
    Swal.fire({
        title: "¿Estás seguro de vaciar el carrito?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No",
    }).then((result) => {
        if (result.isConfirmed) {
            clearCart();
        }
    });
});





function updateQuantity(productId, change) {
    const productIndex = groupedCartItems.findIndex(producto => producto.id === productId);

    if (productIndex !== -1) {
        groupedCartItems[productIndex].quantity += change;

        groupedCartItems[productIndex].quantity = Math.max(1, groupedCartItems[productIndex].quantity);

        localStorage.setItem("cartProducts", JSON.stringify(groupedCartItems));

        cartContainer.innerHTML = "";
        totalContainer.innerHTML = "";
        renderCarrito(groupedCartItems);
    }
}




function deleteProduct(productId) {
    groupedCartItems = groupedCartItems.filter(producto => producto.id !== productId);

    localStorage.setItem("cartProducts", JSON.stringify(groupedCartItems));

    cartContainer.innerHTML = "";
    totalContainer.innerHTML = "";
    renderCarrito(groupedCartItems);
}



function clearCart() {
    // Limpia el carrito
    groupedCartItems = [];
    
    // Actualiza el localStorage
    localStorage.removeItem("cartProducts");

    // Actualiza la visualización del carrito
    cartContainer.innerHTML = "";
    totalContainer.innerHTML = "";
    renderCarrito(groupedCartItems);
}

let groupedCartItems = groupAndCountProducts(cartStorage);
renderCarrito(groupedCartItems);
