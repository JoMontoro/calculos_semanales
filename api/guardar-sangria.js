import supabase from "./supabaseClient";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  try {
    const d = req.body;
    const { data, error } = await supabase
      .from("sangrias")
      .insert([{
        fecha: d.fecha,
        cantidad: d.cantidad,
        precio: d.precio,
        cliente: d.cliente,
        estado: d.estado,
        notas: d.notas,
        total: d.total
      }])
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok:false, error: err.message });
  }
}