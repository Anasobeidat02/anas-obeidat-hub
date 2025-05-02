import { useState, useEffect } from 'react';
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
import { Plus, Search, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import AdminForm from '@/components/admin/AdminForm';
import { getAllAdmins } from '@/lib/api';

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const fetchedAdmins = await getAllAdmins(token);
        setAdmins(fetchedAdmins);
      } catch (error) {
        console.error('Error fetching admins:', error);
        toast({
          title: "Error",
          description: "Failed to load admin users",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, [toast]);

  const filteredAdmins = admins.filter(admin => {
    const searchTerm = filter.toLowerCase();
    return (
      admin.username.toLowerCase().includes(searchTerm) ||
      admin.email.toLowerCase().includes(searchTerm)
    );
  });

  const handleAddAdmin = async (formData: { name: string; email: string; password: string; role: string; createdAt: string }) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No authentication token found');

      const adminData = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      const response = await fetch('https://learinnghub-backend.onrender.com/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(adminData)
      });

      if (!response.ok) throw new Error('Failed to create admin');

      const newAdmin = await response.json();
      setAdmins([...admins, newAdmin.admin]);
      setAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "New admin has been added successfully",
      });
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add admin",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (id === currentUser?.id) {
      toast({
        title: "Cannot delete",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

    if (confirm('Are you sure you want to delete this admin?')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`https://learinnghub-backend.onrender.com/api/admins/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete admin');

        setAdmins(admins.filter(admin => admin._id !== id));
        
        toast({
          title: "Success",
          description: "Admin has been deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting admin:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete admin",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admins</h1>
          <p className="text-gray-500 mt-1">Manage admin users</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <AdminForm onSubmit={handleAddAdmin} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="relative mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search admins..."
              className="pl-8"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading admins...
                    </TableCell>
                  </TableRow>
                ) : filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell className="font-medium">{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.role}</TableCell>
                      <TableCell>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {admin._id !== currentUser?.id && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteAdmin(admin._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No admins found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
