import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Brain, 
  Zap,
  Award,
  Calendar,
  Eye,
  Star,
  Flame,
  Trophy,
  Users,
  BookOpen,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const learningStats = {
    totalHours: 156.5,
    averageDaily: 2.3,
    streakDays: 14,
    completionRate: 87,
    masteryConcepts: 145,
    weakAreas: ['Komplexe Schaltungen', 'Differentialgleichungen'],
    strongAreas: ['Grundlagen', 'Ohmsche Gesetz', 'Kirchhoff-Gesetze']
  };

  const subjectPerformance = [
    { subject: 'Elektrotechnik', progress: 92, trend: 'up', change: 8 },
    { subject: 'Mathematik', progress: 88, trend: 'up', change: 12 },
    { subject: 'Physik', progress: 84, trend: 'stable', change: 0 },
    { subject: 'Programmierung', progress: 76, trend: 'up', change: 15 },
    { subject: 'Mechanik', progress: 68, trend: 'down', change: -3 }
  ];

  const weeklyActivity = [
    { day: 'Mo', hours: 3.2, efficiency: 85 },
    { day: 'Di', hours: 2.8, efficiency: 92 },
    { day: 'Mi', hours: 4.1, efficiency: 78 },
    { day: 'Do', hours: 2.4, efficiency: 89 },
    { day: 'Fr', hours: 3.6, efficiency: 94 },
    { day: 'Sa', hours: 1.9, efficiency: 82 },
    { day: 'So', hours: 2.1, efficiency: 88 }
  ];

  const achievements = [
    { id: 1, title: 'Wissensmeister', description: '100 Konzepte gemeistert', date: '2024-01-10', rarity: 'legendary' },
    { id: 2, title: 'Streak Champion', description: '30 Tage am Stück gelernt', date: '2024-01-08', rarity: 'epic' },
    { id: 3, title: 'Community Helper', description: '50 Fragen beantwortet', date: '2024-01-05', rarity: 'rare' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'epic': return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'rare': return 'bg-gradient-to-r from-green-500 to-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Erweiterte Lernanalysen
        </h1>
        <p className="text-muted-foreground">
          Detaillierte Einblicke in Ihren Lernfortschritt und Ihre Entwicklung
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                timeRange === range 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range === '7d' ? '7 Tage' : 
               range === '30d' ? '30 Tage' : 
               range === '90d' ? '3 Monate' : '1 Jahr'}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="performance">Leistung</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="achievements">Erfolge</TabsTrigger>
          <TabsTrigger value="insights">Einblicke</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lernzeit gesamt</p>
                    <p className="text-2xl font-bold">{learningStats.totalHours}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Täglicher Schnitt</p>
                    <p className="text-2xl font-bold">{learningStats.averageDaily}h</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lernstreak</p>
                    <p className="text-2xl font-bold">{learningStats.streakDays} Tage</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Abschlussrate</p>
                    <p className="text-2xl font-bold">{learningStats.completionRate}%</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Wöchentliche Aktivität
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {weeklyActivity.map((day) => (
                  <div key={day.day} className="text-center">
                    <div className="text-sm font-medium mb-2">{day.day}</div>
                    <div className="bg-muted rounded-lg p-3 space-y-2">
                      <div className="text-lg font-bold">{day.hours}h</div>
                      <Progress value={day.efficiency} className="h-2" />
                      <div className="text-xs text-muted-foreground">{day.efficiency}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Fachbereich-Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject.subject}</span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(subject.trend)}
                        <span className="text-sm text-muted-foreground">
                          {subject.change > 0 ? '+' : ''}{subject.change}%
                        </span>
                        <span className="font-bold">{subject.progress}%</span>
                      </div>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${getRarityColor(achievement.rarity)}`} />
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${getRarityColor(achievement.rarity)} flex items-center justify-center`}>
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant={
                        achievement.rarity === 'legendary' ? 'destructive' :
                        achievement.rarity === 'epic' ? 'default' : 'secondary'
                      }>
                        {achievement.rarity === 'legendary' ? 'Legendär' :
                         achievement.rarity === 'epic' ? 'Episch' : 'Selten'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(achievement.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other tabs would be implemented similarly */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <PieChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Detaillierte Performance-Analyse</h3>
              <p className="text-muted-foreground">
                Hier werden erweiterte Performance-Metriken und Vergleiche angezeigt.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <LineChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Lerntrends & Prognosen</h3>
              <p className="text-muted-foreground">
                Hier werden Lerntrends und KI-basierte Prognosen dargestellt.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">KI-Einblicke & Empfehlungen</h3>
              <p className="text-muted-foreground">
                Hier werden personalisierte Einblicke und Verbesserungsvorschläge angezeigt.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}