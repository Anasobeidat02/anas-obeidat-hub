
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Question, QuestionFormData } from '@/lib/types/question';
import { Trash2, Plus, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import BatchUploadSection from './question/BatchUploadSection';
import ChoicesSection from './question/ChoicesSection';

const questionSchema = z.object({
  questionText: z.string().min(5, 'Question text is required'),
  language: z.string().min(1, 'Language is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  choices: z.array(
    z.object({
      text: z.string().min(1, 'Choice text is required'),
      isCorrect: z.boolean(),
    })
  ).min(2, 'At least 2 choices are required')
    .refine(choices => choices.some(choice => choice.isCorrect), {
      message: 'At least one choice must be marked as correct',
      path: ['choices'],
    }),
});

interface QuestionFormProps {
  onSubmit: (data: Question) => void;
  initialData?: Question;
  isEditing?: boolean;
  onBatchSubmit?: (questions: QuestionFormData[]) => void;
}

const QuestionForm = ({ onSubmit, initialData, isEditing = false, onBatchSubmit }: QuestionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialData || {
      questionText: '',
      language: '',
      difficulty: 'easy',
      choices: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'choices',
    control: form.control,
  });

  const handleSubmit = (data: QuestionFormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const formattedData = {
        ...data,
        _id: initialData?._id || '',
      };
      
      onSubmit(formattedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {!isEditing && onBatchSubmit && (
          <BatchUploadSection onBatchSubmit={onBatchSubmit} />
        )}

        <FormField
          control={form.control}
          name="questionText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter the question text..." 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programming Language</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="C++">C++</SelectItem>
                    <SelectItem value="C#">C#</SelectItem>
                    <SelectItem value="PHP">PHP</SelectItem>
                    <SelectItem value="Ruby">Ruby</SelectItem>
                    <SelectItem value="Swift">Swift</SelectItem>
                    <SelectItem value="Kotlin">Kotlin</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="CSS">CSS</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="Angular">Angular</SelectItem>
                    <SelectItem value="Vue">Vue</SelectItem>
                    <SelectItem value="Node.js">Node.js</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ChoicesSection 
          fields={fields} 
          append={append}
          remove={remove}
          form={form}
          isSubmitting={isSubmitting}
        />

        <div className="flex justify-end gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => isEditing ? onSubmit(initialData!) : form.reset()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {isEditing ? 'Updating...' : 'Saving...'}
              </span>
            ) : (
              <>{isEditing ? 'Update' : 'Save'} Question</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
