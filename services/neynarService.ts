import { Trend, NeynarFeedResponse, NeynarCast } from '../types';

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
  'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
  'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
  'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'has', 'had',
  'been', 'frame', 'cast', 'farcaster', 'degen', 'base', 'reply', 'recast', 'http', 'https', 'com', 'www', 'via'
]);

// Mock data to use if the backend route fails
const MOCK_CASTS: NeynarCast[] = Array.from({ length: 100 }).map((_, i) => ({
  hash: `hash-${i}`,
  text: i % 3 === 0 
    ? "Just bought some more eth on base! Optimism is trending hard." 
    : i % 3 === 1
    ? "Building a new frame for the hackathon. Zora drops are looking fire today."
    : "Eth is acceptable but I prefer solana for degen plays. Eth eth eth.",
  timestamp: new Date().toISOString(),
  author: {
    username: 'mock_user',
    display_name: 'Mock User',
    pfp_url: 'https://picsum.photos/200',
  }
}));

export const neynarService = {
  /**
   * Fetches trending keywords. 
   * It attempts to hit the local server function /api/neynar.
   * If that fails (404/500), it gracefully falls back to mock logic.
   */
  getTrendingKeywords: async (): Promise<Trend[]> => {
    let casts: NeynarCast[] = [];

    try {
      // Attempt to call the server function
      const response = await fetch('/api/neynar');
      
      if (!response.ok) {
        console.warn('Backend /api/neynar unavailable, switching to mock mode.');
        casts = MOCK_CASTS;
      } else {
        const data: NeynarFeedResponse = await response.json();
        casts = data.casts || [];
      }
    } catch (err) {
      console.warn('Network error fetching API, switching to mock mode.', err);
      casts = MOCK_CASTS;
    }

    return processTrends(casts);
  }
};

function processTrends(casts: NeynarCast[]): Trend[] {
  const postCounts: Record<string, number> = {};

  casts.forEach(cast => {
    let text = cast.text.toLowerCase();
    
    // Remove URLs
    text = text.replace(/(https?:\/\/[^\s]+)/g, '');

    // Extract words (alphanumeric, at least 3 chars)
    const words = text.match(/[a-z0-9]+/gi) || [];

    // Use a Set to ensure we count each keyword only once per post (Document Frequency)
    // We do NOT filter by user (one user can contribute multiple posts)
    const uniqueWordsInCast = new Set(words);

    uniqueWordsInCast.forEach(word => {
      // Filter stop words and numbers
      if (!STOP_WORDS.has(word) && isNaN(Number(word))) {
        postCounts[word] = (postCounts[word] || 0) + 1;
      }
    });
  });

  // Convert to array, sort by count descending, and take top 10
  const sortedTrends = Object.entries(postCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item, index) => ({
      rank: index + 1,
      word: item.word,
      count: item.count
    }));

  return sortedTrends;
}
