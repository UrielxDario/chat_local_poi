const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Aqui la contraseña de Workbench (si tienen)
    database: 'DB_POI_Wizard',
    port: 3306 //  puerto  de Workbench
});

db.connect(err => {
    if (err) console.error(' Error conectando a MySQL:', err);
    else console.log('Conectado a MySQL');
});

module.exports = db;
