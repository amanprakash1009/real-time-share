import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import Avatar from '../ui/Avatar';

/**
 * ConnectedUsers — live panel showing who's in the room.
 */
const ConnectedUsers = ({ users = [] }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
        <Users size={15} className="text-slate-400" />
        <span className="text-sm font-semibold text-white">People</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          {users.length} online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center mb-3">
              <Users size={20} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">No one here yet</p>
          </div>
        ) : (
          users.map((user, i) => (
            <motion.div
              key={user.id || i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Avatar name={user.name || '?'} size="sm" status="online" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-600 truncate">{user.email || 'Guest'}</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Live</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConnectedUsers;
