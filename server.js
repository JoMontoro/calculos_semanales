const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "Diseño"))); // Carpeta de frontend

// Conexión a MySQL usando la URL directa de Railway
const db = mysql.createConnection({
  host: "shinkansen.proxy.rlwy.net",
  user: "root",
  password: "LVHvvPJeGQlpsowMbTWdDPDCNxdcocvr",
  database: "railway",
  port: 25065});
  

// Alternativa si mysql2 no soporta 'uri' directamente:
// Desglosa los datos en propiedades:
const db2 = mysql.createConnection({
  host: "shinkansen.proxy.rlwy.net",
  user: "root",
  password: "LVHvvPJeGQlpsowMbTWdDPDCNxdcocvr",
  database: "railway",
  port: 25065
});

db2.connect(err => {
  if (err) {
    console.error("Error BD:", err);
    return;
  }
  console.log("Conectado a MySQL en Railway!");
});

// Ruta para guardar datos
app.post("/guardar", (req, res) => {
  const d = req.body;

  const sql = `
    INSERT INTO calculo_semanal
    (capital, vino, naranja, azucar, pina, botella, total_insumos, ganancia)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db2.query(sql, [
    d.capital,
    d.vino,
    d.naranja,
    d.azucar,
    d.pina,
    d.botella,
    d.total_insumos,
    d.ganancia
  ], err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }
    res.json({ mensaje: "Guardado correctamente" });
  });
});

// Puerto dinámico para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});