// Vercel Serverless Function: Keep Supabase Database Alive
// This endpoint is called by Vercel Cron to prevent Supabase free-tier auto-pause.
// Supabase pauses databases after 7 days of inactivity on the free plan.

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({
      success: false,
      error: 'Supabase credentials not configured',
    });
  }

  try {
    // Lightweight query: just count 1 row from the table
    const response = await fetch(
      `${supabaseUrl}/rest/v1/wishlist_items?select=count&limit=1`,
      {
        method: 'GET',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase responded with status: ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: '🏓 Supabase is alive!',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('Keep-alive ping failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
