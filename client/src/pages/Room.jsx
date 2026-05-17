import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Zap } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { useRoomStore } from '../store/roomStore';
import FileUploadZone from '../components/room/FileUploadZone';
import FileCard from '../components/room/FileCard';
import RoomChat from '../components/room/RoomChat';
import ActivityFeed from '../components/room/ActivityFeed';
import ConnectedUsers from '../components/room/ConnectedUsers';
import ShareLinkModal from '../components/room/ShareLinkModal';
import Button from '../components/ui/Button';
import { AvatarStack } from '../components/ui/Avatar';

/**
 * Room — the core real-time file sharing workspace.
 */
const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);

  // Initialize socket connection
  const { socket, isConnected, connectedUsers } = useSocket(roomId);
  
  // Room state
  const {
    files,
    messages,
    activity,
    uploadProgress,
    addFile,
    removeFile,
    addMessage,
    addActivity,
    updateUploadProgress,
    clearUploadProgress,
    setFiles,
    setMessages,
  } = useRoomStore();

  useEffect(() => {
    if (!socket) return;

    // Room initial data
    socket.on('room:data', (data) => {
      if (data.files) setFiles(data.files);
      if (data.messages) setMessages(data.messages);
    });

    // File events
    socket.on('file:new', (file) => {
      addFile(file);
      addActivity({ type: 'file:uploaded', message: `${file.uploadedBy?.name || 'Someone'} uploaded ${file.originalName}`, createdAt: new Date() });
    });

    socket.on('file:deleted', (fileId) => {
      removeFile(fileId);
      addActivity({ type: 'file:deleted', message: 'A file was deleted', createdAt: new Date() });
    });

    // Chat events
    socket.on('chat:message', (msg) => {
      addMessage(msg);
    });

    // Progress events (simulated for now, would typically come from axios upload onprogress)
    // In a real app, you'd upload via HTTP POST to an API, tracking progress there,
    // and then the API would emit the 'file:new' socket event upon completion.
  }, [socket, addFile, removeFile, addMessage, addActivity, setFiles, setMessages]);

  const handleFilesDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const tempId = Math.random().toString(36).substring(7);
      
      // Simulate upload progress
      updateUploadProgress(tempId, 0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        updateUploadProgress(tempId, progress);
        if (progress >= 100) {
          clearInterval(interval);
          clearUploadProgress(tempId);
          // Simulate server returning the new file
          addFile({
            _id: tempId,
            originalName: file.name,
            size: file.size,
            mimetype: file.type,
            createdAt: new Date(),
            uploadedBy: { name: 'You' }
          });
          addActivity({ type: 'file:uploaded', message: `You uploaded ${file.name}`, createdAt: new Date() });
        }
      }, 200);
    }
  };

  const handleSendMessage = (text) => {
    if (!socket) return;
    const msg = { text, roomId };
    socket.emit('chat:send', msg);
    // Optimistic UI update could go here, or rely on socket broadcast
  };

  const handleDeleteFile = (fileId) => {
    if (!socket) return;
    socket.emit('file:delete', { fileId, roomId });
    removeFile(fileId); // Optimistic delete
  };

  return (
    <div className="min-h-screen bg-[#060912] flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-white/8 glass flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="hidden sm:block text-white font-bold text-lg tracking-tight">
              Drop<span className="gradient-text-purple">Share</span>
            </span>
          </div>
          
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/8">
              Room: <span className="text-white font-bold">{roomId}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-xs font-medium text-slate-400">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AvatarStack users={connectedUsers} max={3} />
          <Button size="sm" onClick={() => setShareOpen(true)} leftIcon={<Share2 size={14} />}>
            Share
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Files Area */}
        <main className="flex-1 flex flex-col min-w-0 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full space-y-8">
            <FileUploadZone onFiles={handleFilesDrop} />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Shared Files</h2>
                <span className="text-xs text-slate-500">{files.length} files</span>
              </div>
              
              {files.length === 0 && Object.keys(uploadProgress).length === 0 ? (
                <div className="glass rounded-2xl border border-white/8 border-dashed p-12 text-center">
                  <p className="text-slate-400">No files shared yet. Drag some files above to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Render files currently uploading */}
                  {Object.entries(uploadProgress).map(([id, progress]) => (
                     <FileCard key={id} file={{ originalName: 'Uploading...', size: 0 }} uploadProgress={progress} />
                  ))}
                  {/* Render uploaded files */}
                  {files.map((file) => (
                    <FileCard 
                      key={file._id} 
                      file={file} 
                      onDelete={handleDeleteFile}
                      onDownload={() => console.log('Download', file)}
                      onPreview={() => console.log('Preview', file)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Side: Sidebar Panels (Chat & Activity & Users) */}
        <aside className="w-80 border-l border-white/8 bg-[#0a0d18] flex flex-col shrink-0">
          <div className="h-1/2 border-b border-white/8 min-h-[300px]">
            <RoomChat messages={messages} onSend={handleSendMessage} />
          </div>
          <div className="h-1/4 border-b border-white/8 min-h-[150px]">
             <ConnectedUsers users={connectedUsers} />
          </div>
          <div className="h-1/4 min-h-[150px]">
            <ActivityFeed events={activity} />
          </div>
        </aside>
      </div>

      <ShareLinkModal 
        isOpen={shareOpen} 
        onClose={() => setShareOpen(false)} 
        roomId={roomId} 
        roomCode={roomId} 
      />
    </div>
  );
};

export default Room;
