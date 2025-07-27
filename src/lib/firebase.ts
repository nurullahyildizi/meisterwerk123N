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
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// KORREKTUR: Firebase-Konfiguration wird sicher aus Umgebungsvariablen geladen.
// Stellen Sie sicher, dass Ihre .env.local-Datei diese Variablen enthält (z.B. VITE_FIREBASE_API_KEY="...")
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances of Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ========================================================================
// INTERFACE DEFINITIONS
// ========================================================================

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

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  images?: string[];
  type: 'text' | 'achievement' | 'course_completion' | 'question' | 'tip';
  tags: string[];
  likes: string[];
  comments: PostComment[];
  shares: number;
  createdAt: string;
  updatedAt?: string;
  visibility: 'public' | 'friends' | 'private';
  pinned?: boolean;
}

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

export interface CommentReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: string[];
  createdAt: string;
  replyToId?: string;
}

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
  replyTo?: string;
}

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
  reactions: { [emoji: string]: string[] };
  replyTo?: string;
}

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
  whiteboardData?: any;
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
  votes: { [option: string]: string[] };
  createdBy: string;
  createdAt: string;
  endsAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorName: string;
  thumbnailUrl?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
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
  timeLimit?: number;
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

export interface UserNotification {
  id: string;
  type: 'friend_request' | 'message' | 'course_update' | 'achievement' | 'reminder' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  actionUrl?: string;
  relatedId?: string;
  createdAt: string;
}

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

export interface CourseProgress {
  courseId: string;
  enrolledAt: string;
  completedLessons: string[];
  currentLesson: number;
  progress: number;
  totalTimeSpent: number;
  lastAccessedAt: string;
  quizScores: { [lessonId: string]: number };
  certificateEarned?: boolean;
  completedAt?: string;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface UserStats {
  totalCoursesCompleted: number;
  totalTimeSpent: number;
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
  period: string;
}

export interface LearningEvent {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'webinar' | 'study_group' | 'competition' | 'networking';
  startDate: string;
  endDate: string;
  location?: string;
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


// ========================================================================
// FIREBASE FUNCTIONS
// ========================================================================

// --- Authentication Functions ---
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      return { success: true, user: userDoc.data() as User };
    } else {
      throw new Error('Benutzerdaten nicht gefunden');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'E-Mail oder Passwort ungültig'
    };
  }
};

export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
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
    return userDoc.exists() ? userDoc.data() as User : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUserDataById = async (userId: string): Promise<User | null> => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() } as User;
        }
        console.warn(`No user found with ID: ${userId}`);
        return null;
    } catch (error) {
        console.error("Error fetching user data by ID:", error);
        return null;
    }
}

export const updateUserData = async (userId: string, updates: Partial<User>): Promise<User> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
  const updatedDoc = await getDoc(userRef);
  if (!updatedDoc.exists()) throw new Error('User not found after update');
  return updatedDoc.data() as User;
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// --- Social Features Functions ---
export const createPost = async (authorId: string, content: string, type: SocialPost['type'] = 'text', images?: string[], tags: string[] = []): Promise<string> => {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const postData: Omit<SocialPost, 'id'> = {
      authorId,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      type,
      tags,
      likes: [],
      comments: [],
      shares: 0,
      createdAt: new Date().toISOString(),
      visibility: 'public'
    };

    if (images && images.length > 0) {
      postData.images = images;
    }

    const postRef = collection(db, 'posts');
    const docRef = await addDoc(postRef, postData);
    return docRef.id;
};

export const getPosts = async (limit_count: number = 20): Promise<SocialPost[]> => {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limit_count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialPost));
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, { likes: arrayUnion(userId) });
};

export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, { likes: arrayRemove(userId) });
};

export const addComment = async (postId: string, authorId: string, content: string): Promise<void> => {
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
  await updateDoc(postRef, { comments: arrayUnion(comment) });
};

// --- Friends Functions ---
export const sendFriendRequest = async (fromUserId: string, toUserId: string): Promise<void> => {
  const fromUser = await getCurrentUser();
  if (!fromUser) throw new Error('User not authenticated');
  const toUserRef = doc(db, 'users', toUserId);
  const friendRequest = {
    fromId: fromUserId,
    fromName: fromUser.name,
    timestamp: new Date().toISOString()
  };
  await updateDoc(toUserRef, { friendRequests: arrayUnion(friendRequest) });
  await addNotification(toUserId, {
    type: 'friend_request',
    title: 'Neue Freundschaftsanfrage',
    content: `${fromUser.name} möchte dein Freund werden`,
    relatedId: fromUserId
  });
};

export const acceptFriendRequest = async (userId: string, friendId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const friendRef = doc(db, 'users', friendId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) throw new Error("User not found");
  const userData = userDoc.data() as User;
  const requestToRemove = userData.friendRequests.find(req => req.fromId === friendId);
  if (!requestToRemove) {
    console.warn("Friend request not found, maybe already handled.");
    await Promise.all([
      updateDoc(userRef, { friends: arrayUnion(friendId) }),
      updateDoc(friendRef, { friends: arrayUnion(userId) })
    ]);
    return;
  }
  await Promise.all([
    updateDoc(userRef, {
      friends: arrayUnion(friendId),
      friendRequests: arrayRemove(requestToRemove)
    }),
    updateDoc(friendRef, { friends: arrayUnion(userId) })
  ]);
};

export const rejectFriendRequest = async (userId: string, friendId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) throw new Error("User not found");
  const userData = userDoc.data() as User;
  const requestToRemove = userData.friendRequests.find(req => req.fromId === friendId);
  if (!requestToRemove) {
      console.warn("Friend request not found for rejection, maybe already handled.");
      return;
  }
  await updateDoc(userRef, { friendRequests: arrayRemove(requestToRemove) });
};

// --- Messaging Functions ---
export const sendPrivateMessage = async (senderId: string, receiverId: string, content: string, type: PrivateMessage['type'] = 'text'): Promise<void> => {
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
  const sender = await getCurrentUser();
  if (sender) {
    await addNotification(receiverId, {
      type: 'message',
      title: 'Neue Nachricht',
      content: `${sender.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
      relatedId: senderId
    });
  }
};

export const getPrivateMessages = async (userId1: string, userId2: string): Promise<PrivateMessage[]> => {
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
};

// --- Learning Rooms Functions ---
export const createLearningRoom = async (roomData: Omit<LearningRoom, 'id' | 'createdAt' | 'isActive'>): Promise<string> => {
  console.log("Attempting to create learning room with data:", roomData);
  try {
    const roomRef = collection(db, 'learningRooms');
    const newRoom = {
      ...roomData,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    console.log("Saving new room to Firestore:", newRoom);
    const docRef = await addDoc(roomRef, newRoom);
    console.log("Successfully created room with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('!!! Firebase Error creating learning room:', error);
    throw error;
  }
};

export const joinLearningRoom = async (roomId: string, userId: string): Promise<void> => {
  const roomRef = doc(db, 'learningRooms', roomId);
  await updateDoc(roomRef, { participants: arrayUnion(userId) });
};

export const getLearningRooms = async (): Promise<LearningRoom[]> => {
  const roomsRef = collection(db, 'learningRooms');
  const q = query(roomsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningRoom));
};

// --- Group Chat Functions ---
export const createGroupChat = async (name: string, description: string, adminId: string, memberIds: string[] = []): Promise<string> => {
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
};

export const sendGroupMessage = async (groupId: string, senderId: string, content: string, type: GroupMessage['type'] = 'text'): Promise<void> => {
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
  
  const groupRef = doc(db, 'learningRooms', groupId);
  const groupDoc = await getDoc(groupRef);
  if (!groupDoc.exists()) {
      const chatRef = doc(db, 'groupChats', groupId);
      const chatDoc = await getDoc(chatRef);
      if(chatDoc.exists()){
        await updateDoc(chatRef, {
            lastMessage: {
              content: content.substring(0, 100),
              senderId,
              timestamp: new Date().toISOString()
            }
        });
      }
  }
};

// --- Notification Functions ---
export const addNotification = async (userId: string, notification: Omit<UserNotification, 'id' | 'isRead' | 'createdAt'>): Promise<void> => {
  const newNotification: UserNotification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random()}`,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { notifications: arrayUnion(newNotification) });
};

export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const userData = userDoc.data() as User;
    const updatedNotifications = userData.notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    await updateDoc(doc(db, 'users', userId), { notifications: updatedNotifications });
  }
};

// --- Course Functions ---
export const getCourses = async (): Promise<Course[]> => {
  const coursesRef = collection(db, 'courses');
  const q = query(coursesRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
};

export const enrollInCourse = async (courseId: string, userId: string): Promise<void> => {
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
    updateDoc(courseRef, { enrolledCount: increment(1) })
  ]);
};

// --- Real-time Listeners ---
export const listenToPosts = (callback: (posts: SocialPost[]) => void) => {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialPost));
    callback(posts);
  });
};

export const listenToMessages = (userId1: string, userId2: string, callback: (messages: PrivateMessage[]) => void) => {
  const messagesRef = collection(db, 'privateMessages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
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
  const q = query(messagesRef, where('groupId', '==', groupId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupMessage));
    callback(messages);
  });
};

export const listenToLearningRooms = (
  callback: (rooms: LearningRoom[]) => void,
  onError?: (error: Error) => void
) => {
  const roomsRef = collection(db, 'learningRooms');
  const q = query(roomsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningRoom));
    callback(rooms);
  }, (error) => {
    console.error('Error listening to learning rooms:', error);
    if (onError) onError(error);
  });
};

// --- Search Functions ---
export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as User))
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 20);
};

// --- File Upload Helper ---
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

// --- Progress Tracking Functions ---
export const completeLesson = async (userId: string, courseId: string, lessonId: string, timeSpent: number = 0, quizScore?: number): Promise<void> => {
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
  if (!courseProgress.completedLessons.includes(lessonId)) {
    courseProgress.completedLessons.push(lessonId);
  }
  courseProgress.totalTimeSpent += timeSpent;
  courseProgress.lastAccessedAt = new Date().toISOString();
  if (quizScore !== undefined) {
    courseProgress.quizScores[lessonId] = quizScore;
  }
  const totalLessons = 5; // Should come from course data
  courseProgress.progress = (courseProgress.completedLessons.length / totalLessons) * 100;
  await updateDoc(userRef, {
    [`learningProgress.${courseId}`]: courseProgress,
    xp: increment(50),
    wissensTokens: increment(2),
    lastSeen: new Date().toISOString()
  });
  if (courseProgress.progress >= 100) {
    await completeCourse(userId, courseId);
  }
  await updateLearningStreak(userId, timeSpent);
  await checkAchievements(userId);
};

export const completeCourse = async (userId: string, courseId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    [`learningProgress.${courseId}.completedAt`]: new Date().toISOString(),
    [`learningProgress.${courseId}.certificateEarned`]: true,
    xp: increment(500),
    wissensTokens: increment(25)
  });
  await createPost(userId, `🎓 Ich habe erfolgreich den Kurs abgeschlossen!`, 'course_completion');
  await checkAchievements(userId);
};

export const updateLearningStreak = async (userId: string, timeSpent: number): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) return;
  const userData = userDoc.data() as User;
  const today = new Date().toISOString().split('T')[0];
  const lastActivityDate = userData.learningProgress.lastActivityDate || '';
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let currentStreak = userData.learningProgress.currentStreak || 0;
  let longestStreak = userData.learningProgress.longestStreak || 0;
  if (lastActivityDate !== today) {
    currentStreak = (lastActivityDate === yesterday) ? currentStreak + 1 : 1;
  }
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }
  await updateDoc(userRef, {
    'learningProgress.currentStreak': currentStreak,
    'learningProgress.longestStreak': longestStreak,
    'learningProgress.lastActivityDate': today,
    'learningProgress.weeklyProgress': increment(timeSpent)
  });
};

export const checkAchievements = async (userId: string): Promise<string[]> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) return [];
  const userData = userDoc.data() as User;
  const newAchievements: string[] = [];
  const achievementsSnapshot = await getDocs(collection(db, 'achievements'));
  for (const achievementDoc of achievementsSnapshot.docs) {
    const achievement = { id: achievementDoc.id, ...achievementDoc.data() } as Achievement;
    if (userData.unlockedAchievements.includes(achievement.id)) continue;
    let isUnlocked = false;
    switch (achievement.requirement.type) {
      case 'courses_completed':
        const completed = Object.values(userData.learningProgress).filter((p: any) => p.completedAt).length;
        isUnlocked = completed >= achievement.requirement.value;
        break;
      case 'xp_gained':
        isUnlocked = userData.xp >= achievement.requirement.value;
        break;
      case 'days_streak':
        isUnlocked = (userData.learningProgress.currentStreak || 0) >= achievement.requirement.value;
        break;
      case 'friends_made':
        isUnlocked = userData.friends.length >= achievement.requirement.value;
        break;
    }
    if (isUnlocked) {
      newAchievements.push(achievement.id);
      await updateDoc(userRef, {
        unlockedAchievements: arrayUnion(achievement.id),
        xp: increment(achievement.reward.xp),
        wissensTokens: increment(achievement.reward.tokens)
      });
    }
  }
  return newAchievements;
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  const userData = userDoc.data() as User;
  const lp = userData.learningProgress || {};
  let totalCoursesCompleted = 0, totalTimeSpent = 0, totalQuizScore = 0, quizCount = 0, certificatesEarned = 0;
  Object.values(lp).forEach((p: any) => {
    if (p.completedAt) totalCoursesCompleted++;
    if (p.certificateEarned) certificatesEarned++;
    totalTimeSpent += p.totalTimeSpent || 0;
    if (p.quizScores) {
      const scores = Object.values(p.quizScores) as number[];
      totalQuizScore += scores.reduce((a, b) => a + b, 0);
      quizCount += scores.length;
    }
  });
  return {
    totalCoursesCompleted,
    totalTimeSpent,
    totalXpEarned: userData.xp,
    totalTokensEarned: userData.wissensTokens,
    averageQuizScore: quizCount > 0 ? totalQuizScore / quizCount : 0,
    certificatesEarned,
    learningStreak: {
      currentStreak: lp.currentStreak || 0,
      longestStreak: lp.longestStreak || 0,
      lastActivityDate: lp.lastActivityDate || '',
      weeklyGoal: 300,
      weeklyProgress: lp.weeklyProgress || 0
    },
    monthlyStats: {}
  };
};

export const getLeaderboard = async (type: 'xp' | 'courses' | 'streak' = 'xp', limitCount: number = 50): Promise<Leaderboard[]> => {
  const usersRef = collection(db, 'users');
  let q;
  if (type === 'xp') {
      q = query(usersRef, orderBy('xp', 'desc'), limit(limitCount));
  } else {
      q = query(usersRef, limit(200));
  }
  const snapshot = await getDocs(q);
  let users = snapshot.docs.map(doc => doc.data() as User);
  if (type === 'courses') {
      users.sort((a, b) => Object.values(b.learningProgress).filter((p: any) => p.completedAt).length - Object.values(a.learningProgress).filter((p: any) => p.completedAt).length);
  } else if (type === 'streak') {
      users.sort((a, b) => (b.learningProgress.currentStreak || 0) - (a.learningProgress.currentStreak || 0));
  }
  return users.slice(0, limitCount).map((user, index) => ({
      id: user.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      score: type === 'xp' ? user.xp : (type === 'courses' ? Object.values(user.learningProgress).filter((p: any) => p.completedAt).length : (user.learningProgress.currentStreak || 0)),
      rank: index + 1,
      type,
      period: 'all-time'
  }));
};

export const getAllAchievements = async (): Promise<Achievement[]> => {
  const snapshot = await getDocs(collection(db, 'achievements'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
};

export const resetWeeklyProgress = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { 'learningProgress.weeklyProgress': 0 });
};

// --- Sample Data Initialization ---
export const initializeSampleData = async (): Promise<void> => {
  const achievementsRef = collection(db, 'achievements');
  const sampleAchievements: Omit<Achievement, 'id'>[] = [
    { name: 'Erster Schritt', description: 'Ersten Kurs erfolgreich abgeschlossen', icon: '🎓', category: 'completion', requirement: { type: 'courses_completed', value: 1 }, reward: { xp: 100, tokens: 5 }, rarity: 'common' },
    { name: 'Sozialer Schmetterling', description: '10 Freunde hinzugefügt', icon: '👥', category: 'social', requirement: { type: 'friends_made', value: 10 }, reward: { xp: 200, tokens: 10 }, rarity: 'uncommon' }
  ];
  for (const achievement of sampleAchievements) {
    await addDoc(achievementsRef, achievement);
  }
  console.log('Sample data initialized');
};
