"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout";
import {
  Upload,
  Image,
  Video,
  Plus,
  Search,
  Grid3X3,
  List,
} from "lucide-react";

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFiles([]);
      console.log("Files uploaded:", selectedFiles);
    }, 2000);
  };

  // Custom navigation configuration
  const navigationConfig = {
    backgroundColor: "bg-gradient-to-r from-purple-900/50 to-pink-900/50",
    logoText: "BF",
    content: (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1"></div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-white">Online Gallery</h1>
          <p className="text-purple-200">Store and organize your media files</p>
        </div>
        <div className="flex-1 flex justify-end">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 px-8 py-3 text-lg"
          >
            <Plus className="w-6 h-6 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>
    ),
  };

  return (
    <Layout navigation={navigationConfig}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Upload Section */}
          {selectedFiles.length > 0 && (
            <Card className="mb-8 border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10 border border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload {selectedFiles.length} File
                  {selectedFiles.length > 1 ? "s" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        {file.type.startsWith("image/") ? (
                          <Image className="w-8 h-8 text-purple-400" />
                        ) : (
                          <Video className="w-8 h-8 text-pink-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                    >
                      {isUploading ? "Uploading..." : "Start Upload"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFiles([])}
                      disabled={isUploading}
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search media files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-purple-500 text-white"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-purple-500 text-white"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Gallery Content */}
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
              <Image className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Your Gallery is Empty
            </h3>
            <p className="text-gray-400 mb-6">
              Start by uploading some images or videos to create your personal
              gallery
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Your First File
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Layout>
  );
}
