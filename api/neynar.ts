import { NeynarFeedResponse } from '../types';

/**
 * Server Function: /api/neynar
 * 
 * This file is intended to run in a server environment (Node.js/Edge).
 * It securely accesses the NEYNAR_API_KEY environment variable.
 */

export async function GET(request: Request): Promise<Response> {
  // 1. Securely read the environment variable
  // We prioritize the environment variable, but fall back to the provided key for this environment.
  const apiKey = process.env.NEYNAR_API_KEY || 'A6A21C9B-1BBE-4DBA-9B4B-92E1E98E24FA';

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error: NEYNAR_API_KEY missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 2. Call Neynar API from the server
    const neynarResponse = await fetch('https://api.neynar.com/v2/farcaster/feed/global?limit=100', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api_key': apiKey, // Key is used here, never sent to browser
      },
    });

    if (!neynarResponse.ok) {
      throw new Error(`Neynar API Error: ${neynarResponse.statusText}`);
    }

    const data: NeynarFeedResponse = await neynarResponse.json();

    // 3. Return data to the frontend
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Proxy Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from Neynar' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}