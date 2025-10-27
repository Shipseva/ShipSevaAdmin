"use client";

import React from 'react';
import KYCApplicationDetails from '@/components/kyc/KYCApplicationDetails';

// Example data - replace with actual data from your API
const exampleKYCApplication = {
  id: 'kyc-001',
  userId: 'user-001',
  userName: 'Pavitra Kumar Gupta',
  userEmail: 'tevaca1491@apocaw.com',
  businessType: 'individual' as const,
  status: 'pending' as const,
  createdAt: '2025-10-27T00:23:16.000Z',
  updatedAt: '2025-10-27T00:27:16.000Z',
  documents: [
    {
      id: 'doc-001',
      type: 'aadhar_front' as const,
      fileName: 'aadhar_front_pavitra.jpg',
      fileKey: 'kyc/user-001/aadhar/aadhar_front_pavitra.jpg',
      uploadedAt: '2025-10-27T00:23:16.000Z',
      status: 'verified' as const,
      number: '123123343333',
    },
    {
      id: 'doc-002',
      type: 'aadhar_back' as const,
      fileName: 'aadhar_back_pavitra.jpg',
      fileKey: 'kyc/user-001/aadhar/aadhar_back_pavitra.jpg',
      uploadedAt: '2025-10-27T00:23:16.000Z',
      status: 'verified' as const,
    },
    {
      id: 'doc-003',
      type: 'pan' as const,
      fileName: 'pan_card_pavitra.pdf',
      fileKey: 'kyc/user-001/pan/pan_card_pavitra.pdf',
      uploadedAt: '2025-10-27T00:23:16.000Z',
      status: 'pending' as const,
      number: 'ABCDE1234F',
    },
  ],
  bankInfo: {
    bankName: 'State Bank of India',
    branchName: undefined,
    accountHolderName: 'Pavitra Kumar Gupta',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
  },
  gstInfo: {
    gstNumber: '22ABCDE1234FIZ5',
    gstCertificateKey: 'kyc/user-001/gst/gst_certificate_pavitra.pdf',
  },
};

const KYCDetailsPage: React.FC = () => {
  return <KYCApplicationDetails application={exampleKYCApplication} />;
};

export default KYCDetailsPage;
