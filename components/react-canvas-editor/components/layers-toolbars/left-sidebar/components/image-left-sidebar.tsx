"use client"

import React, { useState, useEffect } from 'react'
import { usePexelsSearch } from '@/hooks/usePexelsSearch'
import { useDebounce } from '@/hooks/useDebounce'
import { useEditor } from '@/contexts/EditorContext'
import { Search, ImageOff, Loader2 } from 'lucide-react'

export const ImageLeftSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const { photos, isLoading, error, searchPhotos } = usePexelsSearch()
  const { addElement, setSelectedId } = useEditor()

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      searchPhotos(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchPhotos])

  const handleImageClick = (imageUrl: string, width: number, height: number) => {
    // Calculate initial size (scale down if too large)
    const maxSize = 400
    let initialWidth = width
    let initialHeight = height
    
    if (width > maxSize || height > maxSize) {
      const scale = maxSize / Math.max(width, height)
      initialWidth = width * scale
      initialHeight = height * scale
    }

    // Add image element to canvas
    const elementId = addElement('image', {
      src: imageUrl,
      width: initialWidth,
      height: initialHeight,
      x: 100, // Default position
      y: 100,
    })
    
    // Select the newly created element
    setSelectedId(elementId)
  }

  return (
    <div className="flex flex-col h-full">
      {/* <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm mb-1">Search Photos</h3>
        <p className="text-xs text-muted-foreground">Powered by Pexels</p>
      </div> */}

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          {/* Search Input */}
          <div className="relative">
            {isLoading ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for images..."
              className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && <LoadingSkeletons />}
          
          {error && (
            <div className="text-center py-8 text-destructive text-sm">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && photos.length === 0 && debouncedSearchQuery && (
            <EmptyState />
          )}

          {!isLoading && !error && photos.length === 0 && !debouncedSearchQuery && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">Search for images</p>
              <p className="text-xs mt-1">Find free stock photos to add to your design</p>
            </div>
          )}

          {!isLoading && !error && photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => handleImageClick(photo.src.large, photo.width, photo.height)}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border hover:border-primary transition-all hover:scale-105 group"
                >
                  <img
                    src={photo.src.small}
                    alt={`Photo by ${photo.photographer}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">By {photo.photographer}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const LoadingSkeletons = () => (
  <div className="grid grid-cols-2 gap-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
    ))}
  </div>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
    <ImageOff className="w-12 h-12 mb-3 opacity-50" />
    <p className="text-sm font-medium">No images found</p>
    <p className="text-xs mt-1">Try a different search term</p>
  </div>
)

