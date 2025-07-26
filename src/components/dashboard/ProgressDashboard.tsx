import { useState, useEffect } from "react";
import { User, getUserStats, getAllAchievements, getLeaderboard, UserStats, Achievement, Leaderboard } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy,
  Target,
  Flame,
  Clock,
  BookOpen,
  Star,
  Award,
  Zap,
  Calendar,
  TrendingUp,
  Medal,
  Crown,
  Sparkles,
  ChevronRight,
  Timer,
  Gift,
  Users
} from "lucide-react";

interface ProgressDashboardProps {
  user: User;
}

export default function ProgressDashboard({ user }: ProgressDashboardProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDashboardData();
  }, [user.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stats, allAchievements, leaderboardData] = await Promise.all([
        getUserStats(user.id),
        getAllAchievements(),
        getLeaderboard('xp', 10)
      ]);
      
      setUserStats(stats);
      setAchievements(allAchievements);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'uncommon': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rare': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'epic': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'legendary': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStreakText = (streak: number) => {
    if (streak === 0) return "Noch kein Streak";
    if (streak === 1) return "1 Tag Streak!";
    return `${streak} Tage Streak! 🔥`;
  };

  const getNextLevel = () => {
    const currentLevel = user.level;
    const xpForNextLevel = currentLevel * 1000; // Simple progression
    const progressToNext = ((user.xp % 1000) / 1000) * 100;
    return { level: currentLevel + 1, progress: progressToNext, xpNeeded: 1000 - (user.xp % 1000) };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  const nextLevel = getNextLevel();

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Fortschritt Dashboard</h1>
        <p className="text-muted-foreground">
          Verfolgen Sie Ihren Lernfortschritt und feiern Sie Ihre Erfolge
        </p>
      </div>

      {/* Level and XP Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <CardHeader className="relative pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Level {user.level}
            </CardTitle>
            <CardDescription>
              Nächstes Level: {nextLevel.level}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{user.xp} XP</span>
                <span>+{nextLevel.xpNeeded} benötigt</span>
              </div>
              <Progress value={nextLevel.progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-blue-500" />
              Wissens-Tokens
            </CardTitle>
            <CardDescription>
              Verfügbare Tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {user.wissensTokens.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-green-500" />
              Abgeschlossene Kurse
            </CardTitle>
            <CardDescription>
              Kurse erfolgreich beendet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {userStats?.totalCoursesCompleted || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="h-5 w-5 text-orange-500" />
              Lernstreak
            </CardTitle>
            <CardDescription>
              Tägliche Aktivität
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-500">
                {getStreakText(userStats?.learningStreak.currentStreak || 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Rekord: {userStats?.learningStreak.longestStreak || 0} Tage
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Rangliste</TabsTrigger>
          <TabsTrigger value="stats">Statistiken</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Wöchentliches Ziel
              </CardTitle>
              <CardDescription>
                Ihr Fortschritt diese Woche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {Math.floor((userStats?.learningStreak.weeklyProgress || 0) / 60)}h {((userStats?.learningStreak.weeklyProgress || 0) % 60)}m
                    von {Math.floor((userStats?.learningStreak.weeklyGoal || 300) / 60)}h {((userStats?.learningStreak.weeklyGoal || 300) % 60)}m
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(((userStats?.learningStreak.weeklyProgress || 0) / (userStats?.learningStreak.weeklyGoal || 300)) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={((userStats?.learningStreak.weeklyProgress || 0) / (userStats?.learningStreak.weeklyGoal || 300)) * 100} 
                  className="h-3"
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  Durchschnitt: {Math.round((userStats?.learningStreak.weeklyProgress || 0) / 7)} Minuten pro Tag
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Neueste Achievements
              </CardTitle>
              <CardDescription>
                Ihre zuletzt freigeschalteten Errungenschaften
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements
                  .filter(achievement => user.unlockedAchievements.includes(achievement.id))
                  .slice(0, 4)
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                      <Badge className={getAchievementRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
                {user.unlockedAchievements.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>Noch keine Achievements freigeschaltet</p>
                    <p className="text-sm">Beginnen Sie mit dem Lernen, um Ihre ersten Erfolge zu erzielen!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Alle Achievements
              </CardTitle>
              <CardDescription>
                {user.unlockedAchievements.length} von {achievements.length} freigeschaltet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const isUnlocked = user.unlockedAchievements.includes(achievement.id);
                  
                  return (
                    <div 
                      key={achievement.id} 
                      className={`p-4 rounded-lg border transition-colors ${
                        isUnlocked 
                          ? 'bg-card border-border' 
                          : 'bg-muted/50 border-muted opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl ${!isUnlocked && 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-medium">{achievement.name}</div>
                            {isUnlocked && <Sparkles className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={getAchievementRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {achievement.reward.xp}
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {achievement.reward.tokens}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                XP Rangliste
              </CardTitle>
              <CardDescription>
                Die Top-Lerner der Plattform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      entry.userId === user.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                      {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                      {index === 2 && <Medal className="h-5 w-5 text-amber-600" />}
                      {index > 2 && <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {entry.userAvatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="font-medium">
                        {entry.userName}
                        {entry.userId === user.id && (
                          <Badge variant="secondary" className="ml-2">Sie</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {Math.floor(entry.score / 1000) + 1}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">{entry.score.toLocaleString()} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lernstatistiken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gesamte Lernzeit</span>
                  <span className="font-semibold">
                    {Math.floor((userStats?.totalTimeSpent || 0) / 60)}h {((userStats?.totalTimeSpent || 0) % 60)}m
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Durchschnittliche Quiz-Punktzahl</span>
                  <span className="font-semibold">{Math.round(userStats?.averageQuizScore || 0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Zertifikate erhalten</span>
                  <span className="font-semibold">{userStats?.certificatesEarned || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gesamte XP</span>
                  <span className="font-semibold">{userStats?.totalXpEarned.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gesammelte Tokens</span>
                  <span className="font-semibold">{userStats?.totalTokensEarned.toLocaleString() || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Social Statistiken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Freunde</span>
                  <span className="font-semibold">{user.friends.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Freigeschaltete Achievements</span>
                  <span className="font-semibold">{user.unlockedAchievements.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Registriert seit</span>
                  <span className="font-semibold">
                    {new Date(user.registeredAt).toLocaleDateString('de-DE')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Zuletzt aktiv</span>
                  <span className="font-semibold">
                    {new Date(user.lastSeen).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}