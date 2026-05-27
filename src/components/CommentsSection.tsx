import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Props {
  testimonyId: string;
}

export default function CommentsSection({ testimonyId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, testimonyId]);

  const fetchComments = async () => {
    setIsLoading(true);
    setFetchError(false);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`/api/comments/${testimonyId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setComments(await response.json());
      } else {
        setFetchError(true);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/comments/${testimonyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content })
      });
      if (response.ok) {
        const newComment = await response.json();
        setComments(prev => [newComment, ...prev]);
        setAuthor('');
        setContent('');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 group ${
          isOpen 
            ? 'bg-royal-blue text-white shadow-lg' 
            : 'bg-slate-50 text-slate-500 hover:bg-royal-blue/5 hover:text-royal-blue'
        }`}
      >
        <div className="relative">
          <MessageSquare className={`w-4 h-4 ${isOpen ? 'text-white' : 'text-royal-blue'}`} />
          {comments.length > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 bg-royal-gold text-royal-blue text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white">
              {comments.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">
          {isOpen ? 'Hide Comments' : `View Comments (${comments.length})`}
        </span>
        {isOpen ? <ChevronUp className="w-3 h-3 opacity-50" /> : <ChevronDown className="w-3 h-3 opacity-50 group-hover:translate-y-0.5 transition-transform" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pt-8">
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-100">
                {isLoading ? (
                  <div className="flex flex-col items-center py-10 gap-3">
                    <div className="w-8 h-8 border-3 border-royal-blue/20 border-t-royal-blue rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Loading conversation...</p>
                  </div>
                ) : fetchError ? (
                  <div className="text-center py-10">
                    <p className="text-xs text-red-400 font-medium mb-3">Failed to load comments</p>
                    <button onClick={fetchComments} className="text-[10px] font-black uppercase tracking-widest text-royal-blue hover:underline">Retry</button>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative">
                      <div className="flex justify-between items-start mb-2 text-[10px] font-black uppercase tracking-widest text-royal-blue">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-royal-gold"></span>
                          {c.author}
                        </div>
                        <span className="text-slate-400 font-medium lowercase italic">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{c.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-royal-blue/5 p-6 rounded-[2rem] border border-royal-blue/10">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-3 h-3 text-royal-blue" />
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-royal-blue">Add a word of encouragement</h5>
                </div>
                <input 
                  placeholder="Your Name" 
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-white border border-transparent focus:border-royal-gold focus:ring-4 focus:ring-royal-gold/10 outline-none transition-all text-sm"
                  required
                />
                <textarea 
                  placeholder="Share a message..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-white border border-transparent focus:border-royal-gold focus:ring-4 focus:ring-royal-gold/10 outline-none transition-all text-sm h-28 resize-none"
                  rows={3}
                  required
                />
                <button 
                  disabled={isSubmitting} 
                  className="w-full bg-royal-blue text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-royal-gold hover:text-royal-blue transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-3 h-3"/> Post Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
