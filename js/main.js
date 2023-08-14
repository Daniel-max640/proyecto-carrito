document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(0);

    const selectElement = document.getElementById('opciones'); // Elemento select en tu HTML
    const productsSection = document.querySelector('.section .products'); // Contenedor de productos
    const cartContainer = document.querySelector('.cart-container');
    
    const carritoBtn = document.getElementById('carrito-btn');

    let allProducts = []; // Almacenar todos los productos
    let closeModalBtn = document.querySelector('.close-modal'); // Botón para cerrar el modal
    const productModal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');     

    // Obtener los productos del API
    fetch('https://ecommercebackend.fundamentos-29.repl.co/')
        .then(response => response.json())
        .then(data => {
            allProducts = data; // Almacenar los productos en la variable

            // Crear opción "Todos" en el elemento select
            const optionTodos = document.createElement('option');
            optionTodos.value = 'todos';
            optionTodos.textContent = 'Todos';
            selectElement.appendChild(optionTodos);

            // Crear opciones en el elemento select para cada categoría (en mayúsculas)
            const categories = getUniqueCategories(data);
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.toLowerCase();
                option.textContent = category.toUpperCase(); // Convertir a mayúsculas
                selectElement.appendChild(option);
            });

            // Cargar todos los productos por defecto al inicio
            showProducts(allProducts);
        })
        .catch(error => console.error('Error al obtener los datos del API:', error));

    // Agregar evento para filtrar productos al cambiar la opción del select
    selectElement.addEventListener('change', () => {
        const selectedCategory = selectElement.value.toLowerCase();

        // Filtrar los productos por la categoría seleccionada o mostrar todos
        const filteredProducts = selectedCategory === 'todos'
            ? allProducts
            : allProducts.filter(product => product.category === selectedCategory);

        // Mostrar los productos filtrados
        showProducts(filteredProducts);
    });

   // Agregar evento para mostrar/ocultar la sección del carrito al hacer clic en el botón

   carritoBtn.addEventListener('click', () => {
        // Cambiar el estilo de visualización del contenedor del carrito
        if (cartContainer.style.display === 'none') {
            cartContainer.style.display = 'block';
        } else {
            cartContainer.style.display = 'none';
        }
    });
    // Función para mostrar productos en el contenedor
    function showProducts(products) {
        productsSection.innerHTML = '';

        // Mostrar los productos en el contenedor
        products.forEach(product => {
            const productDiv = createProductElement(product);
            productsSection.appendChild(productDiv);
        });
    } 
    
     // Resto del código para manejar el evento de clic en una imagen de producto y abrir el modal
     productsSection.addEventListener('click', event => {
        if (event.target.classList.contains('product-image')) {
            const productId = event.target.dataset.productId;
            const selectedProduct = allProducts.find(product => product.id.toString() === productId);

            if (selectedProduct) {
                modalImage.src = selectedProduct.image;
                modalName.textContent = selectedProduct.name;
                modalDescription.textContent = selectedProduct.description;
                modalPrice.textContent = `Precio: $${selectedProduct.price.toFixed(2)}`;
                productModal.style.display = 'block'; // Mostrar el modal
            }
        }

    });

    // Cerrar el modal al hacer clic en el botón de cerrar
    closeModalBtn.addEventListener('click', () => {
        productModal.style.display = 'none'; // Cerrar el modal
    }); 
     
});

// Función para obtener categorías únicas de los productos
function getUniqueCategories(products) {
    const categories = [];
    products.forEach(product => {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });
    return categories;
}

// Función para crear el elemento de producto
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.classList.add('product-image'); // Agrega la clase 'product-image' a la imagen
    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Agregar al carrito';
    addToCartButton.classList.add('add-to-cart-button'); // Agrega una clase al botón

    // Agregar evento de clic para agregar el producto al carrito
    addToCartButton.addEventListener('click', () => {
        addToCart(product);
        agregarProductoAlCarrito(product); 
    });
     // Asignar el atributo data-product-id con el ID del producto
     productImage.setAttribute('data-product-id', product.id);

    const productName = document.createElement('p');
    productName.textContent = product.name;

    const productPrice = document.createElement('h3');
    // Formatear el precio con dos decimales usando toFixed()
    const formattedPrice = parseFloat(product.price).toFixed(2);
    productPrice.textContent = `$${formattedPrice}`;
    productPrice.style.textAlign = 'right'; // Alinea el precio al lado derecho

    // Agregar elementos al contenedor de producto
    productDiv.appendChild(productImage);
    productDiv.appendChild(productName);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(addToCartButton); // Agregar el botón al contenedor

    return productDiv;
  }


  // Función para agregar productos al carrito
function addToCart(product) {

     // Obtener el carrito actual del almacenamiento local o inicializarlo como un array vacío
     const cart = JSON.parse(localStorage.getItem('cart')) || [];
     // Agregar el producto al carrito
     cart.push(product); 
     // Guardar el carrito actualizado en el almacenamiento local
     localStorage.setItem('cart', JSON.stringify(cart)); 
     // Actualizar visualmente el contador de productos en el carrito en tu interfaz
     updateCartCount(cart.length); 
     // Opcional: Mostrar un mensaje al usuario indicando que el producto se ha agregado al carrito
     alert(`Producto "${product.name}" agregado al carrito`);
}

// Función para actualizar el contador de productos en el carrito
function updateCartCount(count = 0) {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = count;
}

// Función para agregar un producto a la lista del carrito
function agregarProductoAlCarrito(product) {
    const cartList = document.querySelector('.cart-list');
    const card = document.createElement('div');
    card.classList.add('cart-item'); // Agrega la clase de estilo para tarjetas

    // Crear un elemento de imagen y establecer su atributo src
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    // Crear un elemento de div para contener los detalles del producto
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('product-details');

    // Crear un elemento de párrafo para el nombre del producto
    const productName = document.createElement('p');
    productName.textContent = product.name;
    productName.classList.add('product-name');

    // Crear un elemento de párrafo para el precio del producto
    const productPrice = document.createElement('p');
    productPrice.textContent = `Precio: $${product.price.toFixed(2)}`;
    productPrice.classList.add('product-price');

    // Crear un elemento de párrafo para el stock del producto
    const productStock = document.createElement('p');
    productStock.textContent = `Stock: ${product.quantity}`;
    productStock.classList.add('product-stock');

    // Crear un elemento de entrada para la cantidad del producto
    const productQuantityInput = document.createElement('input');
    productQuantityInput.type = 'number';
    productQuantityInput.value = 1; // Cantidad inicial
    productQuantityInput.min = 1; // Valor mínimo
    productQuantityInput.classList.add('product-quantity-input');

    // Crear botones para aumentar y disminuir cantidad
const increaseButton = document.createElement('button');
increaseButton.textContent = '+';
increaseButton.classList.add('quantity-button');

const decreaseButton = document.createElement('button');
decreaseButton.textContent = '-';
decreaseButton.classList.add('quantity-button');

// Manejar el evento de clic en el botón de aumento
increaseButton.addEventListener('click', () => {
    const currentQuantity = parseInt(productQuantityInput.value);
    productQuantityInput.value = currentQuantity + 1;
    updateCartQuantity(product.id, currentQuantity + 1);
});

// Manejar el evento de clic en el botón de disminución
decreaseButton.addEventListener('click', () => {
    const currentQuantity = parseInt(productQuantityInput.value);
    if (currentQuantity > 1) {
        productQuantityInput.value = currentQuantity - 1;
        updateCartQuantity(product.id, currentQuantity - 1);
    }
});

    // Agregar el nombre, el precio y el stock al elemento de detalles
    detailsDiv.appendChild(productName);
    detailsDiv.appendChild(productPrice);
    detailsDiv.appendChild(productStock);
    detailsDiv.appendChild(decreaseButton);
    detailsDiv.appendChild(productQuantityInput); 
    detailsDiv.appendChild(increaseButton);

    // Agregar la imagen y el contenedor de detalles a la tarjeta
    card.appendChild(img);
    card.appendChild(detailsDiv);
    
    // Agregar la tarjeta al contenedor de la lista del carrito
    cartList.appendChild(card);

  
    // Manejar el evento de clic en el botón de aumentar cantidad
    increaseButton.addEventListener('click', () => {
        currentQuantity++;
        productQuantity.textContent = `Cantidad: ${currentQuantity}`;
        updateCartQuantity(product.id, currentQuantity);
    });

    // Manejar el evento de clic en el botón de disminuir cantidad
    decreaseButton.addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            productQuantity.textContent = `Cantidad: ${currentQuantity}`;
            updateCartQuantity(product.id, currentQuantity);
        }
    });
}

// Función para actualizar la cantidad en el carrito
function updateCartQuantity(productId, quantity) {
    // Actualizar la cantidad visualmente en la tarjeta del producto
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    const productQuantityInput = productCard.querySelector('.product-quantity-input');
    productQuantityInput.value = quantity;

    // Actualizar la cantidad en el almacenamiento local
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.map(product => {
        if (product.id === productId) {
            return { ...product, quantity };
        }
        return product;
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Actualizar el contador del carrito
    updateCartCount(updatedCart.length);
}





