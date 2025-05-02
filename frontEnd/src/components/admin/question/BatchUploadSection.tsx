
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';
import { QuestionFormData } from '@/lib/types/question';

interface BatchUploadSectionProps {
  onBatchSubmit: (questions: QuestionFormData[]) => void;
}

const BatchUploadSection = ({ onBatchSubmit }: BatchUploadSectionProps) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setJsonFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!jsonFile) {
      toast({
        title: "Error",
        description: "Please select a JSON file first",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const questions = JSON.parse(content);
        
        if (!Array.isArray(questions)) {
          toast({
            title: "Invalid Format",
            description: "JSON file must contain an array of questions",
            variant: "destructive"
          });
          return;
        }
        
        const validQuestions: QuestionFormData[] = [];
        const errors: string[] = [];
        
        questions.forEach((q, index) => {
          if (!q.questionText || !q.language || !q.difficulty || !Array.isArray(q.choices)) {
            errors.push(`Question at index ${index} is missing required fields`);
            return;
          }
          
          const hasCorrectAnswer = q.choices.some((c) => c.isCorrect);
          if (!hasCorrectAnswer) {
            errors.push(`Question "${q.questionText}" has no correct answer`);
            return;
          }
          
          validQuestions.push(q);
        });
        
        if (errors.length > 0) {
          toast({
            title: `Found ${errors.length} errors`,
            description: errors.join(', '),
            variant: "destructive"
          });
          return;
        }
        
        if (validQuestions.length === 0) {
          toast({
            title: "No valid questions found",
            description: "Please check your JSON file format",
            variant: "destructive"
          });
          return;
        }
        
        onBatchSubmit(validQuestions);
        toast({
          title: "Success",
          description: `${validQuestions.length} questions uploaded successfully`,
        });
      } catch (error) {
        console.error('JSON parsing error:', error);
        toast({
          title: "JSON Parse Error",
          description: "Failed to parse JSON file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(jsonFile);
  };

  return (
    <div className="border-b pb-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Batch Upload Questions</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="flex-grow"
          />
          <Button 
            type="button" 
            onClick={handleFileUpload}
            disabled={!jsonFile}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Upload a JSON file with multiple questions. The file should contain an array of question objects with the same structure as the form below.
        </p>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-mono text-gray-600">Example format:</p>
          <pre className="text-xs overflow-auto p-2">
            {JSON.stringify([
              {
                questionText: "What is React?",
                language: "React",
                difficulty: "easy",
                choices: [
                  { text: "A JavaScript library", isCorrect: true },
                  { text: "A programming language", isCorrect: false }
                ]
              }
            ], null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BatchUploadSection;
