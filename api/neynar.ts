export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "Missing NEYNAR_API_KEY" });
    }

    const url =
      "https://api.neynar.com/v2/farcaster/feed?feed_type=global&limit=100&viewer_fid=0";

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        api_key: apiKey,
      },
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Neynar API error:", error);
    return res.status(500).json({ error: "Failed to fetch Neynar data" });
  }
}
