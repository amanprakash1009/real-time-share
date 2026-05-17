import { motion } from 'framer-motion';
import { Download, Trash2, Eye, FileText, Image, Film, Music, Archive, Code2, File } from 'lucide-react';
import { getFileCategory, getCategoryColor, formatFileSize, timeAgo } from '../../utils/fileUtils';

// Map category → icon component
const categoryIcons = {
  image:    Image,
  video:    Film,
  audio:    Music,
  pdf:      FileText,
  code:     Code2,
  archive:  Archive,
  document: FileText,
  other:    File,
};

/**
 * FileCard — displays a shared file with preview, download, and delete actions.
 */
const FileCard = ({ file, onDownload, onDelete, onPreview, uploadProgress }) => {
  const category = getFileCategory(file.name || file.originalName || '');
  const colors = getCategoryColor(category);
  const Icon = categoryIcons[category] || File;
  const isUploading = uploadProgress !== undefined && uploadProgress < 100;
  const ext = (file.name || file.originalName || '').split('.').pop()?.toUpperCase() || '?';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2 }}
      className={`glass-hover rounded-2xl p-4 flex flex-col gap-3 ${isUploading ? 'opacity-80' : ''}`}
    >
      {/* File type icon + name */}
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}
        >
          <Icon size={22} className={colors.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate" title={file.name || file.originalName}>
            {file.name || file.originalName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
              {ext}
            </span>
            <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
          </div>
        </div>
      </div>

      {/* Upload progress bar */}
      {isUploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Uploading…</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Uploader + time */}
      {!isUploading && (
        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>by {file.uploadedBy?.name || 'Unknown'}</span>
          <span>{timeAgo(file.createdAt)}</span>
        </div>
      )}

      {/* Actions */}
      {!isUploading && (
        <div className="flex items-center gap-2 pt-1 border-t border-white/8">
          {onPreview && (
            <button
              onClick={() => onPreview(file)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Eye size={13} /> Preview
            </button>
          )}
          {onDownload && (
            <button
              onClick={() => onDownload(file)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Download size={13} /> Download
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(file._id)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FileCard;
