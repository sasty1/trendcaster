import React, { useEffect, useState } from 'react';
import { neynarService } from './services/neynarService';
import { Trend } from './types';
import { RefreshCw, MoreHorizontal, Settings } from 'lucide-react';

const formatCount = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M posts";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K posts";
  return n + " posts";
};

const App: React.FC = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTrends = async () => {
    setLoading(true);
    // Simulate a slight network delay for better UX if using mock data
    await new Promise(r => setTimeout(r, 600)); 
    
    try {
      const data = await neynarService.getTrendingKeywords();
      setTrends(data);
    } catch (error) {
      console.error("Failed to load trends", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            Trends for you
          </h1>
          <button 
            onClick={fetchTrends}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50"
            aria-label="Refresh trends"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        
        {loading ? (
          <div className="divide-y divide-gray-800">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-4 py-3 animate-pulse">
                <div className="h-3 w-24 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-800 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {trends.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No trends found right now.
              </div>
            ) : (
              trends.map((trend) => (
                <div 
                  key={trend.rank}
                  className="px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer flex justify-between items-start"
                >
                  <div>
                    <div className="text-[13px] text-gray-500 font-medium leading-4 mb-0.5">
                      {trend.rank} · Trending
                    </div>
                    <div className="text-[15px] font-bold text-white leading-5 capitalize mb-0.5">
                      {trend.word}
                    </div>
                    <div className="text-[13px] text-gray-500 leading-4">
                      {formatCount(trend.count)}
                    </div>
                  </div>
                  <button className="p-2 -mr-2 text-gray-500 hover:bg-blue-500/10 hover:text-blue-400 rounded-full transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-3 px-6 text-center text-xs text-gray-600">
        <p>Powered by Neynar API · TrendCaster</p>
      </footer>

    </div>
  );
};

export default App;
