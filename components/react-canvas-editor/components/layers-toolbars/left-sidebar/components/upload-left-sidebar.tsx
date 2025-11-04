'use client';

import React, { useState, useCallback } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { useDropzone } from 'react-dropzone';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

const UploadLeftSidebar = () => {
  const { addElement, setSelectedId, canvasSize } = useEditor();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;
        
        const newImage: UploadedImage = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: dataUrl,
          name: file.name,
          size: file.size,
        };

        setUploadedImages((prev) => [newImage, ...prev]);
      };

      reader.readAsDataURL(file);
    });

    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: true,
  });

  const handleAddImage = useCallback((imageUrl: string) => {
    // Create a temporary image to get dimensions
    const img = new window.Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let width = 300;
      let height = 300;

      // Maintain aspect ratio
      if (aspectRatio > 1) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }

      const elementId = addElement('image', {
        src: imageUrl,
        x: canvasSize.width / 2 - width / 2,
        y: canvasSize.height / 2 - height / 2,
        width,
        height,
      });

      setSelectedId(elementId);
    };

    img.src = imageUrl;
  }, [addElement, canvasSize, setSelectedId]);

  const handleRemoveImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs defaultValue="upload" className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="upload">Upload Images</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upload" className="flex-1 flex flex-col px-4 pb-4">
          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-6 mb-4 cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              {isDragActive ? (
                <div>
                  <p className="text-sm font-medium">Drop images here...</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">
                    Drag & drop images here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Supports: PNG, JPG, GIF, WebP, SVG
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isUploading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
            </div>
          )}

          {/* Uploaded Images Grid */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">
                Uploaded Images ({uploadedImages.length})
              </h3>
            </div>

            <ScrollArea className="h-full pr-2">
              {uploadedImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No images uploaded yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload images to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary cursor-pointer transition-all"
                      onClick={() => handleAddImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs font-medium px-2 text-center">
                          Click to add
                        </p>
                      </div>

                      {/* Delete button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(image.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>

                      {/* Image info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{image.name}</p>
                        <p className="text-white/70 text-xs">{formatFileSize(image.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UploadLeftSidebar;

