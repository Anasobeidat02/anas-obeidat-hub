
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { QuestionFormData } from '@/lib/types/question';

interface ChoicesSectionProps {
  fields: any[];
  append: (item: { text: string; isCorrect: boolean }) => void;
  remove: (index: number) => void;
  form: UseFormReturn<QuestionFormData>;
  isSubmitting: boolean;
}

const ChoicesSection = ({ fields, append, remove, form, isSubmitting }: ChoicesSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Answer Choices</FormLabel>
        {fields.length < 6 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ text: '', isCorrect: false })}
          >
            <Plus className="h-3.5 w-3.5 mr-2" />
            Add Choice
          </Button>
        )}
      </div>

      {form.formState.errors.choices?.message && (
        <p className="text-sm font-medium text-destructive">
          {form.formState.errors.choices.message}
        </p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name={`choices.${index}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={`Choice ${index + 1}`}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`choices.${index}.isCorrect`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">
                  Correct
                </FormLabel>
              </FormItem>
            )}
          />

          {fields.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 p-0 h-8 w-8"
              onClick={() => remove(index)}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove choice</span>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChoicesSection;
