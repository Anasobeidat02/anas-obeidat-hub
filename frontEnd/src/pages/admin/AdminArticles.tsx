
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import ArticleForm from '@/components/admin/ArticleForm';
import { getAllArticles, createArticle, updateArticle, deleteArticle } from '@/lib/api';

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  requirements: string[];
  useCases: string[];
  libraries: Array<{
    name: string;
    description: string;
    url: string;
  }>;
  language: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load articles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (formData: any) => {
    try {
      await createArticle(formData);
      setShowDialog(false);
      toast({
        title: 'Success',
        description: 'Article created successfully',
      });
      fetchArticles();
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to create article',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateArticle = async (formData: any) => {
    if (!currentArticle?.id) return;
    
    try {
      await updateArticle(currentArticle.id, formData);
      setShowDialog(false);
      setCurrentArticle(undefined);
      toast({
        title: 'Success',
        description: 'Article updated successfully',
      });
      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to update article',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteArticle(id);
      toast({
        title: 'Success',
        description: 'Article deleted successfully',
      });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (article: Article) => {
    setCurrentArticle(article);
    setIsEditing(true);
    setShowDialog(true);
  };

  const openCreateDialog = () => {
    setCurrentArticle(undefined);
    setIsEditing(false);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setCurrentArticle(undefined);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-10 h-10 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Programming Articles</h1>
          <p className="text-gray-500">Manage programming language articles</p>
        </div>
        
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add New Article
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Articles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.length === 0 ? (
              <div className="col-span-full p-8 text-center">
                <p className="text-xl text-gray-500">No articles found</p>
              </div>
            ) : (
              filteredArticles.map(article => (
                <Card key={article.id} className="overflow-hidden">
                  <div className={`bg-${article.color}-100 p-4 flex items-center gap-3`}>
                    {article.icon && (
                      <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                        <img src={article.icon} alt={article.title} className="w-6 h-6" />
                      </div>
                    )}
                    <h3 className="font-bold truncate">{article.title}</h3>
                  </div>
                  
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{article.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        Updated: {new Date(article.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => openEditDialog(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Article</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{article.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteArticle(article.id)}
                                className="bg-red-500 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Article' : 'Create New Article'}
            </DialogTitle>
          </DialogHeader>
          
          <ArticleForm
            initialData={currentArticle}
            onSubmit={isEditing ? handleUpdateArticle : handleCreateArticle}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArticles;
