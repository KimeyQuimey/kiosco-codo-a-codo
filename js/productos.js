const productosTabla = document.getElementById('tabla-productos');

const URL_BASE = 'https://xyberdev.alwaysdata.net/api';
const token = localStorage.getItem('token');

fetchProductos();

async function fetchProductos() {
    try {
        const response = await fetch(URL_BASE + '/productos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        const tbody = productosTabla.querySelector('tbody');
        tbody.innerHTML = '';

        data.forEach((producto, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
              <td>${index + 1}</td>
              <td>${producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>${producto.descripcion}</td>
              <td>
              <button onclick="editarProducto(${producto.id_producto})">Editar</button>
              <button class="secondary" onclick="confirmarEliminarProducto(${producto.id_producto})">Eliminar</button>
              </td>`;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.log(error);
    }
}

async function confirmarEliminarProducto(id) {
    const confirmed = confirm("¿Estás seguro que quieres eliminar este producto?");
    if (confirmed) {
        await eliminarProducto(id);
    }
}

async function eliminarProducto(id) {
    try {
        const response = await fetch(URL_BASE + `/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log(`Producto con ID ${id} eliminado`);
            fetchProductos();
        } else {
            console.log('Error al eliminar el producto');
        }

    } catch (error) {
        console.log('Error en la solicitud para eliminar el producto:', error);
    }
}

// Usar dialog
const abrirModalAgregarProducto = document.getElementById('abrir-agregar-producto');
const modalAgregarProducto = document.querySelector('#modal-agregar-producto');
const cerrarModalAgregarProducto = document.querySelector('#cerrar-modal-agregar-productos');
const categoriasSelect = document.getElementById('categorias');
const crearProducto = document.querySelector('#crear-producto');

abrirModalAgregarProducto.addEventListener("click", async () => {
    modalAgregarProducto.showModal();
    try {
        const response = await fetch(URL_BASE + `/categorias/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const categorias = await response.json();

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id_categoria_producto;
            option.textContent = categoria.descripcion;
            categoriasSelect.appendChild(option);
        });

    } catch (error) {
        console.log(error);
    }
});

crearProducto.addEventListener("click", async () => {
    try {
        const id_categoria_producto = document.getElementById('categorias').value;
        const nombre = document.getElementById("nuevo-producto-nombre").value;
        const precio = parseFloat(document.getElementById("nuevo-producto-precio").value);

        const response = await fetch(URL_BASE + `/productos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id_categoria_producto, nombre, precio })
        });

        if (response.ok) {
            console.log(`Producto creado`);
            fetchProductos();
            modalAgregarProducto.close();
        } else {
            console.log('Error al crear');
        }
    } catch (error) {
        console.log('Error en la solicitud para crear el producto:', error);
    }
});

cerrarModalAgregarProducto.addEventListener("click", () => {
    modalAgregarProducto.close();
});

// Editar producto
const modalEditarProducto = document.getElementById('editar-producto');
const cerrarModalEditarProducto = document.querySelector('#cerrar-modal-editar-productos');
const guardarCambiosProducto = modalEditarProducto.querySelector('#editar-confimar-cambio');

cerrarModalEditarProducto.addEventListener("click", () => {
    modalEditarProducto.close();
});

async function editarProducto(id) {
    modalEditarProducto.showModal();

    try {
        const response = await fetch(URL_BASE + `/productos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const producto = await response.json();

        document.getElementById('editar-nombre').value = producto.nombre;
        document.getElementById('editar-nombre').dataset.id = id;
        document.getElementById('editar-precio').value = producto.precio;

    } catch (error) {
        console.log(error);
    }
}

async function actualizarPrecioProducto(id, precio) {
    try {
        const response = await fetch(URL_BASE + `/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ precio })
        });

        if (response.ok) {
            console.log(`Precio del producto con id ${id} actualizado`);
            fetchProductos();
            modalEditarProducto.close();
        } else {
            console.log('Error al actualizar el producto');
        }

    } catch (error) {
        console.log('Error en la solicitud para actualizar el producto:', error);
    }
}

guardarCambiosProducto.addEventListener("click", async (event) => {
    event.preventDefault();
    const id = document.getElementById('editar-nombre').dataset.id;
    const precio = parseFloat(document.getElementById('editar-precio').value);

    if (isNaN(precio) || precio <= 0) {
        alert('Por favor, ingrese un precio válido.');
        return;
    }

    await actualizarPrecioProducto(id, precio);
});
