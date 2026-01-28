const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express(); // 👈 ESTO ES CLAVE

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "Diseño")));

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root", // vacío en XAMPP normalmente
  database: "calculo_semanal",
  port: 3306,
  uri: "mysql://root:LVHvvPJeGQlpsowMbTWdDPDCNxdcocvr@shinkansen.proxy.rlwy.net:25065/railway"
});

db.connect(err => {
  if (err) {
    console.error("Error BD:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

app.post("/guardar", (req, res) => {
  const d = req.body;

  const sql = `
    INSERT INTO calculo_semanal
    (capital, vino, naranja, azucar, pina, botella, total_insumos, ganancia)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
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

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});