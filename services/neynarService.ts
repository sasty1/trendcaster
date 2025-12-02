export const processTrends = (casts: any[]): Trend[] => {
  const wordCounts: Record<string, number> = {};

  casts.forEach((cast) => {
    const text =
      cast?.body?.data?.text ||   // correct for Neynar v2
      cast?.text ||               // fallback
      "";

    if (!text || typeof text !== "string") return;

    let clean = text.toLowerCase().replace(/https?:\/\/\S+/g, "");

    const words = clean.match(/\b[a-z0-9]{3,}\b/g) || [];

    const unique = new Set(words);

    unique.forEach((word) => {
      if (!STOP_WORDS.has(word) && isNaN(Number(word))) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });

  return Object.entries(wordCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item, index) => ({
      rank: index + 1,
      word: item.word,
      count: item.count,
    }));
};
