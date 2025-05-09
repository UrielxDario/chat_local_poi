const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'DB_POI_Wizard',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones abiertas al mismo tiempo
    queueLimit: 0 // Número máximo de conexiones en cola (0 = ilimitado)
});

// Probar conexión (opcional pero útil)
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('Conectado a MySQL con pool');
        connection.release(); // Liberamos la conexión para que el pool la use luego
    }
});

module.exports = db;
