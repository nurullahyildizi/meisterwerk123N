import { User } from './firebase';

// Mock authentication for demo purposes
export interface MockUser extends User {}

const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'demo@meisterwerk.dev',
    name: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    level: 5,
    xp: 1250,
    wissensTokens: 150,
    role: 'user',
    subscriptionStatus: 'pro',
    registeredAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    status: 'online',
    bio: 'Elektrotechnik-Student mit Leidenschaft für innovative Lerntechnologien',
    location: 'München, Deutschland',
    expertise: ['SPS-Programmierung', 'Schaltungstechnik', 'Photovoltaik'],
    unlockedAchievements: ['first_login', 'circuit_master', 'speed_learner', 'simulation_expert'],
    learningProgress: {
      'sps-grundlagen': { completed: true, progress: 100, score: 95 },
      'schaltungstechnik': { completed: false, progress: 65, score: 78 },
      'photovoltaik': { completed: false, progress: 30, score: 85 }
    },
    friends: [],
    friendRequests: [],
    blockedUsers: [],
    notifications: [],
    privacy: {
      profileVisibility: 'public',
      showLastSeen: true,
      allowFriendRequests: true
    }
  }
];

let currentUser: MockUser | null = null;
let authStateListeners: ((user: MockUser | null) => void)[] = [];

export const mockAuth = {
  signIn: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Allow any email/password for demo
    if (email && password) {
      currentUser = MOCK_USERS[0];
      authStateListeners.forEach(listener => listener(currentUser));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  },

  signUp: async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password.length >= 6) {
      currentUser = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        level: 1,
        xp: 0,
        wissensTokens: 50,
        role: 'user',
        subscriptionStatus: 'free',
        registeredAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        status: 'online',
        bio: '',
        location: '',
        expertise: [],
        unlockedAchievements: ['first_login'],
        learningProgress: {},
        friends: [],
        friendRequests: [],
        blockedUsers: [],
        notifications: [],
        privacy: {
          profileVisibility: 'public',
          showLastSeen: true,
          allowFriendRequests: true
        }
      };
      if (currentUser) {
        MOCK_USERS.push(currentUser);
      }
      authStateListeners.forEach(listener => listener(currentUser));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid registration data' };
  },

  signOut: async (): Promise<void> => {
    currentUser = null;
    authStateListeners.forEach(listener => listener(null));
  },

  getCurrentUser: (): MockUser | null => {
    return currentUser;
  },

  onAuthStateChange: (callback: (user: MockUser | null) => void): (() => void) => {
    authStateListeners.push(callback);
    // Call immediately with current state
    callback(currentUser);
    
    // Return unsubscribe function
    return () => {
      authStateListeners = authStateListeners.filter(listener => listener !== callback);
    };
  }
};

// Auto-login for demo purposes
if (typeof window !== 'undefined') {
  setTimeout(() => {
    // Check if user wants to stay logged out
    const shouldStayLoggedOut = localStorage.getItem('demo_logged_out') === 'true';
    if (!shouldStayLoggedOut) {
      currentUser = MOCK_USERS[0];
      authStateListeners.forEach(listener => listener(currentUser));
    }
  }, 100);
}