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

  const fileTypeInfo = getFileTypeInfo(file.mime_type, file.category);
  const fileSize = file.file_size ? (parseInt(file.file_size) / 1024 / 1024).toFixed(2) : 'Unknown';

  const handleDownload = () => {
    const link = document.createElement('a');
    // Use cloud_url if available, otherwise construct from cloud_key
    const downloadUrl = file.presignedUrl ||  '';
    link.href = downloadUrl;
    link.download = file.original_name || file.filename;
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
    // Construct preview URL from available fields
    const previewUrl = file.presignedUrl ||  '';

    if (!previewUrl) {
      return (
        <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <p>Preview not available</p>
            <p className="text-sm">File: {file.original_name || file.filename}</p>
          </div>
        </div>
      );
    }

    if (file.category === 'image' || file.mime_type?.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img
            src={previewUrl}
            alt={file.original_name}
            className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
          />
        </div>
      );
    }

    if (file.category === 'video' || file.mime_type?.startsWith('video/')) {
      return (
        <div className="flex flex-col items-center">
          <video
            controls
            className="max-w-full max-h-96 rounded-lg shadow-lg"
            preload="metadata"
            onLoadStart={() => console.log('Video loading started')}
            onLoadedData={() => console.log('Video data loaded')}
            onCanPlay={() => console.log('Video can play')}
            crossOrigin="anonymous"
          >
            <source src={previewUrl} type={file.mime_type} />
            <source src={previewUrl} type="video/mp4" />
            <source src={previewUrl} type="video/quicktime" />
            Your browser does not support the video tag.
          </video>

        </div>
      );
    }

    if (file.category === 'audio' || file.mime_type?.startsWith('audio/')) {
      return (
        <div className="flex justify-center">
          <audio
            controls
            className="max-w-full rounded-lg shadow-lg"
            preload="metadata"
          >
            <source src={previewUrl} type={file.mime_type} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // For documents, show a preview if possible, otherwise show file info
    if (file.mime_type === 'application/pdf') {
      return (
        <div className="flex justify-center">
          <iframe
            src={`${previewUrl}#toolbar=0`}
            className="w-full h-96 rounded-lg shadow-lg"
            title={file.original_name}
          />
        </div>
      );
    }

    // Default fallback for other file types
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center text-gray-500">
          <p>Preview not available for this file type</p>
          <p className="text-sm">File: {file.original_name || file.filename}</p>
        </div>
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
              {file.original_name || file.filename}
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
                {file.created_at ? new Date(file.created_at).toLocaleDateString() : 'Unknown'}
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
