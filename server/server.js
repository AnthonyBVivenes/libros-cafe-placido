const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const fileUpload = require('express-fileupload');

const config = require('./config/loadconfig');
const publicRoutes = require('./router/publicRoutes');


const TareasProgramadas = require('./tasks/divisas.js');



// Middlewares DEBEN estar primero
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear form-data

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'}));

//cookies
app.use(session({
    secret: 'ñ:Ññsññsñsl2ñsñ()()DS9ºº/////ººº´`+````ddos////*-.>$44~~#@+]]*di389d3498djikW·DFRGed3r', // Cambia esto por una clave segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Usa true solo si usas HTTPS
}));



// Archivos estáticos
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));



//---------------------------------------------
// carpetas públicas
app.use('/uploads', express.static('uploads'));

//---------------------------------------------

//---------------------------------------------
//          Plantillas views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); // Carpeta "views" en tu proyecto
//
//---------------------------------------------


// Routers
const productRouter = require('./router/routes');

// Rutas


app.use('/api/products', productRouter);


app.use('/', publicRoutes);

// Manejo de errores
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});





app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor Express en http://localhost:3000');
    TareasProgramadas.alIniciarServidor();
    TareasProgramadas.configurarTareas();
});