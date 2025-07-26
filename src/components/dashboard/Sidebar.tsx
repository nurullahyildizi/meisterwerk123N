import { User } from "@/lib/firebase";
import { DashboardView } from "./Dashboard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BookOpen, 
  Users, 
  User as UserIcon, 
  LogOut, 
  Zap, 
  Trophy,
  Settings,
  MessageSquare,
  Share2,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: User;
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
  onLogout: () => void;
}

export default function Sidebar({ user, currentView, setCurrentView, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "home" as DashboardView, label: "Dashboard", icon: Home },
    { id: "learning" as DashboardView, label: "Lernpfade", icon: BookOpen },
    { id: "progress" as DashboardView, label: "Fortschritt", icon: Trophy },
    { id: "social" as DashboardView, label: "Social Hub", icon: Share2 },
    { id: "messages" as DashboardView, label: "Nachrichten", icon: MessageSquare },
    { id: "rooms" as DashboardView, label: "Lernräume", icon: Video },
    { id: "community" as DashboardView, label: "Community", icon: Users },
    { id: "profile" as DashboardView, label: "Profil", icon: UserIcon },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">MeisterWerk</h1>
        </div>
        
        {/* User info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Level {user.level}
              </Badge>
              <span className="text-xs text-muted-foreground">{user.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  currentView === item.id && "bg-primary/10 text-primary"
                )}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Fortschritt
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Wissens-Tokens</span>
              <span className="font-medium">{user.wissensTokens}</span>
            </div>
            <div className="flex justify-between">
              <span>Erfolge</span>
              <span className="font-medium">{user.unlockedAchievements.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <Badge variant={user.subscriptionStatus === "pro" ? "default" : "secondary"}>
                {user.subscriptionStatus === "pro" ? "Pro" : "Free"}
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3">
            <Settings className="h-4 w-4" />
            Einstellungen
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </div>
    </div>
  );
}