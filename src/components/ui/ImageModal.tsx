"use client";

import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Loader2 } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileKey: string;
  fileName?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, fileKey, fileName }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && fileKey) {
      fetchSignedUrl();
    }
  }, [isOpen, fileKey]);

  const fetchSignedUrl = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/files/signed-url?key=${encodeURIComponent(fileKey)}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate signed URL');
      }
      
      const data = await response.json();
      setSignedUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (signedUrl) {
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = fileName || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (signedUrl) {
      window.open(signedUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {fileName || 'Document Viewer'}
            </h3>
            {fileKey && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {fileKey.split('/').pop()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {signedUrl && (
              <>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleOpenInNewTab}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-gray-600">Loading image...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load image</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchSignedUrl}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {signedUrl && !isLoading && !error && (
            <div className="flex justify-center">
              <img
                src={signedUrl}
                alt={fileName || 'Document'}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={() => setError('Failed to load image')}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {signedUrl && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Signed URL expires in 1 hour</span>
              <span>Secure document viewing</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
