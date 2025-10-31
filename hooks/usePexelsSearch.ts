'use client';

import { useState, useCallback } from 'react';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

export function usePexelsSearch() {
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPhotos = useCallback(async (query: string, page = 1, perPage = 12) => {
    if (!query.trim()) {
      setPhotos([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch photos from Pexels');
      }

      const data: PexelsResponse = await response.json();
      setPhotos(data.photos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setPhotos([]);
    setError(null);
  }, []);

  return {
    photos,
    isLoading,
    error,
    searchPhotos,
    clearResults,
  };
}

