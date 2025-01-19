const express = require('express'); // Importar Express
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); // Importar mysql2

const app = express(); // Crear la aplicación Express
const PORT = 5000; // Puerto donde correrá el servidor

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost', // Dirección del servidor MySQL
    user: 'root',      // Usuario de MySQL
    password: 'Jafet004', // Contraseña de MySQL
    database: 'movies_db', // Nombre de la base de datos
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rutas de la API

// Obtener todas las películas
app.get('/films', (req, res) => {
    const query = 'SELECT * FROM movies';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch movies' });
            return;
        }
        res.json(results);
    });
});

// Agregar una nueva película
app.post('/films', (req, res) => {
    const { title, director, genre, score, rating, year, poster } = req.body;

    const query = 'INSERT INTO movies (title, director, genre, score, rating, year, poster) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [title, director, genre, score, rating, year, poster];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to add movie' });
            return;
        }
        res.status(201).json({ id: result.insertId, title, director, genre, score, rating, year, poster });
    });
});

// Actualizar una película existente
app.put('/films/:id', (req, res) => {
    const { id } = req.params;
    const { title, director, genre, score, rating, year, poster } = req.body;

    const query = `
        UPDATE movies
        SET title = ?, director = ?, genre = ?, score = ?, rating = ?, year = ?, poster = ?
        WHERE id = ?
    `;
    const values = [title, director, genre, score, rating, year, poster, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update movie' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.json({ id, title, director, genre, score, rating, year, poster });
    });
});

// Eliminar una película
app.delete('/films/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM movies WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete movie' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.status(204).send();
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
