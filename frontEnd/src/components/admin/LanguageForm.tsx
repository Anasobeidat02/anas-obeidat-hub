
import { useState, useEffect } from 'react';
import { ProgrammingLanguage } from '@/lib/types';
import { createLanguage, updateLanguage } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LanguageFormProps {
  language: ProgrammingLanguage | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

interface Library {
  name: string;
  description: string;
  url: string;
}

const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'teal', 'orange', 'indigo', 'cyan'];

const LanguageForm = ({ language, onSubmitSuccess, onCancel }: LanguageFormProps) => {
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [icon, setIcon] = useState<string>('');
  const [color, setColor] = useState<string>('blue');
  const [content, setContent] = useState<string>('');
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [useCases, setUseCases] = useState<string[]>(['']);
  const [libraries, setLibraries] = useState<Library[]>([{ name: '', description: '', url: '' }]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (language) {
      setName(language.name);
      setSlug(language.slug);
      setDescription(language.description);
      setIcon(language.icon);
      setColor(language.color);
      setContent(language.content);
      setRequirements(language.requirements.length > 0 ? language.requirements : ['']);
      setUseCases(language.useCases.length > 0 ? language.useCases : ['']);
      setLibraries(language.libraries.length > 0 ? language.libraries : [{ name: '', description: '', url: '' }]);
    }
  }, [language]);

  // Generate slug from name
  useEffect(() => {
    if (!language && name) {
      const generatedSlug = name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setSlug(generatedSlug);
    }
  }, [name, language]);

  const handleRequirementsChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    const newRequirements = [...requirements];
    newRequirements.splice(index, 1);
    if (newRequirements.length === 0) {
      newRequirements.push('');
    }
    setRequirements(newRequirements);
  };

  const handleUseCasesChange = (index: number, value: string) => {
    const newUseCases = [...useCases];
    newUseCases[index] = value;
    setUseCases(newUseCases);
  };

  const addUseCase = () => {
    setUseCases([...useCases, '']);
  };

  const removeUseCase = (index: number) => {
    const newUseCases = [...useCases];
    newUseCases.splice(index, 1);
    if (newUseCases.length === 0) {
      newUseCases.push('');
    }
    setUseCases(newUseCases);
  };

  const handleLibraryChange = (index: number, field: keyof Library, value: string) => {
    const newLibraries = [...libraries];
    newLibraries[index] = { ...newLibraries[index], [field]: value };
    setLibraries(newLibraries);
  };

  const addLibrary = () => {
    setLibraries([...libraries, { name: '', description: '', url: '' }]);
  };

  const removeLibrary = (index: number) => {
    const newLibraries = [...libraries];
    newLibraries.splice(index, 1);
    if (newLibraries.length === 0) {
      newLibraries.push({ name: '', description: '', url: '' });
    }
    setLibraries(newLibraries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!name || !slug || !description || !content) {
        throw new Error('Please fill all required fields');
      }

      // Filter out empty entries
      const filteredRequirements = requirements.filter(req => req.trim().length > 0);
      const filteredUseCases = useCases.filter(useCase => useCase.trim().length > 0);
      const filteredLibraries = libraries.filter(
        lib => lib.name.trim().length > 0 && lib.description.trim().length > 0
      );

      const languageData = {
        name,
        slug,
        description,
        icon,
        color,
        content,
        requirements: filteredRequirements,
        useCases: filteredUseCases,
        libraries: filteredLibraries,
        createdBy: language?.createdBy || '',
      };

      if (language) {
        // Update existing language
        await updateLanguage(language.id, languageData);
        toast({
          title: 'Success',
          description: `${name} has been updated successfully.`,
        });
      } else {
        // Create new language
        await createLanguage(languageData);
        toast({
          title: 'Success',
          description: `${name} has been created successfully.`,
        });
      }

      onSubmitSuccess();
    } catch (err) {
      console.error('Error submitting language form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save language',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="JavaScript"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="javascript"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon URL</Label>
          <Input
            id="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="https://example.com/javascript-icon.png"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <select
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {colors.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief overview of the language..."
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Full Content (HTML Supported) *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<p>Detailed description of the language...</p>"
          required
          className="min-h-[200px] font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label>Learning Requirements</Label>
        {requirements.map((requirement, index) => (
          <div key={`req-${index}`} className="flex gap-2">
            <Input
              value={requirement}
              onChange={(e) => handleRequirementsChange(index, e.target.value)}
              placeholder="Basic programming knowledge"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeRequirement(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRequirement}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Common Use Cases</Label>
        {useCases.map((useCase, index) => (
          <div key={`use-${index}`} className="flex gap-2">
            <Input
              value={useCase}
              onChange={(e) => handleUseCasesChange(index, e.target.value)}
              placeholder="Web Development"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeUseCase(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addUseCase}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Use Case
        </Button>
      </div>

      <div className="space-y-4">
        <Label>Libraries & Frameworks</Label>
        {libraries.map((lib, index) => (
          <div key={`lib-${index}`} className="border p-4 rounded-md space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Library {index + 1}</h4>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeLibrary(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`lib-name-${index}`}>Name</Label>
              <Input
                id={`lib-name-${index}`}
                value={lib.name}
                onChange={(e) => handleLibraryChange(index, 'name', e.target.value)}
                placeholder="React"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`lib-desc-${index}`}>Description</Label>
              <Textarea
                id={`lib-desc-${index}`}
                value={lib.description}
                onChange={(e) => handleLibraryChange(index, 'description', e.target.value)}
                placeholder="A JavaScript library for building user interfaces"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`lib-url-${index}`}>Website URL</Label>
              <Input
                id={`lib-url-${index}`}
                value={lib.url}
                onChange={(e) => handleLibraryChange(index, 'url', e.target.value)}
                placeholder="https://reactjs.org"
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addLibrary}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Library
        </Button>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : (language ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

export default LanguageForm;
