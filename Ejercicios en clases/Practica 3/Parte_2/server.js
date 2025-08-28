const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Usar body-parser para analizar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
    host: '172.25.0.3',
    user: 'root',
    password: 'tu_password',
    database: 'usuarios_db'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta principal para mostrar la lista de usuarios
app.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            throw err;
        }
        res.render('index', { users: results });
    });
});

// Ruta para agregar un nuevo usuario
app.post('/add', (req, res) => {
    const { name, email } = req.body;
    const newUser = { name, email };
    db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
});

// Ruta para eliminar un usuario
app.post('/delete/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
