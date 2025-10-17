import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AUTH_STORAGE_KEY = "tradehub_auth";

// Mock user data for demonstration
const MOCK_USERS = [
  {
    Id: 1,
    email: "demo@tradehub.com",
    password: "demo123",
    name: "Demo User",
    avatar: "https://ui-avatars.com/api/?name=Demo+User&background=D2691E&color=fff"
  }
];

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const login = async (email, password) => {
    try {
      // Mock authentication - in production, this would be an API call
      const user = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        toast.error("Invalid email or password");
        return false;
      }

      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      toast.success("Welcome back!");
      return true;
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Mock signup - in production, this would be an API call
      const existingUser = MOCK_USERS.find(u => u.email === email);
      
      if (existingUser) {
        toast.error("Email already registered");
        return false;
      }

      const newUser = {
        Id: MOCK_USERS.length + 1,
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D2691E&color=fff`
      };

      MOCK_USERS.push({ ...newUser, password });
      setCurrentUser(newUser);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    toast.success("Profile updated successfully");
  };

  return {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile
  };
};