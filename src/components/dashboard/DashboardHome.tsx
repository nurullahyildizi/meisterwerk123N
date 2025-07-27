import { User } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Play,
  Users,
  Award,
  Zap,
  Brain,
  BarChart3,
  Lightbulb,
  Timer,
  Calendar,
  Flame,
  Trophy,
  Star,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

interface DashboardHomeProps {
  user: User;
}

export default function DashboardHome({ user }: DashboardHomeProps) {
  // Enhanced mock data with AI-driven insights
  const currentCourses = [
    {
      id: 1,
      title: "VDE 0100 - Errichten von Niederspannungsanlagen",
      progress: 65,
      nextLesson: "Schutzmaßnahmen",
      duration: "45 min",
      difficulty: "Fortgeschritten",
      aiRecommendation: "Basierend auf Ihrem Fortschritt empfehlen wir eine Wiederholung der Grundlagen",
      optimalTime: "14:00 - 15:00",
      successProbability: 89
    },
    {
      id: 2,
      title: "SPS-Programmierung Grundlagen",
      progress: 30,
      nextLesson: "Digitale Ein- und Ausgänge",
      duration: "30 min",
      difficulty: "Anfänger",
      aiRecommendation: "Perfekte Zeit für praktische Übungen",
      optimalTime: "10:00 - 11:00",
      successProbability: 95
    }
  ];

  // Advanced learning analytics data
  const weeklyProgress = [
    { day: 'Mo', minutes: 45, courses: 2, xp: 120 },
    { day: 'Di', minutes: 60, courses: 3, xp: 180 },
    { day: 'Mi', minutes: 30, courses: 1, xp: 90 },
    { day: 'Do', minutes: 75, courses: 4, xp: 210 },
    { day: 'Fr', minutes: 50, courses: 2, xp: 150 },
    { day: 'Sa', minutes: 90, courses: 5, xp: 270 },
    { day: 'So', minutes: 40, courses: 2, xp: 110 }
  ];

  const learningPattern = [
    { time: '08:00', focus: 85, retention: 78 },
    { time: '10:00', focus: 92, retention: 88 },
    { time: '12:00', focus: 75, retention: 70 },
    { time: '14:00', focus: 95, retention: 92 },
    { time: '16:00', focus: 88, retention: 85 },
    { time: '18:00', focus: 70, retention: 65 },
    { time: '20:00', focus: 60, retention: 55 }
  ];

  const skillDistribution = [
    { name: 'Elektrotechnik', value: 85, color: '#3b82f6' },
    { name: 'SPS-Programmierung', value: 65, color: '#10b981' },
    { name: 'Photovoltaik', value: 45, color: '#f59e0b' },
    { name: 'Automatisierung', value: 55, color: '#8b5cf6' }
  ];

  const aiRecommendations = [
    {
      type: "course",
      title: "VDE 0100 Vertiefung",
      reason: "Ihre Erfolgsrate bei Elektrotechnik-Themen liegt bei 94%",
      confidence: 0.92,
      estimatedTime: "2.5 Stunden",
      difficulty: "Fortgeschritten"
    },
    {
      type: "review",
      title: "SPS Grundlagen wiederholen",
      reason: "KI-Analyse zeigt Wissenslücken in digitalen Schaltungen",
      confidence: 0.87,
      estimatedTime: "45 Minuten",
      difficulty: "Auffrischung"
    },
    {
      type: "practice",
      title: "Interaktive Simulation starten",
      reason: "Praktische Übungen verbessern Ihr Verständnis um 67%",
      confidence: 0.95,
      estimatedTime: "1 Stunde",
      difficulty: "Praktisch"
    }
  ];

  const recentAchievements = [
    { title: "KI-Lernpartner", description: "Erste KI-Empfehlung befolgt", icon: "🤖", new: true },
    { title: "Perfekte Woche", description: "7 Tage Lernstreak erreicht", icon: "🔥", new: true },
    { title: "Wissbegierig", description: "5 Lektionen an einem Tag", icon: "📚", new: false },
    { title: "Mentor", description: "Erstes Mal einem Kollegen geholfen", icon: "🎓", new: true }
  ];

  const learningStats = [
    { label: "Abgeschlossene Kurse", value: "12", change: "+2", icon: BookOpen, color: "text-blue-500" },
    { label: "Lernzeit (Std.)", value: "48.2", change: "+5.2", icon: Clock, color: "text-green-500" },
    { label: "KI-Erfolgsrate", value: "94%", change: "+8%", icon: Brain, color: "text-purple-500" },
    { label: "Lernstreak", value: "7", change: "+7", icon: Flame, color: "text-orange-500" }
  ];

  const xpToNextLevel = 500;
  const currentXp = user.xp % xpToNextLevel;
  const levelProgress = (currentXp / xpToNextLevel) * 100;

  // AI-driven learning insights
  const learningInsights = {
    optimalLearningTime: "14:00 - 15:00",
    focusScore: 92,
    retentionRate: 88,
    weeklyImprovement: 15,
    nextMilestone: "Elektrotechnik-Experte",
    milestoneProgress: 78
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Welcome Section with AI Insights */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Willkommen zurück, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            KI-Analyse zeigt: Ihre optimale Lernzeit ist <span className="font-semibold text-primary">{learningInsights.optimalLearningTime}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{learningInsights.focusScore}%</div>
            <div className="text-sm text-muted-foreground">Fokus-Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{learningInsights.retentionRate}%</div>
            <div className="text-sm text-muted-foreground">Merkfähigkeit</div>
          </div>
        </div>
      </div>

      {/* Enhanced Level Progress with AI Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Level {user.level} Fortschritt
              <Badge variant="secondary" className="ml-auto">KI-optimiert</Badge>
            </CardTitle>
            <CardDescription>
              {currentXp} / {xpToNextLevel} XP bis Level {user.level + 1} • Nächster Meilenstein: {learningInsights.nextMilestone}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={levelProgress} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Level {user.level}</span>
              <span className="font-medium">Geschätzte Zeit bis Level {user.level + 1}: 3-4 Tage</span>
              <span>Level {user.level + 1}</span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Meilenstein-Fortschritt</span>
                <span className="text-sm text-muted-foreground">{learningInsights.milestoneProgress}%</span>
              </div>
              <Progress value={learningInsights.milestoneProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              KI-Einblicke
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Wöchentliche Verbesserung</span>
              <span className="font-bold text-green-600">+{learningInsights.weeklyImprovement}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Lerneffizienz</span>
              <span className="font-bold text-blue-600">{learningInsights.focusScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Erfolgswahrscheinlichkeit</span>
              <span className="font-bold text-purple-600">94%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Stats Grid with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {learningStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mt-3">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">Diese Woche</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="analytics">Analysen</TabsTrigger>
          <TabsTrigger value="ai-recommendations">KI-Empfehlungen</TabsTrigger>
          <TabsTrigger value="achievements">Erfolge</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Current Courses */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Aktuelle Kurse
                  <Badge variant="secondary" className="ml-auto">KI-optimiert</Badge>
                </CardTitle>
                <CardDescription>
                  Personalisierte Lernpfade basierend auf Ihren Stärken
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCourses.map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium leading-tight">{course.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{course.difficulty}</Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {course.successProbability}% Erfolg
                        </Badge>
                      </div>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">KI-Empfehlung</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{course.aiRecommendation}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-blue-500">
                        <span>Optimale Zeit: {course.optimalTime}</span>
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Weiter lernen
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions & Achievements */}
            <div className="space-y-6">
              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Neueste Erfolge
                    <Badge variant="destructive" className="text-xs">Neu!</Badge>
                  </CardTitle>
                  <CardDescription>
                    Ihre jüngsten Meilensteine und Verbesserungen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAchievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{achievement.title}</h4>
                          {achievement.new && <Sparkles className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Trophy className="h-4 w-4 mr-2" />
                    Alle Erfolge anzeigen
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Schnellzugriff</CardTitle>
                  <CardDescription>
                    Häufig verwendete Funktionen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="h-16 flex-col justify-center hover:bg-primary/5">
                      <BookOpen className="h-5 w-5 mb-1" />
                      <span className="text-sm">Neue Kurse entdecken</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col justify-center hover:bg-primary/5">
                      <Users className="h-5 w-5 mb-1" />
                      <span className="text-sm">Community beitreten</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col justify-center hover:bg-primary/5">
                      <Target className="h-5 w-5 mb-1" />
                      <span className="text-sm">Lernziele setzen</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Wöchentlicher Fortschritt
                </CardTitle>
                <CardDescription>Ihre Lernaktivität der letzten Woche</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="minutes" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="xp" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Learning Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Optimale Lernzeiten
                </CardTitle>
                <CardDescription>KI-Analyse Ihrer Leistungsfähigkeit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={learningPattern}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={3} />
                    <Line type="monotone" dataKey="retention" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skill Distribution */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Kompetenzverteilung
                </CardTitle>
                <CardDescription>Ihre aktuellen Fähigkeiten und Entwicklungsbereiche</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={skillDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {skillDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    {skillDistribution.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.value}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2" style={{['--progress-background' as any]: skill.color}} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                KI-gestützte Lernempfehlungen
                <Badge variant="secondary">Powered by AI</Badge>
              </CardTitle>
              <CardDescription>
                Personalisierte Vorschläge basierend auf Ihrem Lernverhalten und Ihren Zielen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {rec.type === 'course' && <BookOpen className="h-4 w-4 text-blue-500" />}
                        {rec.type === 'review' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        {rec.type === 'practice' && <Target className="h-4 w-4 text-green-500" />}
                        <h3 className="font-medium">{rec.title}</h3>
                        <Badge variant="outline">{rec.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Geschätzte Zeit: {rec.estimatedTime}</span>
                        <span>KI-Vertrauen: {Math.round(rec.confidence * 100)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{Math.round(rec.confidence * 100)}%</div>
                      <div className="text-xs text-muted-foreground">Erfolg</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Empfehlung befolgen
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAchievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="font-bold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  {achievement.new && (
                    <Badge variant="destructive" className="mb-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Neu erhalten!
                    </Badge>
                  )}
                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Details anzeigen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}