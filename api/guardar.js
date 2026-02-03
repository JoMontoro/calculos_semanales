import { createClient } from "@supabase/supabase-js";

// 🔐 Variables de entorno (desde Vercel)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const d = req.body;

    // ✅ Insertar en Supabase
    const { data, error } = await supabase
      .from("calculo_semanal") // 👈 nombre de tu tabla
      .insert([{
        capital: d.capital,
        vino: d.vino,
        naranja: d.naranja,
        azucar: d.azucar,
        pina: d.pina,
        botella: d.botella,
        total_insumos: d.total_insumos,
        ganancia: d.ganancia
      }]);

    if (error) {
      console.error("Error Supabase:", error);
      return res.status(500).json({ error: "Error al guardar en Supabase ❌" });
    }

    return res.status(200).json({
      mensaje: "Datos guardados en Supabase ✅",
      data
    });

  } catch (err) {
    console.error("Error backend:", err);
    return res.status(500).json({ error: "Error del servidor ❌" });
  }
}