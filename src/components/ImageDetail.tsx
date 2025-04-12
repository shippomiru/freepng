import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowDown, X } from 'lucide-react';
import { mockImages } from '../data/images';

type ImageStyle = 'original' | 'sticker' | 'sticker-white';

export function ImageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('original');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const image = mockImages.find(
    img => img.caption.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
  );

  if (!image) {
    navigate('/');
    return null;
  }

  const getImageUrl = (style: ImageStyle) => {
    switch (style) {
      case 'sticker':
        return image.sticker_url;
      case 'sticker-white':
        return image.sticker_url;
      default:
        return image.original_url;
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getImageUrl(selectedStyle);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${image.caption}-${selectedStyle}.${url.split('.').pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="relative w-full max-w-7xl bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 right-8 z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
        </button>

        {/* Left Side - Image Preview */}
        <div className="w-full lg:w-2/3 bg-gradient-to-br from-gray-50 to-white">
          <div className="relative w-full h-full overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ 
                transform: `translateX(-${
                  selectedStyle === 'original' ? 0 : 
                  selectedStyle === 'sticker' ? 100 : 200
                }%)`,
                width: '300%'
              }}
            >
              {/* Original Image */}
              <div className="w-1/3 h-full flex items-center justify-center p-8 lg:p-12">
                <img
                  src={image.original_url}
                  alt={`${image.caption} - Original`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              
              {/* Sticker */}
              <div className="w-1/3 h-full flex items-center justify-center bg-gray-900 p-8 lg:p-16">
                <img
                  src={image.sticker_url}
                  alt={`${image.caption} - Sticker`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Sticker with White Background */}
              <div className="w-1/3 h-full flex items-center justify-center bg-[#FCFCFC] p-8 lg:p-16">
                <img
                  src={image.sticker_url}
                  alt={`${image.caption} - White Background`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="relative w-full lg:w-1/3 flex flex-col h-[40vh] lg:h-[90vh] bg-white border-l border-gray-100">
          <div className="p-6 lg:p-10 flex-grow overflow-y-auto">
            <div className="max-w-sm">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4 pr-12">
                {image.caption}
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {image.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {image.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-50 rounded-full text-sm font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Style Selection and Download */}
          <div className="p-6 lg:p-10 space-y-6 bg-white">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedStyle('original')}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  selectedStyle === 'original'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setSelectedStyle('sticker')}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  selectedStyle === 'sticker'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Sticker
              </button>
              <button
                onClick={() => setSelectedStyle('sticker-white')}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  selectedStyle === 'sticker-white'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                White BG
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow"
            >
              <ArrowDown className="h-5 w-5" />
              <span className="font-medium">Download Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageDetail;