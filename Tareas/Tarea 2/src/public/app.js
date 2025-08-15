document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('agenda-form');
    const listaContactos = document.getElementById('contactos-lista');
    const contactoIdInput = document.getElementById('contacto-id');

    const API_URL = '/api/contactos';

    // Función para obtener y mostrar los contactos
    const fetchContactos = async () => {
        try {
            const response = await fetch(API_URL);
            const contactos = await response.json();
            listaContactos.innerHTML = ''; // Limpiar lista

            contactos.forEach(contacto => {
                const card = document.createElement('div');
                card.className = 'contacto-card';
                card.innerHTML = `
                    <p><strong>Nombre:</strong> ${contacto.nombres} ${contacto.apellidos}</p>
                    <p><strong>Fecha Nacimiento:</strong> ${contacto.fecha_nacimiento ? new Date(contacto.fecha_nacimiento).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Dirección:</strong> ${contacto.direccion || 'N/A'}</p>
                    <p><strong>Celular:</strong> ${contacto.celular || 'N/A'}</p>
                    <p><strong>Correo:</strong> ${contacto.correo || 'N/A'}</p>
                    <div class="contacto-actions">
                        <button class="edit-btn" data-id="${contacto._id}">Editar</button>
                        <button class="delete-btn" data-id="${contacto._id}">Eliminar</button>
                    </div>
                `;
                listaContactos.appendChild(card);
            });
        } catch (error) {
            console.error('Error al cargar contactos:', error);
        }
    };

    // Manejar envío del formulario (Crear y Actualizar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = contactoIdInput.value;
        const contactoData = {
            nombres: document.getElementById('nombres').value,
            apellidos: document.getElementById('apellidos').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            direccion: document.getElementById('direccion').value,
            celular: document.getElementById('celular').value,
            correo: document.getElementById('correo').value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactoData),
            });

            if (response.ok) {
                form.reset();
                contactoIdInput.value = '';
                fetchContactos();
            } else {
                const err = await response.json();
                console.error('Error al guardar contacto:', err);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });

    // Manejar botones de Editar y Eliminar (delegación de eventos)
    listaContactos.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;

        // Botón Eliminar
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
                try {
                    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                    if (response.ok) {
                        fetchContactos();
                    } else {
                        console.error('Error al eliminar');
                    }
                } catch (error) {
                    console.error('Error de red:', error);
                }
            }
        }

        // Botón Editar
        if (e.target.classList.contains('edit-btn')) {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                const contacto = await response.json();

                // Llenar el formulario con los datos del contacto
                document.getElementById('contacto-id').value = contacto._id;
                document.getElementById('nombres').value = contacto.nombres;
                document.getElementById('apellidos').value = contacto.apellidos;
                document.getElementById('fecha_nacimiento').value = contacto.fecha_nacimiento ? contacto.fecha_nacimiento.split('T')[0] : '';
                document.getElementById('direccion').value = contacto.direccion;
                document.getElementById('celular').value = contacto.celular;
                document.getElementById('correo').value = contacto.correo;

                window.scrollTo(0, 0); // Subir al inicio para ver el formulario
            } catch (error) {
                console.error('Error al cargar datos para editar:', error);
            }
        }
    });

    // Carga inicial de contactos
    fetchContactos();
});
