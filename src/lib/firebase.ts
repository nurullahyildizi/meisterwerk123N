import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Firebase configuration


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances of Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enhanced User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  wissensTokens: number;
  role: 'user' | 'meister' | 'admin';
  subscriptionStatus: 'free' | 'pro';
  registeredAt: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'busy' | 'learning';
  bio?: string;
  location?: string;
  expertise: string[];
  unlockedAchievements: string[];
  learningProgress: Record<string, any>;
  friends: string[];
  friendRequests: Array<{ fromId: string; fromName: string; timestamp: string; }>;
  blockedUsers: string[];
  notifications: UserNotification[];
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showLastSeen: boolean;
    allowFriendRequests: boolean;
  };
}

// Social Post interface
export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  images?: string[];
  type: 'text' | 'achievement' | 'course_completion' | 'question' | 'tip';
  tags: string[];
  likes: string[]; // Array of user IDs who liked
  comments: PostComment[];
  shares: number;
  createdAt: string;
  updatedAt?: string;
  visibility: 'public' | 'friends' | 'private';
  pinned?: boolean;
}

// Comment interface
export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: string[];
  replies: CommentReply[];
  createdAt: string;
  updatedAt?: string;
}

// Comment Reply interface
export interface CommentReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: string[];
  createdAt: string;
  replyToId?: string; // If replying to another reply
}

// Message interfaces
export interface PrivateMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
  editedAt?: string;
  replyTo?: string; // Message ID this is replying to
}

// Group Chat interfaces
export interface GroupChat {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  adminIds: string[];
  memberIds: string[];
  createdAt: string;
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: string;
  };
  isLearningRoom: boolean;
  learningRoomData?: LearningRoomData;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'system';
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  editedAt?: string;
  reactions: { [emoji: string]: string[] }; // emoji -> array of user IDs
  replyTo?: string;
}

// Learning Room interfaces
export interface LearningRoom {
  id: string;
  name: string;
  description: string;
  subject: string;
  tags: string[];
  createdBy: string;
  instructors: string[];
  participants: string[];
  maxParticipants: number;
  isPrivate: boolean;
  schedule?: {
    startTime: string;
    endTime: string;
    recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  };
  resources: LearningResource[];
  whiteboardData?: any; // TLDraw data
  createdAt: string;
  isActive: boolean;
}

export interface LearningRoomData {
  whiteboardUrl?: string;
  sharedFiles: SharedFile[];
  polls: Poll[];
  quiz?: Quiz;
}

export interface SharedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: { [option: string]: string[] }; // option -> user IDs
  createdBy: string;
  createdAt: string;
  endsAt?: string;
}

// Course and Learning interfaces
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorName: string;
  thumbnailUrl?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  lessons: Lesson[];
  requirements: string[];
  objectives: string[];
  tags: string[];
  rating: number;
  enrolledCount: number;
  price: number;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'simulation' | 'assignment';
  content: LessonContent;
  duration: number;
  isCompleted?: boolean;
  order: number;
}

export interface LessonContent {
  videoUrl?: string;
  textContent?: string;
  quiz?: Quiz;
  simulationData?: any;
  assignment?: Assignment;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
  maxAttempts: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'text' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  dueDate?: string;
  maxScore: number;
  submissionFormat: 'text' | 'file' | 'both';
  rubric?: AssignmentRubric[];
}

export interface AssignmentRubric {
  criteria: string;
  levels: { name: string; description: string; points: number }[];
}

// Learning Resource interfaces
export interface LearningResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'simulation' | 'tool';
  url: string;
  description?: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
}

// Notification interface
export interface UserNotification {
  id: string;
  type: 'friend_request' | 'message' | 'course_update' | 'achievement' | 'reminder' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  actionUrl?: string;
  relatedId?: string; // ID of related object (friend request, message, etc.)
  createdAt: string;
}

// Achievement interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'completion' | 'streak' | 'special';
  requirement: {
    type: 'courses_completed' | 'xp_gained' | 'days_streak' | 'friends_made' | 'posts_shared';
    value: number;
  };
  reward: {
    xp: number;
    tokens: number;
    badge?: string;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// Progress Tracking interfaces
export interface CourseProgress {
  courseId: string;
  enrolledAt: string;
  completedLessons: string[];
  currentLesson: number;
  progress: number; // percentage
  totalTimeSpent: number; // in minutes
  lastAccessedAt: string;
  quizScores: { [lessonId: string]: number };
  certificateEarned?: boolean;
  completedAt?: string;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  weeklyGoal: number; // minutes
  weeklyProgress: number; // minutes
}

export interface UserStats {
  totalCoursesCompleted: number;
  totalTimeSpent: number; // in minutes
  totalXpEarned: number;
  totalTokensEarned: number;
  averageQuizScore: number;
  certificatesEarned: number;
  learningStreak: LearningStreak;
  monthlyStats: { [month: string]: MonthlyStats };
}

export interface MonthlyStats {
  coursesCompleted: number;
  timeSpent: number;
  xpEarned: number;
  tokensEarned: number;
  achievementsUnlocked: number;
}

export interface Leaderboard {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  score: number;
  rank: number;
  type: 'xp' | 'courses' | 'streak' | 'monthly';
  period: string; // 'all-time', '2024-01', etc.
}

// Event interface
export interface LearningEvent {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'webinar' | 'study_group' | 'competition' | 'networking';
  startDate: string;
  endDate: string;
  location?: string; // "online" or physical address
  maxParticipants?: number;
  participants: string[];
  instructors: string[];
  tags: string[];
  isPaid: boolean;
  price?: number;
  meetingUrl?: string;
  createdBy: string;
  createdAt: string;
}

// Authentication functions
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      return { success: true, user: userData };
    } else {
      throw new Error('Benutzerdaten nicht gefunden');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' 
        ? 'E-Mail oder Passwort ungültig' 
        : 'Anmeldung fehlgeschlagen' 
    };
  }
};

export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Create user document in Firestore
    const newUser: User = {
      id: firebaseUser.uid,
      name,
      email,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      level: 1,
      xp: 0,
      wissensTokens: 5,
      role: 'user',
      subscriptionStatus: 'free',
      registeredAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      status: 'online',
      expertise: [],
      unlockedAchievements: [],
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
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    
    return { success: true, user: newUser };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: error.code === 'auth/email-already-in-use' 
        ? 'Diese E-Mail-Adresse wird bereits verwendet' 
        : 'Registrierung fehlgeschlagen' 
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
};

export const updateUserData = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    
    const updatedDoc = await getDoc(userRef);
    if (updatedDoc.exists()) {
      return updatedDoc.data() as User;
    }
    throw new Error('User not found after update');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// SOCIAL FEATURES FUNCTIONS

// Posts functions
export const createPost = async (authorId: string, content: string, type: SocialPost['type'] = 'text', images?: string[], tags: string[] = []): Promise<string> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const postRef = collection(db, 'posts');
    const newPost: Omit<SocialPost, 'id'> = {
      authorId,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      images,
      type,
      tags,
      likes: [],
      comments: [],
      shares: 0,
      createdAt: new Date().toISOString(),
      visibility: 'public'
    };
    
    const docRef = await addDoc(postRef, newPost);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async (limit_count: number = 20): Promise<SocialPost[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limit_count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SocialPost));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayRemove(userId)
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const addComment = async (postId: string, authorId: string, content: string): Promise<void> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const comment: PostComment = {
      id: `comment_${Date.now()}_${Math.random()}`,
      authorId,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      likes: [],
      replies: [],
      createdAt: new Date().toISOString()
    };
    
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Friends functions
export const sendFriendRequest = async (fromUserId: string, toUserId: string): Promise<void> => {
  try {
    const fromUser = await getCurrentUser();
    if (!fromUser) throw new Error('User not authenticated');
    
    const toUserRef = doc(db, 'users', toUserId);
    const friendRequest = {
      fromId: fromUserId,
      fromName: fromUser.name,
      timestamp: new Date().toISOString()
    };
    
    await updateDoc(toUserRef, {
      friendRequests: arrayUnion(friendRequest)
    });
    
    // Create notification
    await addNotification(toUserId, {
      type: 'friend_request',
      title: 'Neue Freundschaftsanfrage',
      content: `${fromUser.name} möchte dein Freund werden`,
      relatedId: fromUserId
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (userId: string, friendId: string): Promise<void> => {
  try {
    // Add to both users' friend lists
    const userRef = doc(db, 'users', userId);
    const friendRef = doc(db, 'users', friendId);
    
    await Promise.all([
      updateDoc(userRef, {
        friends: arrayUnion(friendId),
        friendRequests: arrayRemove({ fromId: friendId })
      }),
      updateDoc(friendRef, {
        friends: arrayUnion(userId)
      })
    ]);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const rejectFriendRequest = async (userId: string, friendId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friendRequests: arrayRemove({ fromId: friendId })
    });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

// Messaging functions
export const sendPrivateMessage = async (senderId: string, receiverId: string, content: string, type: PrivateMessage['type'] = 'text'): Promise<void> => {
  try {
    const messageRef = collection(db, 'privateMessages');
    const message: Omit<PrivateMessage, 'id'> = {
      senderId,
      receiverId,
      content,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    await addDoc(messageRef, message);
    
    // Create notification for receiver
    const sender = await getCurrentUser();
    if (sender) {
      await addNotification(receiverId, {
        type: 'message',
        title: 'Neue Nachricht',
        content: `${sender.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
        relatedId: senderId
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getPrivateMessages = async (userId1: string, userId2: string): Promise<PrivateMessage[]> => {
  try {
    const messagesRef = collection(db, 'privateMessages');
    const q = query(
      messagesRef,
      where('senderId', 'in', [userId1, userId2]),
      where('receiverId', 'in', [userId1, userId2]),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as PrivateMessage))
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Learning Rooms functions
export const createLearningRoom = async (roomData: Omit<LearningRoom, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const roomRef = collection(db, 'learningRooms');
    const newRoom = {
      ...roomData,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    const docRef = await addDoc(roomRef, newRoom);
    return docRef.id;
  } catch (error) {
    console.error('Error creating learning room:', error);
    throw error;
  }
};

export const joinLearningRoom = async (roomId: string, userId: string): Promise<void> => {
  try {
    const roomRef = doc(db, 'learningRooms', roomId);
    await updateDoc(roomRef, {
      participants: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error joining learning room:', error);
    throw error;
  }
};

export const getLearningRooms = async (): Promise<LearningRoom[]> => {
  try {
    const roomsRef = collection(db, 'learningRooms');
    const q = query(roomsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LearningRoom));
  } catch (error) {
    console.error('Error fetching learning rooms:', error);
    return [];
  }
};

// Group Chat functions
export const createGroupChat = async (name: string, description: string, adminId: string, memberIds: string[] = []): Promise<string> => {
  try {
    const groupRef = collection(db, 'groupChats');
    const newGroup: Omit<GroupChat, 'id'> = {
      name,
      description,
      adminIds: [adminId],
      memberIds: [adminId, ...memberIds],
      createdAt: new Date().toISOString(),
      isLearningRoom: false
    };
    
    const docRef = await addDoc(groupRef, newGroup);
    return docRef.id;
  } catch (error) {
    console.error('Error creating group chat:', error);
    throw error;
  }
};

export const sendGroupMessage = async (groupId: string, senderId: string, content: string, type: GroupMessage['type'] = 'text'): Promise<void> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const messageRef = collection(db, 'groupMessages');
    const message: Omit<GroupMessage, 'id'> = {
      groupId,
      senderId,
      senderName: user.name,
      senderAvatar: user.avatar,
      content,
      type,
      createdAt: new Date().toISOString(),
      reactions: {}
    };
    
    await addDoc(messageRef, message);
    
    // Update group's last message
    const groupRef = doc(db, 'groupChats', groupId);
    await updateDoc(groupRef, {
      lastMessage: {
        content: content.substring(0, 100),
        senderId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error sending group message:', error);
    throw error;
  }
};

// Notification functions
export const addNotification = async (userId: string, notification: Omit<UserNotification, 'id' | 'isRead' | 'createdAt'>): Promise<void> => {
  try {
    const newNotification: UserNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      notifications: arrayUnion(newNotification)
    });
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const updatedNotifications = userData.notifications.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      
      await updateDoc(doc(db, 'users', userId), {
        notifications: updatedNotifications
      });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Course functions
export const getCourses = async (): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Course));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const enrollInCourse = async (courseId: string, userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const courseRef = doc(db, 'courses', courseId);
    
    await Promise.all([
      updateDoc(userRef, {
        [`learningProgress.${courseId}`]: {
          enrolledAt: new Date().toISOString(),
          completedLessons: [],
          currentLesson: 0,
          progress: 0
        }
      }),
      updateDoc(courseRef, {
        enrolledCount: increment(1)
      })
    ]);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

// Real-time listeners
export const listenToPosts = (callback: (posts: SocialPost[]) => void) => {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));
  
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SocialPost));
    callback(posts);
  });
};

export const listenToMessages = (userId1: string, userId2: string, callback: (messages: PrivateMessage[]) => void) => {
  const messagesRef = collection(db, 'privateMessages');
  const q = query(
    messagesRef,
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as PrivateMessage))
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      );
    callback(messages);
  });
};

export const listenToGroupMessages = (groupId: string, callback: (messages: GroupMessage[]) => void) => {
  const messagesRef = collection(db, 'groupMessages');
  const q = query(
    messagesRef,
    where('groupId', '==', groupId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GroupMessage));
    callback(messages);
  });
};

// Search functions
export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  try {
    // Note: This is a simple implementation. For production, consider using Algolia or similar
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as User))
      .filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 20); // Limit results
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// File upload helper
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Initialize sample data (call once)
export const initializeSampleData = async (): Promise<void> => {
  try {
    // Add sample achievements
    const achievementsRef = collection(db, 'achievements');
    const sampleAchievements: Omit<Achievement, 'id'>[] = [
      {
        name: 'Erster Schritt',
        description: 'Ersten Kurs erfolgreich abgeschlossen',
        icon: '🎓',
        category: 'completion',
        requirement: { type: 'courses_completed', value: 1 },
        reward: { xp: 100, tokens: 5 },
        rarity: 'common'
      },
      {
        name: 'Sozialer Butterfly',
        description: '10 Freunde hinzugefügt',
        icon: '👥',
        category: 'social',
        requirement: { type: 'friends_made', value: 10 },
        reward: { xp: 200, tokens: 10 },
        rarity: 'uncommon'
      }
    ];
    
    for (const achievement of sampleAchievements) {
      await addDoc(achievementsRef, achievement);
    }
    
    console.log('Sample data initialized');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// PROGRESS TRACKING FUNCTIONS

// Update lesson completion
export const completeLesson = async (userId: string, courseId: string, lessonId: string, timeSpent: number = 0, quizScore?: number): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) throw new Error('User not found');
    
    const userData = userDoc.data() as User;
    const courseProgress = userData.learningProgress[courseId] || {
      enrolledAt: new Date().toISOString(),
      completedLessons: [],
      currentLesson: 0,
      progress: 0,
      totalTimeSpent: 0,
      lastAccessedAt: new Date().toISOString(),
      quizScores: {}
    };
    
    // Update lesson completion
    if (!courseProgress.completedLessons.includes(lessonId)) {
      courseProgress.completedLessons.push(lessonId);
    }
    
    courseProgress.totalTimeSpent += timeSpent;
    courseProgress.lastAccessedAt = new Date().toISOString();
    
    if (quizScore !== undefined) {
      courseProgress.quizScores[lessonId] = quizScore;
    }
    
    // Calculate progress percentage (assuming course has 5 lessons for now)
    const totalLessons = 5; // This should come from the course data
    courseProgress.progress = (courseProgress.completedLessons.length / totalLessons) * 100;
    
    // Award XP for lesson completion
    const xpReward = 50;
    const tokenReward = 2;
    
    await updateDoc(userRef, {
      [`learningProgress.${courseId}`]: courseProgress,
      xp: increment(xpReward),
      wissensTokens: increment(tokenReward),
      lastSeen: new Date().toISOString()
    });
    
    // Check for course completion
    if (courseProgress.progress >= 100) {
      await completeCourse(userId, courseId);
    }
    
    // Update learning streak
    await updateLearningStreak(userId, timeSpent);
    
    // Check for achievements
    await checkAchievements(userId);
    
  } catch (error) {
    console.error('Error completing lesson:', error);
    throw error;
  }
};

// Complete entire course
export const completeCourse = async (userId: string, courseId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const courseCompletionXP = 500;
    const courseCompletionTokens = 25;
    
    await updateDoc(userRef, {
      [`learningProgress.${courseId}.completedAt`]: new Date().toISOString(),
      [`learningProgress.${courseId}.certificateEarned`]: true,
      xp: increment(courseCompletionXP),
      wissensTokens: increment(courseCompletionTokens)
    });
    
    // Create achievement post
    await createPost(userId, `🎓 Ich habe erfolgreich den Kurs abgeschlossen!`, 'course_completion');
    
    // Check for achievements
    await checkAchievements(userId);
    
  } catch (error) {
    console.error('Error completing course:', error);
    throw error;
  }
};

// Update learning streak
export const updateLearningStreak = async (userId: string, timeSpent: number): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data() as User;
    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = userData.learningProgress.lastActivityDate || '';
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let currentStreak = userData.learningProgress.currentStreak || 0;
    let longestStreak = userData.learningProgress.longestStreak || 0;
    
    if (lastActivityDate === today) {
      // Already learned today, just update time
    } else if (lastActivityDate === yesterday) {
      // Consecutive day, increase streak
      currentStreak += 1;
    } else {
      // Streak broken, reset to 1
      currentStreak = 1;
    }
    
    // Update longest streak if current is higher
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    
    await updateDoc(userRef, {
      'learningProgress.currentStreak': currentStreak,
      'learningProgress.longestStreak': longestStreak,
      'learningProgress.lastActivityDate': today,
      'learningProgress.weeklyProgress': increment(timeSpent)
    });
    
  } catch (error) {
    console.error('Error updating learning streak:', error);
  }
};

// Check and award achievements
export const checkAchievements = async (userId: string): Promise<string[]> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return [];
    
    const userData = userDoc.data() as User;
    const newAchievements: string[] = [];
    
    // Get all available achievements
    const achievementsRef = collection(db, 'achievements');
    const achievementsSnapshot = await getDocs(achievementsRef);
    
    for (const achievementDoc of achievementsSnapshot.docs) {
      const achievement = { id: achievementDoc.id, ...achievementDoc.data() } as Achievement;
      
      // Skip if already unlocked
      if (userData.unlockedAchievements.includes(achievement.id)) continue;
      
      let isUnlocked = false;
      
      switch (achievement.requirement.type) {
        case 'courses_completed':
          const completedCourses = Object.values(userData.learningProgress)
            .filter((progress: any) => progress.completedAt).length;
          isUnlocked = completedCourses >= achievement.requirement.value;
          break;
          
        case 'xp_gained':
          isUnlocked = userData.xp >= achievement.requirement.value;
          break;
          
        case 'days_streak':
          const currentStreak = userData.learningProgress.currentStreak || 0;
          isUnlocked = currentStreak >= achievement.requirement.value;
          break;
          
        case 'friends_made':
          isUnlocked = userData.friends.length >= achievement.requirement.value;
          break;
      }
      
      if (isUnlocked) {
        // Award achievement
        await updateDoc(userRef, {
          unlockedAchievements: arrayUnion(achievement.id),
          xp: increment(achievement.reward.xp),
          wissensTokens: increment(achievement.reward.tokens)
        });
        
        // Create notification
        const notification: UserNotification = {
          id: `achievement_${achievement.id}_${Date.now()}`,
          type: 'achievement',
          title: `Achievement freigeschaltet: ${achievement.name}`,
          content: achievement.description,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        await updateDoc(userRef, {
          notifications: arrayUnion(notification)
        });
        
        // Create achievement post
        await createPost(userId, `🏆 Neues Achievement freigeschaltet: ${achievement.name}!`, 'achievement');
        
        newAchievements.push(achievement.id);
      }
    }
    
    return newAchievements;
    
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

// Get user statistics
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return null;
    
    const userData = userDoc.data() as User;
    const learningProgress = userData.learningProgress || {};
    
    let totalCoursesCompleted = 0;
    let totalTimeSpent = 0;
    let totalQuizScore = 0;
    let quizCount = 0;
    let certificatesEarned = 0;
    
    Object.values(learningProgress).forEach((progress: any) => {
      if (progress.completedAt) {
        totalCoursesCompleted++;
      }
      if (progress.certificateEarned) {
        certificatesEarned++;
      }
      if (progress.totalTimeSpent) {
        totalTimeSpent += progress.totalTimeSpent;
      }
      if (progress.quizScores) {
        Object.values(progress.quizScores).forEach((score: any) => {
          totalQuizScore += score;
          quizCount++;
        });
      }
    });
    
    const stats: UserStats = {
      totalCoursesCompleted,
      totalTimeSpent,
      totalXpEarned: userData.xp,
      totalTokensEarned: userData.wissensTokens,
      averageQuizScore: quizCount > 0 ? totalQuizScore / quizCount : 0,
      certificatesEarned,
      learningStreak: {
        currentStreak: learningProgress.currentStreak || 0,
        longestStreak: learningProgress.longestStreak || 0,
        lastActivityDate: learningProgress.lastActivityDate || '',
        weeklyGoal: 300, // 5 hours default
        weeklyProgress: learningProgress.weeklyProgress || 0
      },
      monthlyStats: {} // Could be implemented later
    };
    
    return stats;
    
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
};

// Get leaderboard
export const getLeaderboard = async (type: 'xp' | 'courses' | 'streak' = 'xp', limitCount: number = 50): Promise<Leaderboard[]> => {
  try {
    const usersRef = collection(db, 'users');
    let q;
    
    switch (type) {
      case 'xp':
        q = query(usersRef, orderBy('xp', 'desc'), limit(limitCount));
        break;
      case 'courses':
        // This would need to be calculated differently in a real app
        q = query(usersRef, orderBy('xp', 'desc'), limit(limitCount));
        break;
      case 'streak':
        // This would also need custom calculation
        q = query(usersRef, orderBy('xp', 'desc'), limit(limitCount));
        break;
      default:
        q = query(usersRef, orderBy('xp', 'desc'), limit(limitCount));
    }
    
    const snapshot = await getDocs(q);
    const leaderboard: Leaderboard[] = [];
    
    snapshot.docs.forEach((doc, index) => {
      const userData = doc.data() as User;
      leaderboard.push({
        id: doc.id,
        userId: userData.id,
        userName: userData.name,
        userAvatar: userData.avatar,
        score: userData.xp,
        rank: index + 1,
        type,
        period: 'all-time'
      });
    });
    
    return leaderboard;
    
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

// Get all achievements
export const getAllAchievements = async (): Promise<Achievement[]> => {
  try {
    const achievementsRef = collection(db, 'achievements');
    const snapshot = await getDocs(achievementsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Achievement));
    
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

// Weekly progress reset (would be called by a scheduled function)
export const resetWeeklyProgress = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'learningProgress.weeklyProgress': 0
    });
  } catch (error) {
    console.error('Error resetting weekly progress:', error);
  }
};