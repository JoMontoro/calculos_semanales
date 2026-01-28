import pool from "./db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

  try {
    // Crear tabla si no existe (previene crash)
    await pool.query(`
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
      )
    `);

    const [rows] = await pool.query("SELECT * FROM calculo_semanal ORDER BY id DESC");
    res.status(200).json(rows);

  } catch (err) {
    console.error("❌ Error en datos.js:", err);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
}
