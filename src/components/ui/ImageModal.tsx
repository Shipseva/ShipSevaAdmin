"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, Download, ExternalLink, Image as ImageIcon } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileKey: string;      // can be a full S3 URL or a raw S3 key
  fileName?: string;
}

function getS3KeyFromInput(input: string): string | null {
  if (!input) return null;
  try {
    // If it's a full URL like:
    // https://shipseva.s3.ap-south-1.amazonaws.com/kyc/aadhar_back/....png
    const u = new URL(input);
    // Grab everything after the first slash, and strip the leading "/"
    const path = u.pathname.startsWith("/") ? u.pathname.slice(1) : u.pathname;
    return path || null;
  } catch {
    // Not a URL—assume it's already a key (e.g., "kyc/aadhar_back/....png")
    return input;
  }
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, fileKey, fileName }) => {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const objectKey = useMemo(() => getS3KeyFromInput(fileKey), [fileKey]);
  const displayName = fileName || objectKey?.split("/").pop() || "Document";

  useEffect(() => {
    let cancelled = false;

    async function fetchSigned() {
      if (!isOpen || !objectKey) {
        setSignedUrl(null);
        return;
      }
      setLoading(true);
      setImageLoadFailed(false);
      try {
        const res = await fetch(`/api/kyc-url?key=${encodeURIComponent(objectKey)}`);
        if (!res.ok) throw new Error(`Failed ${res.status}`);
        const data = (await res.json()) as { url?: string };
        if (!cancelled) setSignedUrl(data.url ?? null);
      } catch (e) {
        if (!cancelled) {
          console.error("Error fetching presigned URL:", e);
          setSignedUrl(null);
          setImageLoadFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSigned();
    return () => {
      cancelled = true;
    };
  }, [isOpen, objectKey]);

  const handleDownload = () => {
    if (!signedUrl) return;
    const link = document.createElement("a");
    link.href = signedUrl;              // download via presigned URL
    link.download = displayName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (signedUrl) window.open(signedUrl, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
            {objectKey && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {objectKey.split("/").pop()}
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
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
          <div className="flex justify-center">
            <div className="relative w-full">
              {loading && (
                <div className="flex items-center justify-center h-[70vh]">
                  <span className="text-gray-500 text-sm">Loading image…</span>
                </div>
              )}

              {!loading && signedUrl && !imageLoadFailed && (
                <img
                  src={signedUrl}
                  alt={displayName}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg mx-auto"
                  onError={() => setImageLoadFailed(true)}
                  onLoad={() => setImageLoadFailed(false)}
                  loading="lazy"
                />
              )}

              {!loading && (!signedUrl || imageLoadFailed) && (
                <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <p className="text-sm">Unable to load image.</p>
                  {objectKey && (
                    <p className="text-xs mt-1 break-all">
                      Key: <span className="font-mono">{objectKey}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
