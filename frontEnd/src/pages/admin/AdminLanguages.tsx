
import { useState, useEffect } from 'react';
import { ProgrammingLanguage } from '@/lib/types';
import { getAllLanguages, deleteLanguage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Plus, Trash2 } from 'lucide-react';
import LanguageForm from '@/components/admin/LanguageForm';

const AdminLanguages = () => {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [languageToDelete, setLanguageToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingLanguage, setEditingLanguage] = useState<ProgrammingLanguage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const data = await getAllLanguages();
      setLanguages(data);
    } catch (error) {
      console.error('Failed to fetch languages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load languages. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLanguage(id);
      setLanguages(languages.filter(lang => lang.id !== id));
      toast({
        title: 'Success',
        description: 'Programming language deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete language:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete language. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLanguageToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setLanguageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (language: ProgrammingLanguage) => {
    setEditingLanguage(language);
    setIsFormOpen(true);
  };

  const openCreateDialog = () => {
    setEditingLanguage(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    fetchLanguages();
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Programming Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Programming Languages</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Libraries</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {languages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No programming languages found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                languages.map(language => (
                  <TableRow key={language.id}>
                    <TableCell className="font-medium">{language.name}</TableCell>
                    <TableCell>{language.slug}</TableCell>
                    <TableCell>{language.libraries.length}</TableCell>
                    <TableCell>
                      {new Date(language.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(language)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteDialog(language.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this programming language? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => languageToDelete && handleDelete(languageToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLanguage ? `Edit ${editingLanguage.name}` : 'Create New Programming Language'}
            </DialogTitle>
          </DialogHeader>
          <LanguageForm 
            language={editingLanguage} 
            onSubmitSuccess={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLanguages;
