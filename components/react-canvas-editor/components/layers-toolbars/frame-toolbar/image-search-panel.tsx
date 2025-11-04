"use client"

import React, { useState, useEffect } from 'react'
import { usePexelsSearch } from '@/hooks/usePexelsSearch'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, ImageOff, Loader2 } from 'lucide-react'

interface ImageSearchPanelProps {
  onImageSelect: (url: string) => void
}

export const ImageSearchPanel = ({ onImageSelect }: ImageSearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const { photos, isLoading, error, searchPhotos } = usePexelsSearch()

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      searchPhotos(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchPhotos])

  const handleImageClick = (imageUrl: string) => {
    onImageSelect(imageUrl)
  }

  return (
    <div className="space-y-3">
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
          className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded bg-background text-foreground"
        />
      </div>

      {/* Results Container */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading && <LoadingSkeletons />}
        
        {error && (
          <div className="text-center py-8 text-destructive text-sm">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && photos.length === 0 && debouncedSearchQuery && (
          <EmptyState />
        )}

        {!isLoading && !error && photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handleImageClick(photo.src.large)}
                className="relative aspect-square overflow-hidden rounded border border-border hover:border-primary transition-all hover:scale-105"
              >
                <img
                  src={photo.src.small}
                  alt={`Photo by ${photo.photographer}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const LoadingSkeletons = () => (
  <div className="grid grid-cols-3 gap-2">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="aspect-square bg-muted animate-pulse rounded" />
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

