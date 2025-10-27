"use client";

import React from 'react';
import { FileText, User, Building2 } from 'lucide-react';
import SecureImageViewer from '@/components/ui/SecureImageViewer';

interface KYCDocument {
  id: string;
  type: 'pan' | 'aadhar_front' | 'aadhar_back' | 'gst' | 'bank';
  fileName: string;
  fileKey: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface KYCApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  documents: KYCDocument[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const KYCManagementExample: React.FC = () => {
  // Example data - replace with actual data from your API
  const kycApplications: KYCApplication[] = [
    {
      id: 'kyc-001',
      userId: 'user-001',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
      documents: [
        {
          id: 'doc-001',
          type: 'pan',
          fileName: 'pan_card_john_doe.pdf',
          fileKey: 'kyc/user-001/pan/pan_card_john_doe.pdf',
          uploadedAt: '2024-01-15T10:30:00Z',
          status: 'pending',
        },
        {
          id: 'doc-002',
          type: 'aadhar_front',
          fileName: 'aadhar_front_john_doe.jpg',
          fileKey: 'kyc/user-001/aadhar/aadhar_front_john_doe.jpg',
          uploadedAt: '2024-01-15T10:31:00Z',
          status: 'pending',
        },
        {
          id: 'doc-003',
          type: 'aadhar_back',
          fileName: 'aadhar_back_john_doe.jpg',
          fileKey: 'kyc/user-001/aadhar/aadhar_back_john_doe.jpg',
          uploadedAt: '2024-01-15T10:32:00Z',
          status: 'pending',
        },
      ],
    },
  ];

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

  const getStatusColor = (status: string) => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">KYC Document Management</h1>
      
      <div className="space-y-6">
        {kycApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Application Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{application.userName}</h3>
                <p className="text-sm text-gray-600">{application.userEmail}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {application.documents.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getDocumentIcon(document.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {getDocumentLabel(document.type)}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {document.fileName}
                      </p>
                    </div>
                  </div>

                  {/* Document Viewer */}
                  <div className="mb-3">
                    <SecureImageViewer
                      fileKey={document.fileKey}
                      fileName={document.fileName}
                      className="h-32 w-full"
                      showPreview={true}
                    />
                  </div>

                  {/* Document Status */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(document.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                Reject
              </button>
              <button className="px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCManagementExample;
