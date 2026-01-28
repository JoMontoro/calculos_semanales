const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "Diseño")));

// 🔹 Conexión a MySQL en Railway
const db = mysql.createConnection({
  host: "shinkansen.proxy.rlwy.net",
  user: "root",
  password: "LVHvvPJeGQlpsowMbTWdDPDCNxdcocvr",
  database: "railway",
  port: 25065
});

// Probar conexión
db.connect(err => {
  if (err) {
    console.error("❌ Error al conectar con MySQL en Railway:", err);
    process.exit(1); // Salir si no puede conectarse
  }
  console.log("✅ Conectado correctamente a MySQL en Railway!");
});

// 🔹 Endpoint de prueba para Railway
app.get("/", (req, res) => {
  res.send("✅ Backend funcionando correctamente");
});

// 🔹 Ruta para guardar datos
app.post("/guardar", (req, res) => {
  const d = req.body;

  if (!d.capital) return res.status(400).json({ error: "Faltan datos" });

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
      console.error("❌ Error al guardar en MySQL:", err);
      return res.status(500).json({ error: err });
    }
    console.log("💾 Datos guardados correctamente:", d);
    res.json({ mensaje: "Guardado correctamente" });
  });
});

// 🔹 Ruta para ver datos
app.get("/datos", (req, res) => {
  const sql = "SELECT * FROM calculo_semanal ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener datos:", err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// 🔹 Puerto dinámico obligatorio en Railway
const PORT = process.env.PORT;
if (!PORT) {
  console.error("❌ No se encontró la variable de entorno PORT");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log(`🔗 Ruta para ver datos: /datos`);
});
