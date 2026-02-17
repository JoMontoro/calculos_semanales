import supabase from "./supabaseClient";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

  try {
    const { data, error } = await supabase
      .from("sangrias")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ ok: true, sangrias: data });
  } catch (err) {
    return res.status(500).json({ ok:false, error: err.message });
  }
}