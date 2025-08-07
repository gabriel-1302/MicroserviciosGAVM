const API_URL = 'http://localhost:3000/api/agenda';

const contactoForm = document.getElementById('contactoForm');
const contactoIdInput = document.getElementById('contactoId');
const nombresInput = document.getElementById('nombres');
const apellidosInput = document.getElementById('apellidos');
const fechaNacimientoInput = document.getElementById('fecha_nacimiento');
const direccionInput = document.getElementById('direccion');
const celularInput = document.getElementById('celular');
const correoInput = document.getElementById('correo');
const contactosTableBody = document.querySelector('#contactosTable tbody');
const cancelarEdicionBtn = document.getElementById('cancelarEdicion');

// Función para obtener y mostrar todos los contactos
async function obtenerContactos() {
    try {
        const response = await fetch(API_URL);
        const contactos = await response.json();
        contactosTableBody.innerHTML = ''; // Limpiar tabla
        contactos.forEach(contacto => {
            const row = contactosTableBody.insertRow();
            row.insertCell().textContent = contacto.id;
            row.insertCell().textContent = contacto.nombres;
            row.insertCell().textContent = contacto.apellidos;
            row.insertCell().textContent = new Date(contacto.fecha_nacimiento).toLocaleDateString();
            row.insertCell().textContent = contacto.direccion;
            row.insertCell().textContent = contacto.celular;
            row.insertCell().textContent = contacto.correo;

            const accionesCell = row.insertCell();
            const editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar';
            editarBtn.classList.add('edit');
            editarBtn.onclick = () => cargarContactoParaEdicion(contacto);
            accionesCell.appendChild(editarBtn);

            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.classList.add('delete');
            eliminarBtn.onclick = () => eliminarContacto(contacto.id);
            accionesCell.appendChild(eliminarBtn);
        });
    } catch (error) {
        console.error('Error al obtener contactos:', error);
    }
}

// Función para cargar un contacto en el formulario para edición
function cargarContactoParaEdicion(contacto) {
    contactoIdInput.value = contacto.id;
    nombresInput.value = contacto.nombres;
    apellidosInput.value = contacto.apellidos;
    // Formatear la fecha para el input type="date"
    fechaNacimientoInput.value = new Date(contacto.fecha_nacimiento).toISOString().split('T')[0];
    direccionInput.value = contacto.direccion;
    celularInput.value = contacto.celular;
    correoInput.value = contacto.correo;

    cancelarEdicionBtn.style.display = 'inline-block';
    contactoForm.querySelector('button[type="submit"]').textContent = 'Actualizar Contacto';
}

// Función para resetear el formulario
function resetearFormulario() {
    contactoForm.reset();
    contactoIdInput.value = '';
    cancelarEdicionBtn.style.display = 'none';
    contactoForm.querySelector('button[type="submit"]').textContent = 'Guardar Contacto';
}

// Event listener para el envío del formulario (crear/actualizar)
contactoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contacto = {
        nombres: nombresInput.value,
        apellidos: apellidosInput.value,
        fecha_nacimiento: fechaNacimientoInput.value, // Ya está en formato YYYY-MM-DD
        direccion: direccionInput.value,
        celular: celularInput.value,
        correo: correoInput.value,
    };

    const contactoId = contactoIdInput.value;

    try {
        let response;
        if (contactoId) {
            // Actualizar
            response = await fetch(`${API_URL}/${contactoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contacto),
            });
        } else {
            // Crear
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contacto),
            });
        }

        if (response.ok) {
            resetearFormulario();
            obtenerContactos(); // Recargar la lista
        } else {
            const errorData = await response.json();
            console.error('Error al guardar contacto:', errorData);
            alert('Error al guardar contacto: ' + (errorData.mensaje || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la conexión con el servidor.');
    }
});

// Event listener para cancelar edición
cancelarEdicionBtn.addEventListener('click', resetearFormulario);

// Función para eliminar un contacto
async function eliminarContacto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                obtenerContactos(); // Recargar la lista
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar contacto:', errorData);
                alert('Error al eliminar contacto: ' + (errorData.mensaje || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error en la solicitud de eliminación:', error);
            alert('Error en la conexión con el servidor al intentar eliminar.');
        }
    }
}

// Cargar contactos al cargar la página
document.addEventListener('DOMContentLoaded', obtenerContactos);
