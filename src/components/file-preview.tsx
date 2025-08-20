import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';
import { UploadFile } from '@/hooks/queries/use-uploads';

interface FilePreviewProps {
  file: UploadFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!file) return null;

  const getFileTypeInfo = (mimeType: string | undefined, category?: string) => {
    if (category) {
      switch (category) {
        case 'image':
          return { type: 'IMAGE', color: 'text-purple-400' };
        case 'video':
          return { type: 'VIDEO', color: 'text-pink-400' };
        case 'audio':
          return { type: 'AUDIO', color: 'text-green-400' };
        case 'document':
          return { type: 'DOCUMENT', color: 'text-blue-400' };
      }
    }

    if (mimeType?.startsWith('image/')) {
      return { type: 'IMAGE', color: 'text-purple-400' };
    } else if (mimeType?.startsWith('video/')) {
      return { type: 'VIDEO', color: 'text-pink-400' };
    } else if (mimeType?.startsWith('audio/')) {
      return { type: 'AUDIO', color: 'text-green-400' };
    } else {
      return { type: 'DOCUMENT', color: 'text-blue-400' };
    }
  };

  const fileTypeInfo = getFileTypeInfo(file.mimeType, file.category);
  const fileSize = file.size ? (parseInt(file.size.toString()) / 1024 / 1024).toFixed(2) : 'Unknown';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.downloadUrl || file.url;
    link.download = file.originalName || file.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderPreview = () => {
    if (file.category === 'image' || file.mimeType?.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img
            src={file.url}
            alt={file.originalName}
            className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
          />
        </div>
      );
    }

    if (file.category === 'video' || file.mimeType?.startsWith('video/')) {
      return (
        <div className="flex justify-center">
          <video
            src={file.url}
            controls
            className="max-w-full max-h-96 rounded-lg shadow-lg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            muted={isMuted}
          />
        </div>
      );
    }

    if (file.category === 'audio' || file.mimeType?.startsWith('audio/')) {
      return (
        <div className="flex justify-center">
          <audio
            src={file.url}
            controls
            className="w-full max-w-md"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            muted={isMuted}
          />
        </div>
      );
    }

    // For documents, show a preview if possible, otherwise show file info
    if (file.mimeType === 'application/pdf') {
      return (
        <div className="flex justify-center">
          <iframe
            src={`${file.url}#toolbar=0`}
            className="w-full h-96 rounded-lg shadow-lg"
            title={file.originalName}
          />
        </div>
      );
    }

    // Generic document view
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
          <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">Document Preview</h3>
        <p className="text-gray-400 mb-4">
          This document type doesn't support preview. Click download to view.
        </p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/20" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${fileTypeInfo.color.replace('text-', 'bg-')}`}></div>
            <DialogTitle className="text-white text-lg font-semibold">
              {file.originalName || file.filename}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-10 h-10" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-gray-500">Size:</span>
              <p className="font-medium">{fileSize} MB</p>
            </div>
            <div>
              <span className="text-gray-500">Uploaded:</span>
              <p className="font-medium">
                {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Category:</span>
              <p className="font-medium capitalize">{file.category}</p>
            </div>
          </div>

          {/* File Preview */}
          <div className="bg-black/20 rounded-lg p-6 border border-purple-500/20">
            {renderPreview()}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
            >
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
