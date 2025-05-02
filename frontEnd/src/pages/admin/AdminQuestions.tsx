
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question, QuestionFormData } from '@/lib/types/question';
import QuestionForm from '@/components/admin/QuestionForm';
import { getAllQuestions, createQuestion, updateQuestion, deleteQuestion } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminQuestions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Fetch questions
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: getAllQuestions,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setAddDialogOpen(false);
      toast({
        title: "Question added",
        description: "New question has been added successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating question:', error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (question: Question) => updateQuestion(question._id, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setEditDialogOpen(false);
      setCurrentQuestion(null);
      toast({
        title: "Question updated",
        description: "Question has been updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: "Question deleted",
        description: "Question has been deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    return q.questionText.toLowerCase().includes(filter.toLowerCase()) ||
           q.language.toLowerCase().includes(filter.toLowerCase());
  });

  // Add question handler
  const handleAddQuestion = (question: Question) => {
    createMutation.mutate(question as QuestionFormData);
  };

  // Add batch questions handler
  const handleBatchUpload = (questions: QuestionFormData[]) => {
    // Create a promise for each question creation
    const createPromises = questions.map(question => 
      createQuestion(question)
    );
    
    // Execute all promises
    Promise.all(createPromises)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['questions'] });
        setAddDialogOpen(false);
        toast({
          title: "Questions added",
          description: `${questions.length} questions have been added successfully`,
        });
      })
      .catch(error => {
        console.error('Error adding batch questions:', error);
        toast({
          title: "Error",
          description: "Failed to add some questions. Please try again.",
          variant: "destructive"
        });
      });
  };

  // Update question handler
  const handleUpdateQuestion = (question: Question) => {
    updateMutation.mutate(question);
  };

  // Delete question handler
  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Questions</h1>
          <p className="text-gray-500 mt-1">Manage quiz questions</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
            </DialogHeader>
            <QuestionForm 
              onSubmit={handleAddQuestion} 
              onBatchSubmit={handleBatchUpload} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search questions..."
                className="pl-8"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Question</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading questions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <TableRow key={question._id}>
                      <TableCell className="font-medium">
                        {question.questionText}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-primary border-blue-100">
                          {question.language}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          question.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-100' :
                          question.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                          'bg-red-50 text-red-700 border-red-100'
                        }>
                          {question.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setCurrentQuestion(question);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteQuestion(question._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No questions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Question Dialog */}
      {currentQuestion && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            <QuestionForm 
              onSubmit={handleUpdateQuestion} 
              initialData={currentQuestion} 
              isEditing
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminQuestions;
