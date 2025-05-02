
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  LogOut, 
  ListChecks, 
  Video, 
  Users,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-primary/10 text-primary' : '';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">{currentUser?.name}</p>
        </div>

        <nav className="flex-grow p-4">
          <div className="space-y-1">
            <Link to="/admin/dashboard">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-2 ${isActive('/admin/dashboard')}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            
            <Link to="/admin/questions">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-2 ${isActive('/admin/questions')}`}
              >
                <ListChecks className="h-4 w-4" />
                Questions
              </Button>
            </Link>
            
            <Link to="/admin/videos">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-2 ${isActive('/admin/videos')}`}
              >
                <Video className="h-4 w-4" />
                Videos
              </Button>
            </Link>
            
            <Link to="/admin/languages">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-2 ${isActive('/admin/languages')}`}
              >
                <BookOpen className="h-4 w-4" />
                Languages
              </Button>
            </Link>
            
            <Link to="/admin/users">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-2 ${isActive('/admin/users')}`}
              >
                <Users className="h-4 w-4" />
                Admins
              </Button>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
