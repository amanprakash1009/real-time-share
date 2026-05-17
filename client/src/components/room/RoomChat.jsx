import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useAuthStore } from '../../store/authStore';
import { timeAgo } from '../../utils/fileUtils';

/**
 * RoomChat — real-time chat sidebar panel.
 */
const RoomChat = ({ messages = [], onSend }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend?.(text);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
        <MessageSquare size={15} className="text-slate-400" />
        <span className="text-sm font-semibold text-white">Room Chat</span>
        <span className="ml-auto text-xs text-slate-600">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">No messages yet</p>
            <p className="text-xs text-slate-600 mt-1">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.sender?.id === user?.id;
            return (
              <motion.div
                key={msg._id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}
              >
                <Avatar name={msg.sender?.name || '?'} size="xs" />
                <div className={`max-w-[78%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <span className="text-[10px] text-slate-500">{msg.sender?.name}</span>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-violet-600/30 text-violet-100 rounded-tr-sm'
                        : 'bg-white/5 text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-600">{timeAgo(msg.createdAt)}</span>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/8">
        <div className="flex items-center gap-2 px-3 py-2 glass rounded-xl border border-white/10 focus-within:border-violet-500/40 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 disabled:opacity-30 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
