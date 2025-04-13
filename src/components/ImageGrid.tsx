import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Tags } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import images from '../data/images.json';

interface ImageGridProps {
  searchTerm: string;
}

export function ImageGrid({ searchTerm }: ImageGridProps) {
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [displayedImages, setDisplayedImages] = useState<typeof images>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;

  // 检查图片URL格式，确保所有URL都有/images/前缀
  const fixImageUrl = (url: string) => {
    if (!url.startsWith('/images/') && !url.startsWith('http')) {
      return `/images/${url}`;
    }
    return url;
  };

  // 初始加载和图片修正
  useEffect(() => {
    // 修正图片URL
    const fixedImages = images.map(img => ({
      ...img,
      png_url: fixImageUrl(img.png_url),
      sticker_url: fixImageUrl(img.sticker_url)
    }));
    
    // 加载第一页图片
    loadImages(1, fixedImages);
    
    // 记录图片总数
    console.log(`总共加载了 ${fixedImages.length} 张图片`);
  }, []);

  // 加载指定页的图片
  const loadImages = (page: number, imageSource = images) => {
    const startIndex = (page - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    
    const newImages = imageSource.slice(startIndex, endIndex);
    if (page === 1) {
      setDisplayedImages(newImages);
    } else {
      setDisplayedImages(prev => [...prev, ...newImages]);
    }
    setCurrentPage(page);
  };

  // 加载更多图片
  const loadMoreImages = () => {
    const filteredImgs = images.filter((img) => {
      const matchesSearch = img.caption
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => img.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
    
    loadImages(currentPage + 1, filteredImgs);
  };

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
    new Set(images.flatMap((img) => img.tags))
  ).sort();

  const toggleTag = (tag: string) => {
    // 重置为第一页
    setCurrentPage(1);
    
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // 筛选符合条件的图片
  useEffect(() => {
    const filteredImgs = images.filter((img) => {
      const matchesSearch = img.caption
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => img.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
    
    loadImages(1, filteredImgs);
  }, [searchTerm, selectedTags]);

  const filteredImages = images.filter((img) => {
    const matchesSearch = img.caption
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => img.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const hasMoreImages = currentPage * imagesPerPage < filteredImages.length;

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
        <div className="mt-4 text-sm text-gray-500">
          找到 {filteredImages.length} 张符合条件的图片
        </div>
      </div>

      {/* Image Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <Link
                to={`/${image.slug}`}
                className="block relative aspect-square"
              >
                <img
                  src={image.png_url}
                  alt={image.caption}
                  className="w-full h-full object-cover bg-gray-900"
                  onError={(e) => {
                    console.error(`Failed to load image: ${image.png_url}`);
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // 防止无限循环
                    target.src = '/placeholder-image.png'; // 使用一个占位图像
                  }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    className="p-3 bg-white/90 backdrop-blur rounded-xl hover:bg-white transition-all duration-300 shadow-lg transform translate-y-2 group-hover:translate-y-0 group-hover:scale-105"
                    onClick={(e) => handleDownload(image.png_url, e)}
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
        
        {/* 加载更多按钮 */}
        {hasMoreImages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreImages}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              加载更多图片
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default ImageGrid;