import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from 'dotenv';

const app = express();
const port = 3000;

/**
 * Configura las variables de entorno cargando el archivo `.env`.
 */
config();

/**
 * Nombre del archivo de base de datos SQLite.
 * @type {string}
 */
const filename = "database.db";

console.log(filename);

/**
 * Instancia de Sequelize para la conexión a la base de datos SQLite.
 * @type {Sequelize}
 */
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

/**
 * Modelo de datos para la tabla de libros.
 * @class
 */
class Book extends Model { }
Book.init({
    autor: DataTypes.STRING,
    isbn: DataTypes.INTEGER,
    editorial: DataTypes.STRING,
    paginas: DataTypes.INTEGER
}, { sequelize, modelName: 'book' });

/**
 * Sincroniza el modelo con la base de datos.
 */
sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Maneja la solicitud GET para obtener todos los libros.
 * @name GET /books
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Maneja la solicitud GET para obtener un libro por su ID.
 * @name GET /books/:id
 * @function
 * @param {Object} req - Objeto de solicitud HTTP con parámetros.
 * @param {string} req.params.id - ID del libro.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Maneja la solicitud POST para crear un nuevo libro.
 * @name POST /books
 * @function
 * @param {Object} req - Objeto de solicitud HTTP con los datos del libro a crear.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Maneja la solicitud PUT para actualizar un libro existente por su ID.
 * @name PUT /books/:id
 * @function
 * @param {Object} req - Objeto de solicitud HTTP con los datos actualizados del libro.
 * @param {string} req.params.id - ID del libro a actualizar.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Maneja la solicitud DELETE para eliminar un libro por su ID.
 * @name DELETE /books/:id
 * @function
 * @param {Object} req - Objeto de solicitud HTTP con parámetros.
 * @param {string} req.params.id - ID del libro a eliminar.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Inicia el servidor Express en el puerto especificado.
 * @function
 * @name listen
 * @param {number} port - Puerto en el cual escuchar las conexiones.
 * @param {Function} callback - Función a ejecutar una vez que el servidor comienza a escuchar.
 * @returns {void}
 */
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
