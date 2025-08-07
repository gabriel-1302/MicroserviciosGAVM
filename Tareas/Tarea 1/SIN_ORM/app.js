
// Importamos el framework Express.
const express = require('express');
// Importamos el módulo 'path' para trabajar con rutas de archivos y directorios.
const path = require('path');

// --- Inicializaciones ---
const app = express();
// Cargamos las variables de entorno desde el archivo .env.
require('dotenv').config();

// --- Configuraciones ---
// Configuramos el puerto del servidor. Usará el valor de PORT en .env o 3000 por defecto.
app.set('port', process.env.PORT || 3000);
// Configuramos el directorio donde se encuentran las vistas (plantillas EJS).
app.set('views', path.join(__dirname, 'src', 'views'));
// Establecemos EJS como el motor de plantillas.
app.set('view engine', 'ejs');

// --- Middlewares ---
// Middleware para que Express pueda entender los datos de formularios (URL-encoded).
app.use(express.urlencoded({ extended: false }));
// Middleware para servir archivos estáticos (como CSS, imágenes, etc.) desde la carpeta 'public'.
app.use(express.static(path.join(__dirname, 'public')));

// --- Rutas ---
// Le decimos a la aplicación que use las rutas definidas en agenda.routes.js.
app.use(require('./src/routes/agenda.routes'));

// --- Iniciar el Servidor ---
// La aplicación empieza a escuchar en el puerto configurado.
app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
  console.log(`Accede en http://localhost:${app.get('port')}`);
});
