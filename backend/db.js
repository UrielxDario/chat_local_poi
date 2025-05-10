require("dotenv").config();
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    ssl: {
        rejectUnauthorized: false,  
    }, 
});
 

db.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Error al conectar a Clever Cloud:", err);
  } else {
    console.log("✅ Conectado a Clever Cloud MySQL");
    conn.release();
  }
});

module.exports = db;
