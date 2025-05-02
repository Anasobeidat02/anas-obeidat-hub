
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginAdmin, getAdminProfile } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface AdminUser {
  email: string;
  id: string;
  name: string;
  username?: string;
  role?: string;
}

interface AuthContextType {
  currentUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved token and user info on load
    const token = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (token && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        
        // Verify token with server (optional but recommended)
        getAdminProfile(token)
          .then(profile => {
            // Update user data with latest from server
            const updatedUser = {
              id: profile._id || profile.id,
              email: profile.email,
              name: profile.username || profile.name,
              username: profile.username,
              role: profile.role
            };
            
            setCurrentUser(updatedUser);
            localStorage.setItem('adminUser', JSON.stringify(updatedUser));
          })
          .catch(error => {
            console.error('Error verifying token:', error);
            logout(); // Invalid token, log out
            toast({
              title: "Session Expired",
              description: "Please log in again",
              variant: "destructive"
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        logout(); // Invalid data, log out
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { email });
      
      // Use the real API endpoint
      const response = await loginAdmin(email, password);
      
      if (response && response.token) {
        const userData = {
          id: response.admin._id || response.admin.id,
          email: response.admin.email,
          name: response.admin.username || response.admin.name,
          username: response.admin.username,
          role: response.admin.role
        };
        
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        setCurrentUser(userData);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.username || userData.name}!`,
        });
        
        return true;
      }
      
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setCurrentUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
