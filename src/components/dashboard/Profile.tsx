import { useState, useEffect } from "react";
import { User, updateUserData, searchUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User as UserIcon,
  Mail,
  Calendar,
  Award,
  Settings,
  Crown,
  Zap,
  Edit3,
  Save,
  X,
  Trophy,
  BookOpen,
  Clock,
  Target,
  Users,
  UserPlus,
  Search,
  Check,
  X as XIcon
} from "lucide-react";

interface ProfileProps {
  user: User;
  setUser: (user: User) => void;
}

export default function Profile({ user, setUser }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [isLoading, setIsLoading] = useState(false);
  
  // Friends state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const handleSaveProfile = async () => {
    if (editedName.trim() === user.name) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUserData(user.id, { name: editedName.trim() });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Friends functions
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      setLoadingFriends(true);
      try {
        const results = await searchUsers(term);
        setSearchResults(results.filter(u => u.id !== user.id && !user.friends.includes(u.id)));
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoadingFriends(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSendFriendRequest = async (targetUserId: string) => {
    try {
      await sendFriendRequest(user.id, targetUserId);
      // Remove from search results
      setSearchResults(prev => prev.filter(u => u.id !== targetUserId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptFriendRequest = async (friendId: string) => {
    try {
      await acceptFriendRequest(user.id, friendId);
      // Update user data
      const updatedUser = await updateUserData(user.id, {});
      setUser(updatedUser);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriendRequest = async (friendId: string) => {
    try {
      await rejectFriendRequest(user.id, friendId);
      // Update user data
      const updatedUser = await updateUserData(user.id, {});
      setUser(updatedUser);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const achievements = [
    { 
      id: "FIRST_STEP", 
      title: "Erste Schritte", 
      description: "Ersten Kurs begonnen",
      icon: "🎯",
      unlocked: user.unlockedAchievements.includes("FIRST_STEP")
    },
    { 
      id: "LEVEL_5", 
      title: "Aufsteiger", 
      description: "Level 5 erreicht",
      icon: "⭐",
      unlocked: user.unlockedAchievements.includes("LEVEL_5")
    },
    { 
      id: "LEVEL_10", 
      title: "Experte", 
      description: "Level 10 erreicht",
      icon: "🏆",
      unlocked: user.unlockedAchievements.includes("LEVEL_10")
    },
    { 
      id: "PRO_USER", 
      title: "Pro Nutzer", 
      description: "Pro Mitgliedschaft aktiviert",
      icon: "💎",
      unlocked: user.unlockedAchievements.includes("PRO_USER")
    },
    { 
      id: "FIVE_COMPLETE", 
      title: "Wissbegierig", 
      description: "5 Kurse abgeschlossen",
      icon: "📚",
      unlocked: user.unlockedAchievements.includes("FIVE_COMPLETE")
    },
    { 
      id: "SIM_PRO", 
      title: "Simulator", 
      description: "Erste Simulation abgeschlossen",
      icon: "🔧",
      unlocked: user.unlockedAchievements.includes("SIM_PRO")
    }
  ];

  // Calculate next level progress
  const xpToNextLevel = 500;
  const currentXp = user.xp % xpToNextLevel;
  const levelProgress = (currentXp / xpToNextLevel) * 100;

  // Mock statistics
  const stats = [
    { label: "Abgeschlossene Kurse", value: "12", icon: BookOpen, color: "text-blue-500" },
    { label: "Gesamte Lernzeit", value: "48h", icon: Clock, color: "text-green-500" },
    { label: "Aktuelle Serie", value: "7 Tage", icon: Target, color: "text-purple-500" },
    { label: "Erfolge", value: user.unlockedAchievements.length.toString(), icon: Trophy, color: "text-yellow-500" }
  ];

  const learningHistory = [
    { course: "VDE 0100 Grundlagen", completedAt: "2024-01-15", xpGained: 150 },
    { course: "SPS Programmierung", completedAt: "2024-01-10", xpGained: 200 },
    { course: "Digitale Messtechnik", completedAt: "2024-01-05", xpGained: 175 },
    { course: "Betriebselektriker", completedAt: "2024-12-28", xpGained: 180 }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mein Profil</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Kontoinformationen und verfolgen Sie Ihren Fortschritt
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-center"
                />
                <div className="flex gap-2 justify-center">
                  <Button size="sm" onClick={handleSaveProfile} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-1" />
                    {isLoading ? "Speichert..." : "Speichern"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditedName(user.name);
                  }}>
                    <X className="h-4 w-4 mr-1" />
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <CardTitle className="flex items-center justify-center gap-2">
                  {user.name}
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant={user.role === "meister" ? "default" : "secondary"}>
                    {user.role === "meister" ? "Meister" : user.role === "admin" ? "Admin" : "Nutzer"}
                  </Badge>
                  <Badge variant={user.subscriptionStatus === "pro" ? "default" : "secondary"}>
                    {user.subscriptionStatus === "pro" ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        Pro
                      </>
                    ) : "Free"}
                  </Badge>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-primary" />
                  Level {user.level}
                </span>
                <span>{currentXp} / {xpToNextLevel} XP</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>

            {/* Basic Info */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Dabei seit {new Date(user.registeredAt).toLocaleDateString('de-DE')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span>{user.wissensTokens} Wissens-Tokens</span>
              </div>
            </div>

            {/* Upgrade Button for Free Users */}
            {user.subscriptionStatus === "free" && (
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Crown className="h-4 w-4 mr-2" />
                Auf Pro upgraden
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList>
              <TabsTrigger value="stats">Statistiken</TabsTrigger>
              <TabsTrigger value="achievements">Erfolge</TabsTrigger>
              <TabsTrigger value="friends">Freunde</TabsTrigger>
              <TabsTrigger value="history">Verlauf</TabsTrigger>
              <TabsTrigger value="settings">Einstellungen</TabsTrigger>
            </TabsList>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </div>
                          <Icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Wöchentliche Aktivität</CardTitle>
                  <CardDescription>
                    Ihr Lernfortschritt der letzten 7 Tage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-end justify-between gap-2">
                    {[40, 65, 30, 80, 45, 70, 55].map((height, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-primary/20 rounded-sm transition-all hover:bg-primary/30"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={achievement.unlocked ? "" : "opacity-50"}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">
                          {achievement.unlocked ? achievement.icon : "🔒"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                          <Badge variant="secondary">Erreicht</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Abgeschlossene Kurse</CardTitle>
                  <CardDescription>
                    Ihre jüngsten Lernerfolge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">{item.course}</h4>
                            <p className="text-sm text-muted-foreground">
                              Abgeschlossen am {new Date(item.completedAt).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">+{item.xpGained} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Friends Tab */}
            <TabsContent value="friends" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Friend Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Freundschaftsanfragen
                      {user.friendRequests.length > 0 && (
                        <Badge variant="destructive">{user.friendRequests.length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.friendRequests.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Keine offenen Anfragen
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {user.friendRequests.map((request) => (
                          <div key={request.fromId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                  {request.fromName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{request.fromName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(request.timestamp).toLocaleDateString('de-DE')}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAcceptFriendRequest(request.fromId)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectFriendRequest(request.fromId)}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Search Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Neue Freunde finden
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nach Benutzern suchen..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {loadingFriends && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Suche läuft...
                      </p>
                    )}
                    
                    {searchResults.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {searchResults.map((foundUser) => (
                          <div key={foundUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                  {foundUser.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{foundUser.name}</p>
                                <p className="text-xs text-muted-foreground">{foundUser.email}</p>
                                <div className="flex gap-1 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    Level {foundUser.level}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {foundUser.role}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => handleSendFriendRequest(foundUser.id)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Hinzufügen
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {searchTerm && !loadingFriends && searchResults.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Keine Benutzer gefunden
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Current Friends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Meine Freunde ({user.friends.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.friends.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">Noch keine Freunde</p>
                      <p className="text-sm text-muted-foreground">
                        Finde andere Lernende und erweitere dein Netzwerk!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {user.friends.map((friendId) => (
                        <Card key={friendId} className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {friendId.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">Freund {friendId.substring(0, 8)}</p>
                              <p className="text-xs text-muted-foreground">Online</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1">
                              Nachricht
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              Profil
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kontoeinstellungen</CardTitle>
                  <CardDescription>
                    Verwalten Sie Ihre Konto- und Datenschutzeinstellungen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse</Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Benachrichtigungen</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">E-Mail-Benachrichtigungen für neue Kurse</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Wöchentlicher Fortschrittsbericht</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">Community-Updates</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="destructive">Konto löschen</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}