import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/lib/firebase';
import { DashboardView } from '@/components/dashboard/Dashboard';
import {
  Home,
  BookOpen,
  Trophy,
  Users,
  MessageSquare,
  Video,
  Bot,
  UserIcon,
  Menu,
  X,
  Zap,
  Bell,
  Search,
  Plus,
  Settings,
  ChevronUp,
  ChevronDown,
  Heart,
  Star,
  Target,
  Flame
} from 'lucide-react';

interface MobileNavigationProps {
  user: User;
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
  onLogout: () => void;
}

export default function MobileNavigation({
  user,
  currentView,
  setCurrentView,
  onLogout
}: MobileNavigationProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications] = useState(3);

  // Mobile menu items - prioritized for mobile use
  const mobileMenuItems = [
    { id: "home" as DashboardView, label: "Start", icon: Home, badge: null },
    { id: "learning" as DashboardView, label: "Lernen", icon: BookOpen, badge: null },
    { id: "adaptive" as DashboardView, label: "KI", icon: Bot, badge: 2 },
    { id: "community" as DashboardView, label: "Community", icon: Users, badge: null },
    { id: "messages" as DashboardView, label: "Chat", icon: MessageSquare, badge: 5 }
  ];

  // All menu items for sidebar
  const allMenuItems = [
    { id: "home" as DashboardView, label: "Dashboard", icon: Home },
    { id: "learning" as DashboardView, label: "Lernpfade", icon: BookOpen },
    { id: "progress" as DashboardView, label: "Fortschritt", icon: Trophy },
    { id: "achievements" as DashboardView, label: "Erfolge", icon: Trophy },
    { id: "adaptive" as DashboardView, label: "KI-Lernen", icon: Bot },
    { id: "mentoring" as DashboardView, label: "Mentoring", icon: Users },
    { id: "community" as DashboardView, label: "Community", icon: Users },
    { id: "messages" as DashboardView, label: "Nachrichten", icon: MessageSquare },
    { id: "rooms" as DashboardView, label: "Lernräume", icon: Video },
    { id: "profile" as DashboardView, label: "Profil", icon: UserIcon }
  ];

  // Handle PWA installation
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const closeMenus = () => {
    setShowSidebar(false);
    setShowProfile(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          {/* Logo and Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(true)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold">MeisterWerk</h1>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0">
                  {notifications}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfile(!showProfile)}
              className="p-1"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Quick Profile Dropdown */}
        {showProfile && (
          <div className="absolute top-full right-4 w-64 mt-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{user.xp}</div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">12</div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">85%</div>
                    <div className="text-xs text-muted-foreground">Level</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setCurrentView('profile');
                      closeMenus();
                    }}
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profil bearbeiten
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Einstellungen
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-red-600"
                    onClick={onLogout}
                  >
                    Abmelden
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t">
        <div className="grid grid-cols-5 py-2">
          {mobileMenuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col gap-1 h-auto py-2 px-1 relative ${
                currentView === item.id 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => {
                setCurrentView(item.id);
                closeMenus();
              }}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center p-0">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div 
            className="fixed top-0 left-0 h-full w-80 bg-background border-r transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h1 className="text-xl font-bold">MeisterWerk</h1>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">Level 12 • {user.xp} XP</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <Flame className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                  <div className="text-sm font-semibold">12</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <Star className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                  <div className="text-sm font-semibold">45</div>
                  <div className="text-xs text-muted-foreground">Sterne</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <Target className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                  <div className="text-sm font-semibold">23</div>
                  <div className="text-xs text-muted-foreground">Ziele</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <Trophy className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                  <div className="text-sm font-semibold">8</div>
                  <div className="text-xs text-muted-foreground">Erfolge</div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {allMenuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start gap-3 h-12 ${
                      currentView === item.id 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => {
                      setCurrentView(item.id);
                      setShowSidebar(false);
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Plus className="h-4 w-4" />
                Schnellaktion
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Settings className="h-4 w-4" />
                Einstellungen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">App installieren</h3>
                  <p className="text-sm opacity-90">
                    Installieren Sie MeisterWerk für ein besseres Erlebnis
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={handleInstallPWA}
                  >
                    Installieren
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setShowInstallBanner(false)}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Spacers for mobile layout */}
      <div className="lg:hidden h-16" /> {/* Top spacer */}
      <div className="lg:hidden h-20" /> {/* Bottom spacer */}
    </>
  );
}