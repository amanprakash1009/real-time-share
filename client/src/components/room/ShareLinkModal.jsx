import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Link2, Share2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

/**
 * ShareLinkModal — popup to copy room invite link or code.
 */
const ShareLinkModal = ({ isOpen, onClose, roomId, roomCode }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const roomUrl = `${window.location.origin}/room/${roomId || roomCode}`;

  const copy = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite to Room" size="sm">
      <div className="space-y-5">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
            <Share2 size={24} className="text-white" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-400">
            Share this link or room code with anyone you want to collaborate with.
          </p>
        </div>

        {/* Room link */}
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Room Link
          </label>
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 border border-white/10">
            <Link2 size={14} className="text-slate-500 shrink-0" />
            <span className="flex-1 text-sm text-slate-300 truncate font-mono">{roomUrl}</span>
            <button
              onClick={() => copy(roomUrl, setCopiedLink)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors shrink-0"
            >
              {copiedLink ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Room code */}
        {roomCode && (
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Room Code
            </label>
            <div
              className="flex items-center justify-between px-4 py-3 glass rounded-xl border border-white/10 cursor-pointer hover:border-violet-500/30 transition-colors group"
              onClick={() => copy(roomCode, setCopiedCode)}
            >
              <span className="font-mono text-2xl font-bold tracking-[0.3em] text-white">
                {roomCode}
              </span>
              <div className="text-slate-500 group-hover:text-violet-400 transition-colors">
                {copiedCode ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </div>
            </div>
            {copiedCode && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-emerald-400 mt-1.5 text-center"
              >
                ✓ Copied to clipboard
              </motion.p>
            )}
          </div>
        )}

        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
};

export default ShareLinkModal;
