'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, MoreHorizontal, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    title: 'Annual Report 2023.pdf',
    uploadDate: new Date('2023-12-10'),
    size: '2.4 MB',
    type: 'PDF',
    status: 'processed'
  },
  {
    id: '2',
    title: 'Meeting Notes Q4.docx',
    uploadDate: new Date('2023-11-27'),
    size: '526 KB',
    type: 'DOCX',
    status: 'processed'
  },
  {
    id: '3',
    title: 'Financial Analysis.xlsx',
    uploadDate: new Date('2023-11-15'),
    size: '1.2 MB',
    type: 'XLSX',
    status: 'processed'
  },
  {
    id: '4',
    title: 'Project Roadmap.pptx',
    uploadDate: new Date('2023-10-22'),
    size: '4.7 MB',
    type: 'PPTX',
    status: 'processing'
  },
  {
    id: '5',
    title: 'Research Paper.pdf',
    uploadDate: new Date('2023-10-05'),
    size: '3.1 MB',
    type: 'PDF',
    status: 'processed'
  }
];

interface DocumentsListProps {
  initialDocuments?: any[];
}

export function DocumentsList({ initialDocuments = [] }: DocumentsListProps) {
  const [documents, setDocuments] = useState<any[]>([...initialDocuments, ...mockDocuments]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Update documents when initialDocuments changes
  useEffect(() => {
    if (initialDocuments.length > 0) {
      setDocuments(prev => {
        // Create a Set of existing IDs to avoid duplicates
        const existingIds = new Set(prev.map(doc => doc.id));
        // Filter out initialDocuments that are already in the list
        const newDocs = initialDocuments.filter(doc => !existingIds.has(doc.id));
        // Add new documents to the beginning of the list
        return [...newDocs, ...prev];
      });
    }
  }, [initialDocuments]);
  
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document);
    // In a real app, navigate to document details or open preview
    console.log('Document selected:', document);
  };
  
  const handleDeleteClick = (document: any) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedDocument) {
      setDocuments(documents.filter(d => d.id !== selectedDocument.id));
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>
              View and manage your uploaded documents
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredDocuments.length > 0 ? (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 items-center border-b px-4 py-3 text-xs font-medium text-muted-foreground">
              <div className="col-span-6">Document</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className="grid grid-cols-12 items-center px-4 py-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary/70" />
                    <div className="truncate font-medium">{doc.title}</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {formatDistanceToNow(doc.uploadDate, { addSuffix: true })}
                    </div>
                  </div>
                  <div className="col-span-2 text-sm">{doc.type}</div>
                  <div className="col-span-2 text-sm">{doc.size}</div>
                  <div className="col-span-1">
                    <Badge 
                      variant={doc.status === 'processed' ? 'default' : 'secondary'}
                      className="whitespace-nowrap"
                    >
                      {doc.status === 'processed' ? 'Processed' : 'Processing'}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="flex items-center gap-2"
                          onClick={() => console.log('Download:', doc.title)}
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(doc)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No documents found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchTerm 
                ? `No results found for "${searchTerm}". Try a different search term.` 
                : "You haven't uploaded any documents yet. Upload documents to get started."}
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedDocument?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 