'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText } from 'lucide-react';

interface ProcessingCardProps {
  documents: File[];
}

export function ProcessingCard({ documents }: ProcessingCardProps) {
  const isProcessing = documents.length > 0;

  // In a real app, these would come from an API
  const processingSteps = [
    { name: 'Upload', completed: true },
    { name: 'Text Extraction', completed: documents.length > 0 },
    { name: 'Parsing', completed: false },
    { name: 'Knowledge Graph', completed: false },
    { name: 'Indexing', completed: false }
  ];
  
  // Calculate overall progress
  const completedSteps = processingSteps.filter(step => step.completed).length;
  const progress = Math.round((completedSteps / processingSteps.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Documents</CardTitle>
        <CardDescription>
          {isProcessing 
            ? `Processing ${documents.length} document(s)` 
            : 'No documents currently being processed'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="space-y-3 mt-6">
              {processingSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-3 flex-shrink-0 ${
                    step.completed 
                      ? 'bg-primary' 
                      : 'bg-muted-foreground/20'
                  }`} />
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.name}
                    </span>
                    {step.completed && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[220px] text-center">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No Active Processing</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Upload documents or provide YouTube URLs to begin processing
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 