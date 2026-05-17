/**
 * fileUtils.js — File type detection, icon color, size formatting helpers.
 */

export const FILE_CATEGORIES = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'],
  video: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv'],
  audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'],
  pdf: ['pdf'],
  code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'sh', 'yaml', 'yml', 'md', 'txt', 'xml', 'sql'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
  document: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'],
};

/**
 * Get the category of a file by its extension.
 * @param {string} filename
 * @returns {string} category key
 */
export const getFileCategory = (filename = '') => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  for (const [category, extensions] of Object.entries(FILE_CATEGORIES)) {
    if (extensions.includes(ext)) return category;
  }
  return 'other';
};

/**
 * Get Tailwind color classes for a given file category.
 */
export const getCategoryColor = (category) => {
  const colors = {
    image:    { bg: 'bg-pink-500/15',   text: 'text-pink-400',   border: 'border-pink-500/20' },
    video:    { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/20' },
    audio:    { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/20' },
    pdf:      { bg: 'bg-rose-500/15',   text: 'text-rose-400',   border: 'border-rose-500/20' },
    code:     { bg: 'bg-emerald-500/15',text: 'text-emerald-400',border: 'border-emerald-500/20' },
    archive:  { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/20' },
    document: { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/20' },
    other:    { bg: 'bg-slate-500/15',  text: 'text-slate-400',  border: 'border-slate-500/20' },
  };
  return colors[category] || colors.other;
};

/**
 * Format bytes to human-readable size.
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export const formatFileSize = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Format a Date or ISO string to a friendly relative time string.
 * @param {string|Date} date
 * @returns {string}
 */
export const timeAgo = (date) => {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/**
 * Check if a file is previewable in-browser.
 */
export const isPreviewable = (filename) => {
  const cat = getFileCategory(filename);
  return ['image', 'video', 'audio', 'pdf', 'code'].includes(cat);
};
