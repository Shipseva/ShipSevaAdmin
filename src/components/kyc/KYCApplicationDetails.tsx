"use client";

import React from 'react';
import { CheckCircle, XCircle, Clock, Download, Eye, User, Building2, FileText } from 'lucide-react';
import SecureImageViewer from '@/components/ui/SecureImageViewer';
import { useUpdateKYCStatusMutation, useUpdateDocumentStatusMutation } from '@/store/api/kycApi';
import toast from 'react-hot-toast';

interface KYCDocument {
  id: string;
  type: 'pan' | 'aadhar_front' | 'aadhar_back' | 'gst' | 'bank';
  fileName: string;
  fileKey: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  number?: string;
}

interface KYCApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessType: 'individual' | 'agency';
  documents: KYCDocument[];
  bankInfo?: {
    bankName: string;
    branchName?: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
  };
  gstInfo?: {
    gstNumber: string;
    gstCertificateKey?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const KYCApplicationDetails: React.FC<{ application: KYCApplication }> = ({ application }) => {
  const [updateKYCStatus] = useUpdateKYCStatusMutation();
  const [updateDocumentStatus] = useUpdateDocumentStatusMutation();

  const handleDocumentAction = async (action: 'verify' | 'reject', documentId: string) => {
    try {
      const status = action === 'verify' ? 'verified' : 'rejected';
      await updateDocumentStatus({
        applicationId: application.id,
        documentId,
        status,
        reason: action === 'reject' ? 'Document does not meet requirements' : undefined,
      }).unwrap();
      
      toast.success(`Document ${action === 'verify' ? 'verified' : 'rejected'} successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${action} document`);
    }
  };

  const handleApplicationAction = async (action: 'approve' | 'reject') => {
    try {
      await updateKYCStatus({
        id: application.id,
        status: action === 'approve' ? 'approved' : 'rejected',
        reason: action === 'reject' ? 'Application does not meet requirements' : undefined,
      }).unwrap();
      
      toast.success(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${action} application`);
    }
  };
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pan':
        return <FileText className="w-4 h-4" />;
      case 'aadhar_front':
      case 'aadhar_back':
        return <User className="w-4 h-4" />;
      case 'gst':
      case 'bank':
        return <Building2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'pan':
        return 'PAN Card';
      case 'aadhar_front':
        return 'Aadhar Front';
      case 'aadhar_back':
        return 'Aadhar Back';
      case 'gst':
        return 'GST Certificate';
      case 'bank':
        return 'Bank Document';
      default:
        return 'Document';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Group documents by type
  const groupedDocuments = application.documents.reduce((acc, doc) => {
    const baseType = doc.type.includes('aadhar') ? 'aadhar' : doc.type;
    if (!acc[baseType]) {
      acc[baseType] = [];
    }
    acc[baseType].push(doc);
    return acc;
  }, {} as Record<string, KYCDocument[]>);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Application Details</h1>
        <p className="text-gray-600">Review and manage KYC application</p>
      </div>

      {/* Application Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">KYC Status</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(application.status)}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Business Type</h3>
            <p className="text-sm text-gray-900 capitalize">{application.businessType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Application ID</h3>
            <p className="text-sm text-gray-900 font-mono">{application.id}</p>
          </div>
        </div>
      </div>

      {/* Document Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Document Status</h2>
        
        <div className="space-y-6">
          {/* Aadhar Card */}
          {groupedDocuments.aadhar && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Aadhar Card</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(groupedDocuments.aadhar[0]?.status || 'pending')}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(groupedDocuments.aadhar[0]?.status || 'pending')}`}>
                        {groupedDocuments.aadhar[0]?.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {groupedDocuments.aadhar[0]?.number && (
                <p className="text-sm text-gray-600 mb-4">
                  Number: {groupedDocuments.aadhar[0].number}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedDocuments.aadhar.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {getDocumentLabel(doc.type)}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <SecureImageViewer
                        fileKey={doc.fileKey}
                        fileName={doc.fileName}
                        className="h-24 w-full"
                        showPreview={true}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button className="flex items-center space-x-1 text-primary hover:text-primary-light transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDocumentAction('verify', doc.id)}
                          disabled={doc.status === 'verified'}
                          className="px-3 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => handleDocumentAction('reject', doc.id)}
                          disabled={doc.status === 'rejected'}
                          className="px-3 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAN Card */}
          {groupedDocuments.pan && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">PAN Card</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(groupedDocuments.pan[0]?.status || 'pending')}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(groupedDocuments.pan[0]?.status || 'pending')}`}>
                        {groupedDocuments.pan[0]?.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {groupedDocuments.pan[0]?.number && (
                <p className="text-sm text-gray-600 mb-4">
                  Number: {groupedDocuments.pan[0].number}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedDocuments.pan.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {getDocumentLabel(doc.type)}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <SecureImageViewer
                        fileKey={doc.fileKey}
                        fileName={doc.fileName}
                        className="h-24 w-full"
                        showPreview={true}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button className="flex items-center space-x-1 text-primary hover:text-primary-light transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDocumentAction('verify', doc.id)}
                          disabled={doc.status === 'verified'}
                          className="px-3 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => handleDocumentAction('reject', doc.id)}
                          disabled={doc.status === 'rejected'}
                          className="px-3 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bank Information */}
      {application.bankInfo && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Bank Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Bank Name</h3>
              <p className="text-sm text-gray-900">{application.bankInfo.bankName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Branch Name</h3>
              <p className="text-sm text-gray-900">{application.bankInfo.branchName || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Account Holder Name</h3>
              <p className="text-sm text-gray-900">{application.bankInfo.accountHolderName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Account Number</h3>
              <p className="text-sm text-gray-900 font-mono">{application.bankInfo.accountNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">IFSC Code</h3>
              <p className="text-sm text-gray-900 font-mono">{application.bankInfo.ifscCode}</p>
            </div>
          </div>
        </div>
      )}

      {/* GST Information */}
      {application.gstInfo && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">GST Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">GST Number</h3>
              <p className="text-sm text-gray-900 font-mono">{application.gstInfo.gstNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">GST Certificate</h3>
              {application.gstInfo.gstCertificateKey ? (
                <div className="flex items-center space-x-2">
                  <SecureImageViewer
                    fileKey={application.gstInfo.gstCertificateKey}
                    fileName="GST Certificate"
                    className="h-16 w-16"
                    showPreview={true}
                  />
                  <button className="flex items-center space-x-1 text-primary hover:text-primary-light transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No certificate uploaded</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Timeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
            <p className="text-sm text-gray-900">{new Date(application.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
            <p className="text-sm text-gray-900">{new Date(application.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Application Actions */}
      {application.status === 'pending' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Actions</h2>
          
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => handleApplicationAction('reject')}
              className="px-6 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              Reject Application
            </button>
            <button
              onClick={() => handleApplicationAction('approve')}
              className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
            >
              Approve Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCApplicationDetails;
