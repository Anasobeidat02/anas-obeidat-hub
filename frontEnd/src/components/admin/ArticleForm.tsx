
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Library {
  name: string;
  description: string;
  url: string;
}

interface ArticleFormData {
  id?: string;
  title: string;
  description: string;
  content: string;
  requirements: string;
  useCases: string;
  libraries: Library[];
  language: string;
  icon: string;
  color: string;
}

interface ArticleFormProps {
  initialData?: ArticleFormData;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  isEditing?: boolean;
}

const colorOptions = [
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'teal', label: 'Teal' },
  { value: 'orange', label: 'Orange' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'cyan', label: 'Cyan' }
];

const ArticleForm: React.FC<ArticleFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    description: '',
    content: '',
    requirements: '',
    useCases: '',
    libraries: [{ name: '', description: '', url: '' }],
    language: '',
    icon: '',
    color: 'blue'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        requirements: Array.isArray(initialData.requirements) 
          ? initialData.requirements.join(', ')
          : initialData.requirements,
        useCases: Array.isArray(initialData.useCases)
          ? initialData.useCases.join(', ')
          : initialData.useCases,
        libraries: initialData.libraries.length > 0 
          ? initialData.libraries 
          : [{ name: '', description: '', url: '' }]
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleColorChange = (value: string) => {
    setFormData({ ...formData, color: value });
  };

  const handleLibraryChange = (index: number, field: keyof Library, value: string) => {
    const updatedLibraries = [...formData.libraries];
    updatedLibraries[index] = { ...updatedLibraries[index], [field]: value };
    setFormData({ ...formData, libraries: updatedLibraries });
  };

  const addLibrary = () => {
    setFormData({
      ...formData,
      libraries: [...formData.libraries, { name: '', description: '', url: '' }]
    });
  };

  const removeLibrary = (index: number) => {
    const updatedLibraries = formData.libraries.filter((_, i) => i !== index);
    setFormData({ ...formData, libraries: updatedLibraries });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: `Article ${isEditing ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} article`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. JavaScript"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the programming language"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Detailed information about the programming language"
            required
            rows={10}
          />
        </div>
        
        <div>
          <Label htmlFor="requirements">Requirements (comma-separated)</Label>
          <Textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Basic programming knowledge, Understanding of object-oriented concepts"
          />
        </div>
        
        <div>
          <Label htmlFor="useCases">Use Cases (comma-separated)</Label>
          <Textarea
            id="useCases"
            name="useCases"
            value={formData.useCases}
            onChange={handleChange}
            placeholder="Web development, Mobile applications, Game development"
          />
        </div>
        
        <div>
          <Label htmlFor="language">Primary Language</Label>
          <Input
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="e.g. en, ar"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="icon">Icon URL</Label>
          <Input
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="https://example.com/icon.svg"
          />
        </div>
        
        <div>
          <Label htmlFor="color">Color Theme</Label>
          <Select 
            value={formData.color} 
            onValueChange={handleColorChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  {color.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Libraries & Frameworks</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLibrary}
            >
              Add Library
            </Button>
          </div>
          
          {formData.libraries.map((library, index) => (
            <div key={index} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Library #{index + 1}</h4>
                {formData.libraries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLibrary(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <div>
                <Label htmlFor={`library-name-${index}`}>Name</Label>
                <Input
                  id={`library-name-${index}`}
                  value={library.name}
                  onChange={(e) => handleLibraryChange(index, 'name', e.target.value)}
                  placeholder="e.g. React"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor={`library-description-${index}`}>Description</Label>
                <Textarea
                  id={`library-description-${index}`}
                  value={library.description}
                  onChange={(e) => handleLibraryChange(index, 'description', e.target.value)}
                  placeholder="Brief description of the library"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor={`library-url-${index}`}>Website URL</Label>
                <Input
                  id={`library-url-${index}`}
                  value={library.url}
                  onChange={(e) => handleLibraryChange(index, 'url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : isEditing ? 'Update Article' : 'Create Article'}
      </Button>
    </form>
  );
};

export default ArticleForm;
