import { User } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Play,
  Users,
  Award,
  Zap
} from "lucide-react";

interface DashboardHomeProps {
  user: User;
}

export default function DashboardHome({ user }: DashboardHomeProps) {
  // Mock data for demonstration
  const currentCourses = [
    {
      id: 1,
      title: "VDE 0100 - Errichten von Niederspannungsanlagen",
      progress: 65,
      nextLesson: "Schutzmaßnahmen",
      duration: "45 min",
      difficulty: "Fortgeschritten"
    },
    {
      id: 2,
      title: "SPS-Programmierung Grundlagen",
      progress: 30,
      nextLesson: "Digitale Ein- und Ausgänge",
      duration: "30 min",
      difficulty: "Anfänger"
    }
  ];

  const recentAchievements = [
    { title: "Erste Schritte", description: "Ersten Kurs abgeschlossen", icon: "🎯" },
    { title: "Wissbegierig", description: "5 Lektionen an einem Tag", icon: "📚" },
    { title: "Teamplayer", description: "Erste Diskussion im Forum", icon: "💬" }
  ];

  const learningStats = [
    { label: "Abgeschlossene Kurse", value: "12", icon: BookOpen, color: "text-blue-500" },
    { label: "Lernzeit (Std.)", value: "48", icon: Clock, color: "text-green-500" },
    { label: "Aktuelle Serie", value: "7", icon: Target, color: "text-purple-500" },
    { label: "Punkte diese Woche", value: "+156", icon: TrendingUp, color: "text-orange-500" }
  ];

  const xpToNextLevel = 500;
  const currentXp = user.xp % xpToNextLevel;
  const levelProgress = (currentXp / xpToNextLevel) * 100;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Willkommen zurück, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Bereit für Ihre nächste Lerneinheit? Hier ist Ihr persönlicher Fortschritt.
        </p>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Level {user.level} Fortschritt
          </CardTitle>
          <CardDescription>
            {currentXp} / {xpToNextLevel} XP bis Level {user.level + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={levelProgress} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Level {user.level}</span>
            <span>Level {user.level + 1}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {learningStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <div className="text-2xl font-bold mt-2">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Aktuelle Kurse
            </CardTitle>
            <CardDescription>
              Setzen Sie Ihr Lernen fort
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentCourses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium leading-tight">{course.title}</h3>
                  <Badge variant="outline">{course.difficulty}</Badge>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Nächste Lektion: {course.nextLesson}</span>
                  <span>{course.duration}</span>
                </div>
                <Button size="sm" className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Weiter lernen
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Neueste Erfolge
            </CardTitle>
            <CardDescription>
              Ihre jüngsten Meilensteine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Alle Erfolge anzeigen
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellzugriff</CardTitle>
          <CardDescription>
            Häufig verwendete Funktionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              Neue Kurse entdecken
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Community beitreten
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              Lernziele setzen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}