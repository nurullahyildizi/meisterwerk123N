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
  Video,
  Bot,
  Sparkles
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
    { id: "achievements" as DashboardView, label: "Erfolge", icon: Trophy },
    { id: "adaptive" as DashboardView, label: "KI-Lernen", icon: Bot },
    { id: "mentoring" as DashboardView, label: "Mentoring", icon: Users },
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

        {/* KI-Assistent Widget */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <h3 className="font-medium text-sm">KI-Assistent</h3>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
              <Sparkles className="h-2 w-2 mr-1" />
              3 neue
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Ihr persönlicher Lernpartner ist bereit zu helfen!
          </p>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">Online & verfügbar</span>
            </div>
            <div className="text-muted-foreground">
              💡 Neue Empfehlungen verfügbar
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
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
              <span>KI-Erfolgsrate</span>
              <span className="font-medium text-green-600">94%</span>
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