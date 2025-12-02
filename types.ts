export interface Trend {
  rank: number;
  word: string;
  count: number; // total number of posts
}

export interface NeynarCast {
  hash: string;
  text: string;
  timestamp: string;
  author: {
    username: string;
    display_name: string;
    pfp_url: string;
  };
}

export interface NeynarFeedResponse {
  casts: NeynarCast[];
  next: {
    cursor: string | null;
  };
}

export interface ApiError {
  message: string;
}
