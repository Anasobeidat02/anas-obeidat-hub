
import { useState, useEffect } from 'react';
import { Blog } from '@/lib/types';
import { getAllBlogs, deleteBlog } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Plus, Trash2 } from 'lucide-react';
import BlogForm from '@/components/admin/BlogForm';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blogs. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast({
        title: 'Success',
        description: 'Blog deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setBlogToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    fetchBlogs();
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
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
        <h1 className="text-3xl font-bold">Programming Blogs</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No blogs found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map(blog => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.category}</TableCell>
                    <TableCell>
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(blog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteDialog(blog.id)}
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
          <p>Are you sure you want to delete this blog? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => blogToDelete && handleDelete(blogToDelete)}
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
              {editingBlog ? `Edit ${editingBlog.title}` : 'Create New Blog'}
            </DialogTitle>
          </DialogHeader>
          <BlogForm 
            blog={editingBlog} 
            onSubmitSuccess={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogs;
