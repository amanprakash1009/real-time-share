import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CloudUpload } from 'lucide-react';

/**
 * FileUploadZone — drag-and-drop file upload area.
 * Calls onFiles(FileList/Array) when files are selected or dropped.
 */
const FileUploadZone = ({ onFiles, isUploading = false }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0 && onFiles) {
        onFiles(acceptedFiles);
      }
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-default ${
        isDragActive
          ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
          : 'border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="drag"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <CloudUpload size={32} className="text-violet-400" />
              </div>
              <p className="text-lg font-semibold text-violet-300">Drop to upload</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Upload size={28} className="text-slate-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-1">
                  Drag & drop files here
                </p>
                <p className="text-sm text-slate-500">or</p>
              </div>
              <button
                type="button"
                onClick={open}
                disabled={isUploading}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm text-slate-300 hover:text-white transition-all disabled:opacity-50"
              >
                Browse files
              </button>
              <p className="text-xs text-slate-600">All file types supported · Up to 2 GB each</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileUploadZone;
