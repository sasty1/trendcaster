export const processTrends = (casts: any[]) => {
  const postCounts: Record<string, number> = {};

  casts.forEach(cast => {
    let text = cast.text?.toLowerCase() || "";

    // Remove URLs
    text = text.replace(/https?:\/\/\S+/g, '');

    // Extract all alphanumeric words (Twitter-style)
    const words = text.match(/[a-z0-9]+/gi) || [];

    // Each keyword counted once per post
    const uniqueWordsInCast = new Set(words);

    uniqueWordsInCast.forEach(word => {
      if (!STOP_WORDS.has(word) && isNaN(Number(word))) {
        postCounts[word] = (postCounts[word] || 0) + 1;
      }
    });
  });

  return Object.entries(postCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item, i) => ({
      rank: i + 1,
      word: item.word,
      count: item.count
    }));
};
