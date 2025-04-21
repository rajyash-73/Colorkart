import { User, InsertUser } from "../types/User";
import { Color } from "../types/Color";
import { Palette } from "../types/Palette";

// Generate a simple id 
const generateId = (): number => {
  return Math.floor(Math.random() * 10000);
};

// User related functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
};

export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const registerUser = (userData: InsertUser): User => {
  const users = getUsers();
  
  // Check if user already exists
  const existingUser = users.find(user => user.username === userData.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }
  
  // Create new user
  const newUser: User = {
    id: generateId(),
    ...userData
  };
  
  // Save to local storage
  saveUsers([...users, newUser]);
  saveCurrentUser(newUser);
  
  return newUser;
};

export const loginUser = (username: string, password: string): User => {
  const users = getUsers();
  
  // Find user
  const user = users.find(user => 
    user.username === username && user.password === password
  );
  
  if (!user) {
    throw new Error('Invalid username or password');
  }
  
  // Save current user to localStorage
  saveCurrentUser(user);
  
  return user;
};

export const logoutUser = (): void => {
  saveCurrentUser(null);
};

// Palette related functions
export const getPalettes = (): Palette[] => {
  const palettes = localStorage.getItem('palettes');
  return palettes ? JSON.parse(palettes) : [];
};

export const savePalettes = (palettes: Palette[]): void => {
  localStorage.setItem('palettes', JSON.stringify(palettes));
};

export const getUserPalettes = (userId: number): Palette[] => {
  const palettes = getPalettes();
  return palettes.filter(palette => palette.userId === String(userId));
};

export const savePalette = (name: string, colors: Color[], userId?: number): Palette => {
  const palettes = getPalettes();
  
  const newPalette: Palette = {
    id: String(generateId()),
    name,
    colors,
    userId: userId ? String(userId) : undefined,
    createdAt: new Date()
  };
  
  savePalettes([...palettes, newPalette]);
  
  return newPalette;
};

export const deletePalette = (id: string): void => {
  const palettes = getPalettes();
  const updatedPalettes = palettes.filter(palette => palette.id !== id);
  savePalettes(updatedPalettes);
};