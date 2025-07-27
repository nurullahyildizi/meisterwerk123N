import { useState, useEffect } from "react";
import { User } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy,
  Star,
  Medal,
  Crown,
  Zap,
  Fire,
  Target,
  BookOpen,
  Users,
  Brain,
  Clock,
  Sparkles,
  Gift,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Lock,
  Unlock
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'streak' | 'special' | 'milestone';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  xpReward: number;
  tokensReward: number;
  requirements: {
    type: 'courses_completed' | 'lessons_completed' | 'quiz_score' | 'streak_days' | 'simulation_time' | 'forum_posts' | 'help_given' | 'study_time';
    target: number;
    current?: number;
  }[];
  unlocked: boolean;
  unlockedAt?: string;
  rarity: number; // 1-100, lower = rarer
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  earned: boolean;
  earnedAt?: string;
  level?: number;
  maxLevel?: number;
}

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar: string;
    level: number;
  };
  score: number;
  change: number; // Position change from last week
  badges: BadgeData[];
}

interface AchievementSystemProps {
  user: User;
}

export default function AchievementSystem({ user }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data für Demonstrationszwecke
  useEffect(() => {
    loadAchievements();
    loadBadges();
    loadLeaderboard();
  }, []);

  const loadAchievements = () => {
    const mockAchievements: Achievement[] = [
      {
        id: 'first_steps',
        title: 'Erste Schritte',
        description: 'Erste Lektion erfolgreich abgeschlossen',
        icon: '🎯',
        category: 'learning',
        tier: 'bronze',
        xpReward: 50,
        tokensReward: 5,
        requirements: [{ type: 'lessons_completed', target: 1, current: 1 }],
        unlocked: true,
        unlockedAt: '2024-01-20',
        rarity: 95
      },
      {
        id: 'quiz_master',
        title: 'Quiz-Meister',
        description: 'Erreiche 100% in einem Quiz',
        icon: '🧠',
        category: 'learning',
        tier: 'silver',
        xpReward: 150,
        tokensReward: 15,
        requirements: [{ type: 'quiz_score', target: 100, current: 87 }],
        unlocked: false,
        rarity: 60
      },
      {
        id: 'simulation_expert',
        title: 'Simulations-Experte',
        description: 'Verbringe 60 Minuten in 3D-Simulationen',
        icon: '⚡',
        category: 'learning',
        tier: 'gold',
        xpReward: 300,
        tokensReward: 25,
        requirements: [{ type: 'simulation_time', target: 60, current: 45 }],
        unlocked: false,
        rarity: 30
      },
      {
        id: 'streak_warrior',
        title: 'Streak-Krieger',
        description: '30 Tage Lernstreak aufrechterhalten',
        icon: '🔥',
        category: 'streak',
        tier: 'platinum',
        xpReward: 500,
        tokensReward: 50,
        requirements: [{ type: 'streak_days', target: 30, current: 7 }],
        unlocked: false,
        rarity: 15
      }
    ];
    setAchievements(mockAchievements);
  };

  const loadBadges = () => {
    const mockBadges: BadgeData[] = [
      {
        id: 'elektrotechnik_rookie',
        name: 'Elektrotechnik Neuling',
        description: 'Erste Schritte in der Elektrotechnik',
        icon: '⚡',
        color: 'bg-blue-500',
        category: 'Fachbereich',
        earned: true,
        earnedAt: '2024-01-20',
        level: 1,
        maxLevel: 5
      }
    ];
    setBadges(mockBadges);
  };

  const loadLeaderboard = () => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        user: { id: 'user1', name: 'Max Mustermann', avatar: 'MM', level: 15 },
        score: 12450,
        change: 0,
        badges: badges.slice(0, 3)
      },
      {
        rank: 4,
        user: { id: user.id, name: user.name, avatar: user.avatar, level: user.level },
        score: user.xp,
        change: 2,
        badges: badges.filter(b => b.earned)
      }
    ];
    setLeaderboard(mockLeaderboard);
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'text-amber-600 bg-amber-50 border-amber-200',
      silver: 'text-gray-600 bg-gray-50 border-gray-200',
      gold: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      platinum: 'text-blue-600 bg-blue-50 border-blue-200',
      diamond: 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors[tier as keyof typeof colors] || colors.bronze;
  };

  const getTierIcon = (tier: string) => {
    const icons = {
      bronze: Medal,
      silver: Medal,
      gold: Trophy,
      platinum: Crown,
      diamond: Crown
    };
    return icons[tier as keyof typeof icons] || Medal;
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const completionPercentage = (unlockedAchievements.length / achievements.length) * 100;

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Erfolge</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Rangliste</TabsTrigger>
          <TabsTrigger value="rewards">Belohnungen</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Erfolgs-Übersicht
              </CardTitle>
              <CardDescription>
                Ihr Fortschritt bei den Achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{unlockedAchievements.length}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Freigeschaltet</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{achievements.length - unlockedAchievements.length}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Noch zu erreichen</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(completionPercentage)}%</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Abgeschlossen</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gesamtfortschritt</span>
                  <span>{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={selectedCategory === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Alle
            </Button>
            <Button 
              variant={selectedCategory === 'learning' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedCategory('learning')}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Lernen
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const TierIcon = getTierIcon(achievement.tier);
              const progress = achievement.requirements[0]?.current || 0;
              const target = achievement.requirements[0]?.target || 1;
              const progressPercentage = Math.min((progress / target) * 100, 100);
              
              return (
                <Card key={achievement.id} className={`relative ${achievement.unlocked ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : 'border-gray-200'}`}>
                  <CardContent className="p-6">
                    <div className="absolute top-3 right-3">
                      {achievement.unlocked ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <TierIcon className="h-3 w-3" />
                            <Badge variant="outline" className={`text-xs ${getTierColor(achievement.tier)}`}>
                              {achievement.tier.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      
                      {!achievement.unlocked && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Fortschritt</span>
                            <span>{progress}/{target}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span>{achievement.xpReward} XP</span>
                          <Gift className="h-3 w-3 text-green-500" />
                          <span>{achievement.tokensReward} Token</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Badge-Sammlung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Sammeln Sie Badges für Ihre Leistungen!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rangliste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry) => (
                  <div key={entry.user.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{entry.user.name}</div>
                      <div className="text-sm text-muted-foreground">Level {entry.user.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Belohnungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Tauschen Sie Ihre Tokens gegen Belohnungen ein!</p>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-green-600">{user.wissensTokens} Token</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}