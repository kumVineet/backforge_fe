"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, Video, Upload, Plus, X, Trash2, Grid3X3, List } from 'lucide-react';
import { useMyFiles } from '@/hooks/queries';
import { useUploadFile, useDeleteFile } from '@/hooks/mutations';
import { UploadFile } from '@/hooks/queries/use-uploads';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { Layout } from '@/components/layout';
import FilePreview from '@/components/file-preview';
import { AuthModal } from '@/components/auth';

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadingFiles, setUploadingFiles] = useState<Array<{
    id: string;
    file: File;
    cleanName: string;
    status: 'uploading' | 'success' | 'error';
    error?: string;
  }>>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    fileId: string | number | null;
    fileName: string;
  }>({ show: false, fileId: null, fileName: '' });

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // File preview state
  const [previewFile, setPreviewFile] = useState<UploadFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Authentication modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication status
  const { isAuthenticated } = useAuthStatus();

  // Fetch user files using the new hook - only when authenticated
  const { data: filesResponse, isLoading, error } = useMyFiles({
    enabled: isAuthenticated
  });

  // Extract files and pagination from response
  const userFiles = filesResponse?.files || [];
  const pagination = filesResponse?.pagination;

  // Show welcome message when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && authModalOpen) {
      setAuthModalOpen(false);
      showToast('Welcome! You can now upload and manage your files.', 'success');
    }
  }, [isAuthenticated, authModalOpen]);

  // Upload mutation hook
  const uploadMutation = useUploadFile();

  // Delete mutation hook
  const deleteFile = useDeleteFile();

  // Pagination logic - use API pagination if available, fallback to client-side
  const totalPages = pagination?.pages || Math.ceil(userFiles.length / 20);
  const currentFiles = userFiles;

  const handlePageChange = (page: number) => {
    // TODO: If implementing server-side pagination, you would call the API here
    // with the new page number, e.g., refetch({ queryKey: uploadKeys.myFiles(), variables: { page } })
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (uploadingFiles.length > 0) {
      // Remove successful uploads after 3 seconds
      const timer = setTimeout(() => {
        setUploadingFiles(prev => prev.filter(file => file.status !== 'success'));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadingFiles]);

  // Function to remove upload card
  const removeUploadCard = (uploadId: string) => {
    setUploadingFiles(prev => prev.filter(file => file.id !== uploadId));
  };

  // Function to get file type icon and color
  const getFileTypeInfo = (mimeType: string | undefined, category?: string) => {
    // If category is provided, use it for more accurate detection
    if (category) {
      switch (category) {
        case 'image':
          return {
            icon: <Image className="w-16 h-16 text-purple-400" />,
            dotColor: 'bg-purple-400',
            type: 'IMAGE'
          };
        case 'video':
          return {
            icon: <Video className="w-16 h-16 text-pink-400" />,
            dotColor: 'bg-pink-400',
            type: 'VIDEO'
          };
        case 'audio':
          return {
            icon: (
              <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            ),
            dotColor: 'bg-green-400',
            type: 'AUDIO'
          };
        case 'document':
          return {
            icon: (
              <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            dotColor: 'bg-blue-400',
            type: 'DOCUMENT'
          };
      }
    }

    // Fallback to MIME type detection if no category
    if (mimeType?.startsWith('image/')) {
      return {
        icon: <Image className="w-16 h-16 text-purple-400" />,
        dotColor: 'bg-purple-400',
        type: 'IMAGE'
      };
    } else if (mimeType?.startsWith('video/')) {
      return {
        icon: <Video className="w-16 h-16 text-pink-400" />,
        dotColor: 'bg-pink-400',
        type: 'VIDEO'
      };
    } else if (mimeType === 'application/pdf') {
      return {
        icon: (
          <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2v3a1 1 0 001 1h3" />
          </svg>
        ),
        dotColor: 'bg-red-400',
        type: 'PDF'
      };
    } else if (mimeType?.startsWith('text/') || mimeType?.includes('document') || mimeType?.includes('word') || mimeType?.includes('excel') || mimeType?.includes('powerpoint')) {
      return {
        icon: (
          <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        dotColor: 'bg-blue-400',
        type: 'DOCUMENT'
      };
    } else {
      // Default for unknown file types
      return {
        icon: (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        dotColor: 'bg-gray-400',
        type: 'FILE'
      };
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      showToast('Please log in to upload files', 'error');
      return;
    }

    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    files.forEach(async (file) => {
      // Validate file type and size
      const allowedTypes = ['image/', 'video/', 'audio/', 'application/'];
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes

      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        showToast(`File type ${file.type} is not supported`, 'error');
        return;
      }

      if (file.size > maxSize) {
        showToast(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds the limit of ${maxSize / 1024 / 1024}MB`, 'error');
        return;
      }

      // Clean filename by removing spaces and special characters
      const cleanFileName = file.name
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9._-]/g, '') // Remove special characters except dots, underscores, and hyphens
        .replace(/_{2,}/g, '_') // Replace multiple underscores with single
        .replace(/\.{2,}/g, '.'); // Replace multiple dots with single

      const fileBlob = new Blob([file], { type: file.type });
      const cleanFile = new File([fileBlob], cleanFileName, { type: file.type });

      // Add to uploading files
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setUploadingFiles(prev => [...prev, {
        id: uploadId,
        file: cleanFile,
        cleanName: cleanFileName,
        status: 'uploading'
      }]);

      try {
        await uploadMutation.mutateAsync(cleanFile);

        // Update status to success
        setUploadingFiles(prev => prev.map(f =>
          f.id === uploadId ? { ...f, status: 'success' as const } : f
        ));

        // Show success toast
        showToast(`File "${cleanFileName}" uploaded successfully!`, 'success');

      } catch (error) {
        console.error('Upload failed:', error);

        // Update status to error
        setUploadingFiles(prev => prev.map(f =>
          f.id === uploadId ? { ...f, status: 'error' as const, error: 'Upload failed' } : f
        ));

        // Show error toast
        showToast(`Failed to upload "${cleanFileName}"`, 'error');
      }
    });

    // Reset file input
    event.target.value = '';
  };

  // Handle file deletion with confirmation
  const handleDeleteFile = (fileId: string | number, fileName: string) => {
    if (!isAuthenticated) {
      showToast('Please log in to delete files', 'error');
      return;
    }

    setShowDeleteConfirm({
      show: true,
      fileId,
      fileName
    });
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!showDeleteConfirm.fileId) return;

    try {
      await deleteFile.mutateAsync(showDeleteConfirm.fileId);
      setShowDeleteConfirm({ show: false, fileId: null, fileName: '' });

      // Show success toast
      showToast(`File "${showDeleteConfirm.fileName}" deleted successfully`, 'success');

    } catch (error) {
      console.error('Failed to delete file:', error);

      // Show error toast
      showToast(`Failed to delete file "${showDeleteConfirm.fileName}"`, 'error');

      // Keep the modal open so user can try again
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm({ show: false, fileId: null, fileName: '' });
  };

  // Helper function to show toast notifications
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    const timeout = setTimeout(() => setToast({ show: false, message: '', type: 'success' }), type === 'success' ? 3000 : 5000);
    return () => clearTimeout(timeout);
  };

  // Handle file preview
  const handleFilePreview = (file: UploadFile) => {
    if (!isAuthenticated) {
      showToast('Please log in to preview files', 'error');
      return;
    }

    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  // Handle authentication modal
  const handleOpenSignIn = () => {
    setAuthMode("signin");
    setAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    showToast('Welcome! You can now upload and manage your files.', 'success');
  };

  // Custom navigation configuration
  const navigationConfig = {
    backgroundColor: 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900',
    logoText: 'BF',
    content: (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-purple-200">Your personal file collection</p>
        </div>
      </div>
    ),
  };

  return (
    <Layout navigation={navigationConfig}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center mb-4">
                <Trash2 className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Delete File</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-medium">"{showDeleteConfirm.fileName}"</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={deleteFile.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={confirmDelete}
                  disabled={deleteFile.isPending}
                >
                  {deleteFile.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        {toast.show && (
          <div className="fixed top-4 right-4 z-50">
            <div className={`px-6 py-4 rounded-lg shadow-lg max-w-sm ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {toast.type === 'success' ? (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{toast.message}</span>
                </div>
                <button
                  onClick={() => setToast({ show: false, message: '', type: 'success' })}
                  className="ml-4 text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        <FilePreview
          file={previewFile}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewFile(null);
          }}
        />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={handleCloseAuthModal}
          initialMode={authMode}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1 border border-white/20">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`${
                    viewMode === "grid"
                      ? "bg-purple-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`${
                    viewMode === "grid"
                      ? "text-gray-400 hover:text-white"
                      : "bg-purple-500 text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              {!isAuthenticated && (
                <div className="text-sm text-gray-400 bg-yellow-500/20 px-3 py-1 rounded-lg border border-yellow-500/30 flex items-center space-x-3">
                  <span>👋 Browse gallery layouts - <span className="text-yellow-300">Login to upload & manage files</span></span>
                  <Button
                    size="sm"
                    onClick={handleOpenSignIn}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={!isAuthenticated}
                className={`${
                  isAuthenticated
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                    : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
                }`}
                title={!isAuthenticated ? "Please log in to upload files" : "Upload files to your gallery"}
              >
                <Plus className="w-5 h-5 mr-2" />
                {isAuthenticated ? "Upload File" : "Login to Upload"}
              </Button>
            </div>
          </div>

          {/* Gallery Content */}
          {!isAuthenticated ? (
            // Not Authenticated State
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Authentication Required</h3>
              <p className="text-gray-400 mb-6">Please log in to access your gallery</p>
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={handleOpenSignIn}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg shadow-red-500/25"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleOpenSignUp}
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  Create Account
                </Button>
              </div>
            </div>
          ) : isLoading ? (
            // Loading State - only show when authenticated
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Loading Your Gallery</h3>
              <p className="text-gray-400">Please wait while we fetch your files...</p>
            </div>
          ) : error ? (
            // Error State - only show when authenticated
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Error Loading Gallery</h3>
              <p className="text-gray-400 mb-6">Unable to load your files. Please try again later.</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg shadow-red-500/25"
              >
                Retry
              </Button>
            </div>
          ) : userFiles.length === 0 && uploadingFiles.length === 0 ? (
            // Empty Gallery State
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <Image className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Your Gallery is Empty</h3>
              <p className="text-gray-400 mb-6">
                Start by uploading some images or videos to create your personal gallery
              </p>
              <Button
                onClick={() => isAuthenticated && fileInputRef.current?.click()}
                disabled={!isAuthenticated}
                className={`${
                  isAuthenticated
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                    : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
                }`}
                title={!isAuthenticated ? "Please log in to upload files" : "Upload your first file"}
              >
                <Plus className="w-5 h-5 mr-2" />
                {isAuthenticated ? "Upload Your First File" : "Login to Upload"}
              </Button>
            </div>
          ) : (
            // Gallery Grid with Files
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Your Gallery ({pagination?.total || userFiles.length} files)
              </h3>

              {/* Gallery Grid */}
              <div className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-3"
              }`}>
                {/* Add File Card - Always First */}
                <Card
                  className={`border-0 backdrop-blur-xl shadow-2xl transition-all duration-500 border cursor-pointer group ${
                    viewMode === "grid"
                      ? "min-h-[200px] flex items-center justify-center"
                      : "flex items-center p-4"
                  } ${
                    isAuthenticated
                      ? "bg-gradient-to-br from-gray-500/20 to-gray-600/20 shadow-gray-500/10 hover:shadow-gray-500/20 hover:scale-105"
                      : "bg-gray-500/10 shadow-gray-500/5 cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => isAuthenticated && fileInputRef.current?.click()}
                >
                  <div className={`text-center ${viewMode === "list" ? "flex items-center space-x-4" : ""}`}>
                    <Plus className={`${
                      viewMode === "grid"
                        ? "w-12 h-12 text-gray-400 mx-auto mb-2 group-hover:text-gray-300 transition-colors duration-300"
                        : "w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                    } ${!isAuthenticated ? "text-gray-500" : ""}`} />
                    <p className={`text-gray-400 text-sm font-medium transition-colors duration-300 ${
                      viewMode === "list" ? "mb-0" : ""
                    } ${!isAuthenticated ? "text-gray-500" : "group-hover:text-gray-300"}`}>
                      {isAuthenticated ? "Add File" : "Login to Add Files"}
                    </p>
                  </div>
                </Card>

                {/* Upload Progress Cards */}
                {uploadingFiles.map((uploadFile) => (
                  <Card
                    key={uploadFile.id}
                    className={`border-0 backdrop-blur-xl shadow-2xl transition-all duration-500 overflow-hidden ${
                      viewMode === "grid"
                        ? "min-h-[200px] flex items-center justify-center"
                        : "flex items-center p-4"
                    } ${
                      uploadFile.status === 'uploading'
                        ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20'
                        : uploadFile.status === 'success'
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20'
                        : 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/20'
                    }`}
                  >
                    <div className={`text-center ${viewMode === "list" ? "flex items-center space-x-4 w-full" : "p-4"}`}>
                      {uploadFile.status === 'uploading' && (
                        <>
                          <div className={`${
                            viewMode === "grid"
                              ? "w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                              : "w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"
                          }`}></div>
                          <div className={viewMode === "list" ? "flex-1 text-left" : ""}>
                            <p className="text-blue-300 text-sm font-medium mb-1">Uploading...</p>
                            <p className="text-blue-200 text-xs truncate px-2 text-center">
                              {uploadFile.cleanName}
                            </p>
                          </div>
                        </>
                      )}

                      {uploadFile.status === 'success' && (
                        <>
                          <div className={`${
                            viewMode === "grid"
                              ? "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3"
                              : "w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                          }`}>
                            <svg className={`${
                              viewMode === "grid" ? "w-6 h-6" : "w-4 h-4"
                            } text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className={viewMode === "list" ? "flex-1 text-left" : ""}>
                            <p className="text-green-300 text-sm font-medium mb-1">Uploaded!</p>
                            <p className="text-green-200 text-xs max-w-full truncate px-2 text-center">
                              {uploadFile.cleanName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadCard(uploadFile.id)}
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/20 p-1 h-6 w-6 mt-2"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L6 6M6 6l12 12" />
                            </svg>
                          </Button>
                        </>
                      )}

                      {uploadFile.status === 'error' && (
                        <>
                          <div className={`${
                            viewMode === "grid"
                              ? "w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3"
                              : "w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                          }`}>
                            <svg className={`${
                              viewMode === "grid" ? "w-6 h-6" : "w-4 h-4"
                            } text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <div className={viewMode === "list" ? "flex-1 text-left" : ""}>
                            <p className="text-red-300 text-sm font-medium mb-1">Upload Failed</p>
                            <p className="text-red-200 text-xs max-w-full truncate px-2 text-center">
                              {uploadFile.cleanName}
                            </p>
                            <p className="text-red-200 text-xs mt-1 px-2 text-center max-w-full truncate">
                              {uploadFile.error}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadCard(uploadFile.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1 h-6 w-6 mt-2"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L6 6M6 6l12 12" />
                            </svg>
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                ))}

                {/* File Cards */}
                {currentFiles.map((file) => {
                  const fileTypeInfo = getFileTypeInfo(file.mimeType, file.category);

                  return (
                    <Card
                      key={file.id}
                      className={`border-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 border border-purple-500/20 overflow-hidden group relative ${
                        viewMode === "grid" ? "" : "flex items-center p-4"
                      } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      onClick={() => isAuthenticated && handleFilePreview(file)}
                    >
                      <CardContent className={`p-0 ${viewMode === "list" ? "w-full" : ""}`}>
                        {viewMode === "grid" ? (
                          // Grid View Layout
                          <>
                            {/* File Preview */}
                            <div className="relative h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                              {fileTypeInfo.icon}

                              {/* Delete Button - positioned over the preview */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-500/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isAuthenticated) {
                                      handleDeleteFile(file.id, file.originalName);
                                    } else {
                                      showToast('Please log in to delete files', 'error');
                                    }
                                  }}
                                  disabled={deleteFile.isPending || !isAuthenticated}
                                  title={!isAuthenticated ? "Please log in to delete files" : "Delete file"}
                                >
                                  {deleteFile.isPending ? (
                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* File Info */}
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${fileTypeInfo.dotColor}`}></div>
                                  <span className="text-xs text-gray-400 uppercase">
                                    {fileTypeInfo.type}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {file.size ? (parseInt(file.size.toString()) / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
                                </span>
                              </div>

                              <h4 className="font-medium text-white text-sm mb-2 truncate">
                                {file.originalName || file.filename || 'Untitled'}
                              </h4>

                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Unknown date'}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          // List View Layout
                          <>
                            {/* File Icon */}
                            <div className="flex items-center space-x-4 w-full">
                              <div className="flex-shrink-0">
                                {fileTypeInfo.icon}
                              </div>

                              {/* File Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-1">
                                  <h4 className="font-medium text-white text-sm truncate">
                                    {file.originalName || file.filename || 'Untitled'}
                                  </h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {fileTypeInfo.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-400">
                                  <span>{file.size ? (parseInt(file.size.toString()) / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}</span>
                                  <span>•</span>
                                  <span>{file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                                </div>
                              </div>

                              {/* Delete Button */}
                              <div className="flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-500/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isAuthenticated) {
                                      handleDeleteFile(file.id, file.originalName);
                                    } else {
                                      showToast('Please log in to delete files', 'error');
                                    }
                                  }}
                                  disabled={deleteFile.isPending || !isAuthenticated}
                                  title={!isAuthenticated ? "Please log in to delete files" : "Delete file"}
                                >
                                  {deleteFile.isPending ? (
                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination - Only show if API provides pagination data */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className={
                        pagination.page === page
                          ? "bg-purple-500 text-white"
                          : "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      }
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden file input for upload functionality */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </Layout>
  );
}
