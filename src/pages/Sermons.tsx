import { useState, useEffect } from 'react';
import { Send, ExternalLink, Search, Play, ListVideo, ChevronDown, VideoOff, Youtube, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { Skeleton } from '../components/ui/Skeleton';

const SermonItemSkeleton = () => (
  <div className="p-4 rounded-2xl bg-white/50 border border-transparent">
    <div className="flex items-start gap-3">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  </div>
);

const YOUTUBE_API_KEY = 'AIzaSyDn8F66taaeSnVquSNphgt_W6H9Dnv3hCE';
const CHANNEL_HANDLE = '@louderfellowship1828';

interface Sermon {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  rawDate: string;
}

export default function Sermons() {
  const [allSermons, setAllSermons] = useState<Sermon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [uploadsPlaylistId, setUploadsPlaylistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSermon = allSermons.find(s => s.id === currentVideoId);

  async function getUploadsPlaylistId() {
    try {
      const cachedId = sessionStorage.getItem('uploadsPlaylistId');
      if (cachedId) return cachedId;

      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(CHANNEL_HANDLE)}&key=${YOUTUBE_API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch channel details');

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const id = data.items[0].contentDetails.relatedPlaylists.uploads;
        sessionStorage.setItem('uploadsPlaylistId', id);
        return id;
      }

      // Fallback search
      const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(CHANNEL_HANDLE)}&type=channel&key=${YOUTUBE_API_KEY}`);
      const searchData = await searchResponse.json();
      if (searchData.items && searchData.items.length > 0) {
        const channelId = searchData.items[0].id.channelId;
        const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`);
        const channelData = await channelResponse.json();
        if (channelData.items && channelData.items.length > 0) {
          const id = channelData.items[0].contentDetails.relatedPlaylists.uploads;
          sessionStorage.setItem('uploadsPlaylistId', id);
          return id;
        }
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function fetchSermons(token = null as string | null) {
    setIsLoading(true);
    setError(null);
    try {
      let playlistId = uploadsPlaylistId;
      if (!playlistId) {
        playlistId = await getUploadsPlaylistId();
        setUploadsPlaylistId(playlistId);
      }

      if (!playlistId) throw new Error('Could not find YouTube channel uploads');

      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=25${token ? `&pageToken=${token}` : ''}&key=${YOUTUBE_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch sermons');

      const data = await response.json();
      if (data.items) {
        const newSermons = data.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          rawDate: item.snippet.publishedAt
        }));

        setAllSermons(prev => [...prev, ...newSermons]);
        setNextPageToken(data.nextPageToken || null);
        
        if (!currentVideoId && newSermons.length > 0 && !token) {
          setCurrentVideoId(newSermons[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSermons();
  }, []);

  const filteredSermons = allSermons.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEO 
        title="Sermons"
        description="Watch and listen to the latest prophetic teachings from Prophet Ezekiel Kayondo. Access our YouTube archives and Telegram audio sermons for spiritual growth."
        keywords="church sermons Kampala, Ezekiel Kayondo teachings, prophetic revelation, Christian audio sermons, YouTube church Uganda"
      />
      <header className="bg-royal-blue py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative p-3 z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Our Sermons</h1>
          <p className="text-royal-gold uppercase tracking-[0.3em] font-bold">The Word of God from our YouTube and Telegram Channels</p>
        </div>
      </header>

      {/* Telegram CTA */}
      <div className="bg-royal-gold/10 border-y border-royal-gold/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-royal-gold rounded-2xl flex items-center justify-center text-royal-blue flex-shrink-0 shadow-lg rotate-3">
                <Send className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-royal-blue">Audio Sermons on Telegram</h3>
                <p className="text-slate-600">All audio sermons are in our channel for easy download. It's open to anyone who wants to get sermons!</p>
              </div>
            </div>
            <a 
              href="https://t.me/+c-qcHSR4-2U0YTA0" 
              target="_blank" 
              rel="noreferrer"
              className="w-full md:w-auto bg-royal-blue text-white px-10 py-4 rounded-2xl font-bold hover:bg-royal-blue/90 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-royal-blue/20"
            >
              Join Telegram Channel <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <section id="sermons-section" className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-10 max-w-md">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search sermons by title..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-royal-gold outline-none transition-all shadow-sm"
              />
              <Search className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Video Player Area */}
            <div className="lg:w-2/3">
              <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl aspect-video relative group">
                {currentVideoId ? (
                  <iframe 
                    className="w-full h-full" 
                    src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                    title="Sermon Player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white">
                    {isLoading ? (
                      <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-royal-gold/20 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-royal-gold" />
                        </div>
                        <p className="text-sm font-medium tracking-widest uppercase opacity-50">Loading Latest Sermon...</p>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center gap-4 text-white/50">
                        <VideoOff className="w-12 h-12" />
                        <p className="text-xs uppercase tracking-widest">Unable to load video</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="mt-8">
                {currentSermon && (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-royal-gold/10 text-royal-gold text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Now Playing</span>
                      <span className="text-slate-400 text-xs">{currentSermon.publishedAt}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-royal-blue leading-tight">{currentSermon.title}</h2>
                    <p className="text-slate-600 mt-4 leading-relaxed text-sm md:text-base whitespace-pre-line">{currentSermon.description}</p>
                  </>
                )}
              </div>
            </div>

            {/* Sermon List Area */}
            <div className="lg:w-1/3 flex flex-col">
              <div className="bg-slate-50 rounded-3xl border border-slate-200 flex flex-col h-[500px] lg:h-[650px] overflow-hidden shadow-inner">
                <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
                  <h3 className="font-bold text-royal-blue flex items-center gap-2">
                    <ListVideo className="w-5 h-5 text-royal-gold" />
                    Recent Sermons
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{filteredSermons.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  {isLoading && allSermons.length === 0 && (
                    Array.from({ length: 10 }).map((_, i) => <SermonItemSkeleton key={i} />)
                  )}

                  {error && (
                    <div className="flex flex-col items-center justify-center py-10 text-red-500 px-4 text-center">
                      <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm font-bold uppercase tracking-widest mb-1">Error Loading Sermons</p>
                      <p className="text-xs text-slate-500">{error}</p>
                      <button onClick={() => fetchSermons()} className="mt-4 text-xs font-bold text-royal-blue underline">Try Again</button>
                    </div>
                  )}
                  
                  {filteredSermons.length === 0 && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <Search className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-sm font-medium">No sermons found matching "{searchTerm}"</p>
                    </div>
                  )}

                  {filteredSermons.map((sermon) => (
                    <div 
                      key={sermon.id}
                      onClick={() => {
                        setCurrentVideoId(sermon.id);
                        const section = document.getElementById('sermons-section');
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`p-4 rounded-2xl cursor-pointer transition-all hover:bg-white hover:shadow-md group border border-transparent ${currentVideoId === sermon.id ? 'bg-royal-blue text-white shadow-xl' : 'bg-white/50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${currentVideoId === sermon.id ? 'bg-royal-gold text-royal-blue' : 'bg-royal-gold/10 text-royal-gold group-hover:bg-royal-gold group-hover:text-royal-blue'}`}>
                          <Play className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-sm leading-snug line-clamp-2 transition-colors ${currentVideoId === sermon.id ? 'text-white' : 'text-royal-blue'}`}>{sermon.title}</h4>
                          <p className={`text-[10px] mt-1 font-medium uppercase tracking-wider ${currentVideoId === sermon.id ? 'text-white/60' : 'text-slate-400'}`}>{sermon.publishedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-slate-200 bg-white text-center">
                  {nextPageToken && (
                    <button 
                      onClick={() => fetchSermons(nextPageToken)}
                      disabled={isLoading}
                      className="w-full py-3 bg-slate-50 text-royal-blue font-bold rounded-xl hover:bg-royal-blue hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-royal-blue"></div>
                      ) : (
                        <>
                          <span>See More Sermons</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Telegram Audio Card */}
              <div className="mt-6 bg-royal-blue rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -m-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-royal-gold rounded-2xl flex items-center justify-center text-royal-blue mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform">
                    <Play className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">Audio Sermons</h3>
                  <p className="text-white/70 text-sm mb-8 leading-relaxed">All audio sermons are in our Telegram channel for easy download. It's open to anyone who wants to get the Word on the go!</p>
                  <a 
                    href="https://t.me/+c-qcHSR4-2U0YTA0" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full bg-royal-gold text-royal-blue py-4 rounded-xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    Open Telegram <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <a 
              href="https://youtube.com/@louderfellowship1828" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-xl hover:scale-105"
            >
              <Youtube />
              Subscribe to our YouTube Channel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
