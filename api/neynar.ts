export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "Missing NEYNAR_API_KEY" });
    }

    const url = "https://api.neynar.com/v2/farcaster/feed?feed_type=global&limit=100&viewer_fid=0";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "api_key": apiKey
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Neynar API error response:", text);
      return res.status(response.status).json({ error: text });
    }

    const json = await response.json();
    return res.status(200).json(json);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Failed to fetch Neynar data" });
  }
}
