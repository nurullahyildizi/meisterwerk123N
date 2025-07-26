import { useState } from "react";
import { User, logoutUser } from "@/lib/firebase";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import LearningPaths from "./LearningPaths";
import Profile from "./Profile";
import Community from "./Community";
import SocialHub from "./SocialHub";
import Messages from "./Messages";
import LearningRooms from "./LearningRooms";
import ProgressDashboard from "./ProgressDashboard";

export type DashboardView = "home" | "learning" | "social" | "community" | "profile" | "messages" | "rooms" | "progress";

interface DashboardProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function Dashboard({ user, setUser }: DashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("home");

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <DashboardHome user={user} />;
      case "learning":
        return <LearningPaths user={user} />;
      case "social":
        return <SocialHub user={user} />;
      case "community":
        return <Community user={user} />;
      case "messages":
        return <Messages user={user} />;
      case "rooms":
        return <LearningRooms user={user} />;
      case "progress":
        return <ProgressDashboard user={user} />;
      case "profile":
        return <Profile user={user} setUser={setUser} />;
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}