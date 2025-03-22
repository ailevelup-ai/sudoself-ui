'use client';

import { useState } from 'react';
import { UploadCard } from '@/components/dashboard/UploadCard';
import { DocumentsList } from '@/components/dashboard/DocumentsList';

export default function DashboardPage() {
  const [documents, setDocuments] = useState<any[]>([]);

  const handleFilesUploaded = (newFiles: any[]) => {
    setDocuments(prev => [...newFiles, ...prev]);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <UploadCard onFilesUploaded={handleFilesUploaded} />
        </div>
        <div className="lg:col-span-2">
          <DocumentsList initialDocuments={documents} />
        </div>
      </div>
    </div>
  );
} 