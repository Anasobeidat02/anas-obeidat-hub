
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileJson } from 'lucide-react';

interface JsonImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (jsonData: string) => void;
}

const JsonImportDialog: React.FC<JsonImportDialogProps> = ({ open, onOpenChange, onImport }) => {
  const [jsonData, setJsonData] = useState('');

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonData(content);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    onImport(jsonData);
    setJsonData('');
  };

  const handleDownloadSample = () => {
    // Create a dynamic link to download the sample file
    const link = document.createElement('a');
    link.href = '/sample-article.json';
    link.download = 'sample-article.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Articles from JSON</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleDownloadSample}>
              <FileJson className="mr-2 h-4 w-4" /> Download Sample
            </Button>
          </div>
          
          <div>
            <Label htmlFor="json-file">Upload JSON File</Label>
            <Input 
              id="json-file" 
              type="file" 
              accept=".json" 
              onChange={handleJsonFileUpload}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="json-data">Or Paste JSON Content</Label>
            <textarea 
              id="json-data"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="w-full h-40 border rounded-md p-2 mt-1"
              placeholder='{
  "title": "Example Language",
  "description": "Description here",
  "content": "Content here",
  "requirements": ["req1", "req2"],
  "useCases": ["use1", "use2"],
  "libraries": [{"name": "lib1", "description": "desc", "url": "http://example.com"}],
  "language": "en",
  "icon": "url",
  "color": "blue"
}'
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleImport}>Import</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JsonImportDialog;
