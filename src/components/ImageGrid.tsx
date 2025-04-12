import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Tags } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockImages } from '../data/images';

interface ImageGridProps {
  searchTerm: string;
}

export function ImageGrid({ searchTerm }: ImageGridProps) {
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleDownload = async (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop() || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Get unique tags from all images
  const allTags = Array.from(
    new Set(mockImages.flatMap((img) => img.tags))
  ).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredImages = mockImages.filter((img) => {
    const matchesSearch = img.caption
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => img.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <>
      {/* Tags */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 mb-4">
          <Tags className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t('filterByTags')}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <Link
                to={`/${image.caption.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                className="block relative aspect-square"
              >
                <img
                  src={image.original_url}
                  alt={image.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    className="p-3 bg-white/90 backdrop-blur rounded-xl hover:bg-white transition-all duration-300 shadow-lg transform translate-y-2 group-hover:translate-y-0 group-hover:scale-105"
                    onClick={(e) => handleDownload(image.original_url, e)}
                  >
                    <ArrowDown className="h-5 w-5 text-gray-900" />
                  </button>
                </div>
              </Link>
              <div className="p-4">
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{image.caption}</p>
                <div className="flex flex-wrap gap-1.5">
                  {image.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-50 rounded-md text-xs font-medium text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default ImageGrid;