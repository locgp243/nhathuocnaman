'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

interface UserInfo {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  reward_points: number;
}

interface AuthContextType {
  user: UserInfo | null;
  login: (userData: UserInfo, token: string) => void;
  logout: () => void;
  updateUser: (newUserData: Partial<UserInfo>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const userInfoString = localStorage.getItem('user_info');
      if (userInfoString) {
        setUser(JSON.parse(userInfoString));
      }
    } catch (error) {
      console.error("Lỗi parse thông tin người dùng từ localStorage", error);
      localStorage.removeItem('user_info');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: UserInfo, token: string) => {
    localStorage.setItem('user_info', JSON.stringify(userData));
    localStorage.setItem('auth_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user_info');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const updateUser = (newUserData: Partial<UserInfo>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...newUserData };
      // Cập nhật lại localStorage với thông tin mới
      localStorage.setItem('user_info', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};