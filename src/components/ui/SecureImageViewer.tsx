"use client";

import React, { useState } from 'react';
import { Eye, FileImage } from 'lucide-react';
import ImageModal from './ImageModal';

interface SecureImageViewerProps {
  fileKey: string;
  fileName?: string;
  thumbnailUrl?: string;
  className?: string;
  showPreview?: boolean;
}

const SecureImageViewer: React.FC<SecureImageViewerProps> = ({
  fileKey,
  fileName,
  thumbnailUrl,
  className = '',
  showPreview = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  if (!fileKey) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <FileImage className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <div className={`relative group ${className}`}>
        {showPreview && thumbnailUrl ? (
          <div className="relative">
            <img
              src={thumbnailUrl}
              alt={fileName || 'Document preview'}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
              <button
                onClick={handleView}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg"
                title="View document"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors">
            <div className="text-center">
              <FileImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">{fileName || 'Document'}</p>
              <button
                onClick={handleView}
                className="flex items-center space-x-1 text-primary hover:text-primary-light transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileKey={fileKey}
        fileName={fileName}
      />
    </>
  );
};

export default SecureImageViewer;
