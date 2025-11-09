"use client";

import React, { useState, useEffect } from 'react';
import { useGetKycByIdQuery, useUpdateKycMutation, useUpdateDocumentStatusMutation } from '@/store/api/kycApi';
import { X, Save, User, FileText, CheckCircle, XCircle, Clock, Building, Shield, AlertCircle, Eye, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import ImageModal from '@/components/ui/ImageModal';

interface KYCDetailModalProps {
  kycId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const KYCDetailModal: React.FC<KYCDetailModalProps> = ({ kycId, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    businessType: '',
    aadharStatus: '',
    panStatus: ''
  });
  const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const { data: kyc, isLoading, error } = useGetKycByIdQuery(kycId || '', {
    skip: !kycId || !isOpen
  });

  const [updateKyc, { isLoading: isUpdating }] = useUpdateKycMutation();
  const [updateDocumentStatus, { isLoading: isUpdatingDoc }] = useUpdateDocumentStatusMutation();

  // Component to handle image viewing with signed URLs
  const ImageViewer: React.FC<{ fileKey: string; fileName: string }> = ({ fileKey, fileName }) => {
    // Extract S3 key from full URL
    const extractS3Key = (url: string): string => {
      try {
        // If it's already a key (no http), return as is
        if (!url.startsWith('http')) {
          return url;
        }
        
        // Extract key from S3 URL
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        
        // Remove empty first element and bucket name
        const keyParts = pathParts.slice(2);
        
        return keyParts.join('/');
      } catch (error) {
        console.error('Error extracting S3 key:', error);
        return url; // Fallback to original
      }
    };

    const handleImageClick = () => {
      if (fileKey) {


        setSelectedImageKey(fileKey);
        setShowImageModal(true);
      }
    };

    return (
      <button
        onClick={handleImageClick}
        className="text-primary hover:text-primary-light text-sm flex items-center"
      >
        <Eye className="w-3 h-3 mr-1" />
        {fileName}
      </button>
    );
  };

  useEffect(() => {
    if (kyc) {
      console.log('KYC Data:', kyc); // Debug log to see actual structure
      setFormData({
        status: kyc.status || '',
        businessType: kyc.businessType || '',
        aadharStatus: kyc.aadhar?.documentStatus || '',
        panStatus: kyc.pan?.documentStatus || ''
      });
    }
  }, [kyc]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!kycId) return;

    try {
      const statusChanged = formData.status && formData.status !== kyc?.status;
      const businessTypeChanged = formData.businessType && formData.businessType !== kyc?.businessType;
      
      // If status is being updated, only send status (per requirement)
      if (statusChanged) {
        await updateKyc({
          id: kycId,
          updates: {
            status: formData.status as 'pending' | 'verified' | 'rejected'
          }
        }).unwrap();
      } 
      // If only businessType is being updated (and status is not), send businessType
      else if (businessTypeChanged) {
        await updateKyc({
          id: kycId,
          updates: {
            businessType: formData.businessType as 'individual' | 'agency'
          }
        }).unwrap();
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update KYC:', error);
    }
  };

  const handleDocumentStatusUpdate = async (type: 'aadhar' | 'pan', status: 'pending' | 'verified' | 'rejected') => {
    if (!kycId) return;

    try {
      await updateDocumentStatus({
        id: kycId,
        type,
        documentStatus: status
      }).unwrap();
    } catch (error) {
      console.error('Failed to update document status:', error);
    }
  };

  const handleCancel = () => {
    if (kyc) {
      setFormData({
        status: kyc.status || '',
        businessType: kyc.businessType || '',
        aadharStatus: kyc.aadhar?.documentStatus || '',
        panStatus: kyc.pan?.documentStatus || ''
      });
    }
    setIsEditing(false);
  };

  if (!isOpen || !kycId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">KYC Application Details</h2>
              <p className="text-sm text-gray-600">Review and manage KYC application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load KYC details</p>
            </div>
          ) : kyc ? (
            <div className="space-y-6">
              {/* Applicant Information */}
              {kyc.user && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900">{kyc.user.name || 'Not available'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{kyc.user.email || 'Not available'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{kyc.user.phone || 'Not available'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        kyc.user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        kyc.user.role === 'agency' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {kyc.user.role ? kyc.user.role.charAt(0).toUpperCase() + kyc.user.role.slice(1) : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        kyc.status === 'verified' ? 'bg-success/10 text-success' :
                        kyc.status === 'pending' ? 'bg-warning/10 text-warning' :
                        kyc.status === 'rejected' ? 'bg-error/10 text-error' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    {isEditing ? (
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                      >
                        <option value="individual">Individual</option>
                        <option value="agency">Agency</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        kyc.businessType === 'individual' ? 'bg-blue-100 text-blue-800' :
                        kyc.businessType === 'agency' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {kyc.businessType.charAt(0).toUpperCase() + kyc.businessType.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aadhar Card */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Aadhar Card</h4>
                      <div className="flex items-center space-x-2">
                        {kyc.aadhar?.documentStatus === 'verified' ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-error" />
                        )}
                        <span className="text-sm text-gray-600">
                          {kyc.aadhar?.documentStatus || 'Not provided'}
                        </span>
                      </div>
                    </div>
                    {kyc.aadhar && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Number: {kyc.aadhar.aadharNumber}</p>
                        <div className="flex space-x-2">
                          <ImageViewer fileKey={kyc.aadhar?.aadharFront || ''} fileName="View Front" />
                          <ImageViewer fileKey={kyc.aadhar?.aadharBack || ''} fileName="View Back" />
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleDocumentStatusUpdate('aadhar', 'verified')}
                            disabled={isUpdatingDoc}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleDocumentStatusUpdate('aadhar', 'rejected')}
                            disabled={isUpdatingDoc}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PAN Card */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">PAN Card</h4>
                      <div className="flex items-center space-x-2">
                        {kyc.pan?.documentStatus === 'verified' ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-error" />
                        )}
                        <span className="text-sm text-gray-600">
                          {kyc.pan?.documentStatus || 'Not provided'}
                        </span>
                      </div>
                    </div>
                    {kyc.pan && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Number: {kyc.pan.panNumber}</p>
                        <div className="flex space-x-2">
                          <ImageViewer fileKey={kyc.pan?.panFront || ''} fileName="View Front" />
                          <ImageViewer fileKey={kyc.pan?.panBack || ''} fileName="View Back" />
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleDocumentStatusUpdate('pan', 'verified')}
                            disabled={isUpdatingDoc}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleDocumentStatusUpdate('pan', 'rejected')}
                            disabled={isUpdatingDoc}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              {(kyc.ifsc || kyc.accountNumber || kyc.bankName) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <p className="text-gray-900">{kyc.bankName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                      <p className="text-gray-900">{kyc.branchName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                      <p className="text-gray-900">{kyc.accountHolderName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <p className="text-gray-900">{kyc.accountNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                      <p className="text-gray-900">{kyc.ifsc || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* GST Information */}
              {(kyc.gstNumber || kyc.gstCertificate) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                      <p className="text-gray-900">{kyc.gstNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Certificate</label>
                      {kyc.gstCertificate ? (
                        <ImageViewer fileKey={kyc.gstCertificate} fileName="Download Certificate" />
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Application Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-gray-900">{new Date(kyc.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900">{new Date(kyc.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Edit KYC
            </button>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setSelectedImageKey(null);
        }}
        fileKey={selectedImageKey || ''}
        fileName="Document View"
      />
    </div>
  );
};

export default KYCDetailModal;
