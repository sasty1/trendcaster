export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "Missing NEYNAR_API_KEY" });
    }

    const url =
      "https://api.neynar.com/v2/farcaster/feed/?feed_type=filter&filter_type=global_trending&limit=100";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Neynar API error:", text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    // data.casts is what your frontend expects
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Failed to fetch Neynar data" });
  }
}
