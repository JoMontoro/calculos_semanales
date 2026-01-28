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

// 🔹 Crear la tabla automáticamente si no existe
const crearTablaSQL = `
CREATE TABLE IF NOT EXISTS calculo_semanal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    capital DECIMAL(10,2) NOT NULL,
    vino DECIMAL(10,2),
    naranja DECIMAL(10,2),
    azucar DECIMAL(10,2),
    pina DECIMAL(10,2),
    botella DECIMAL(10,2),
    total_insumos DECIMAL(10,2),
    ganancia DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.connect(async (err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL en Railway:", err);
    process.exit(1);
  }
  console.log("✅ Conectado correctamente a MySQL en Railway!");

  // Crear tabla si no existe
  try {
    await db.promise().query(crearTablaSQL);
    console.log("📦 Tabla 'calculo_semanal' lista ✅");
  } catch (err) {
    console.error("❌ Error al crear la tabla:", err);
    process.exit(1);
  }
});

// 🔹 Resto de endpoints...
app.get("/", (req, res) => {
  res.send("✅ Backend funcionando correctamente");
});

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
    d.vino || 0,
    d.naranja || 0,
    d.azucar || 0,
    d.pina || 0,
    d.botella || 0,
    d.total_insumos || 0,
    d.ganancia || 0
  ], (err) => {
    if (err) {
      console.error("❌ Error al guardar en MySQL:", err);
      return res.status(500).json({ error: err });
    }
    console.log("💾 Datos guardados correctamente:", d);
    res.json({ mensaje: "Guardado correctamente" });
  });
});

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

const PORT = process.env.PORT;
if (!PORT) {
  console.error("❌ No se encontró la variable de entorno PORT");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log(`🔗 Ruta para ver datos: /datos`);
});
