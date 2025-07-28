import { useEffect, useState } from "react";
import { User, onAuthStateChange, getCurrentUser } from "@/lib/firebase";
import { mockAuth, MockUser } from "@/lib/mockAuth";
import AuthPage from "@/components/auth/AuthPage";
import Dashboard from "@/components/dashboard/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";

// Use mock auth for demo purposes - set to false to use real Firebase
const USE_MOCK_AUTH = true;

function App() {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK_AUTH) {
      // Use mock authentication for demo
      const unsubscribe = mockAuth.onAuthStateChange((mockUser) => {
        setUser(mockUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Use real Firebase authentication
      const unsubscribe = onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error('Error getting user data:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  if (loading) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="elearning-theme">
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="elearning-theme">
      <div className="min-h-screen bg-background text-foreground">
        {user ? (
          <Dashboard user={user} setUser={setUser} />
        ) : (
          <AuthPage />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;