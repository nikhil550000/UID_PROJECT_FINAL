
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'admin' | 'employer') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasAccess: (requiredRole: 'admin' | 'employer') => boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for demo accounts
      if (email === 'admin@pharma.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: email,
          role: 'admin'
        };
        
        setUser(mockUser);
        localStorage.setItem('auth_token', 'mock_token_123');
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        return true;
      } else if (email === 'employer@pharma.com' && password === 'employer123') {
        const mockUser: User = {
          id: '2',
          name: 'Jane Smith',
          email: email,
          role: 'employer'
        };
        
        setUser(mockUser);
        localStorage.setItem('auth_token', 'mock_token_456');
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        return true;
      }
      
      // Check registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userToSet: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role
        };
        
        setUser(userToSet);
        localStorage.setItem('auth_token', `token_${foundUser.id}`);
        localStorage.setItem('user_data', JSON.stringify(userToSet));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'admin' | 'employer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock signup - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const existingUser = registeredUsers.find((u: any) => u.email === email);
      
      if (existingUser) {
        return false; // User already exists
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role
      };
      
      registeredUsers.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
      
      // Auto-login the new user
      const userToSet: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      
      setUser(userToSet);
      localStorage.setItem('auth_token', `token_${newUser.id}`);
      localStorage.setItem('user_data', JSON.stringify(userToSet));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const hasAccess = (requiredRole: 'admin' | 'employer'): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has access to everything
    return user.role === requiredRole;
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
    hasAccess
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
