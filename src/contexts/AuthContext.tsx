import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Juan Mesero',
    username: 'mesero',
    role: 'waiter',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Ana Cajera',
    username: 'cajero',
    role: 'cashier',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Chef Carlos',
    username: 'chef',
    role: 'kitchen',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Host María',
    username: 'host',
    role: 'host',
    isActive: true,
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this would call an API
    const foundUser = mockUsers.find(u => u.username === username);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasRole = (role: UserRole): boolean => {
    if (user?.role === 'admin') return true;
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}