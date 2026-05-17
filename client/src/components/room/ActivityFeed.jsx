import { motion, AnimatePresence } from 'framer-motion';
import { Activity, UserPlus, UserMinus, Upload, Trash2 } from 'lucide-react';
import { timeAgo } from '../../utils/fileUtils';

const eventIcons = {
  'user:joined':    { icon: UserPlus,  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'user:left':      { icon: UserMinus, color: 'text-slate-500',   bg: 'bg-slate-500/10' },
  'file:uploaded':  { icon: Upload,    color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  'file:deleted':   { icon: Trash2,    color: 'text-red-400',     bg: 'bg-red-500/10' },
};

/**
 * ActivityFeed — live room event timeline.
 */
const ActivityFeed = ({ events = [] }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
        <Activity size={15} className="text-slate-400" />
        <span className="text-sm font-semibold text-white">Activity</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center mb-3">
              <Activity size={20} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {events.map((evt, i) => {
                const config = eventIcons[evt.type] || { icon: Activity, color: 'text-slate-400', bg: 'bg-slate-500/10' };
                const Icon = config.icon;
                return (
                  <motion.div
                    key={evt._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={13} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 leading-relaxed">{evt.message}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(evt.createdAt)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
