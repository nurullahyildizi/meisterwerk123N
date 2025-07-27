import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Zap, 
  BookOpen, 
  Award, 
  ChevronRight,
  Activity,
  Eye,
  RotateCcw,
  Lightbulb,
  Timer,
  CheckCircle,
  AlertCircle,
  Rocket,
  BarChart3,
  Users,
  Calendar,
  Flame,
  Trophy,
  MessageSquare,
  Play,
  Pause,
  SkipForward,
  Settings,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
}

interface PerformanceData {
  subject: string;
  accuracy: number;
  speed: number;
  retention: number;
  engagement: number;
  difficulty: number;
}

interface AdaptiveRecommendation {
  id: string;
  type: 'content' | 'pace' | 'method' | 'break' | 'review';
  title: string;
  description: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  action: string;
  estimatedTime: number;
}

interface LearningPattern {
  id: string;
  name: string;
  description: string;
  strength: number;
  improvement: string;
  color: string;
}

interface LearningSession {
  id: string;
  subject: string;
  duration: number;
  score: number;
  date: Date;
  topics: string[];
  difficultyCovered: number[];
  struggledWith: string[];
  masteredConcepts: string[];
}

interface PersonalizedContent {
  id: string;
  title: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'exercise';
  difficulty: number;
  estimatedTime: number;
  adaptationReason: string;
  subject: string;
  personalizedFor: string[];
}

export default function AdaptiveLearningSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [learningGoal, setLearningGoal] = useState('balanced');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  // Mock data - would come from AI analysis in real app
  const learningStyle: LearningStyle = {
    visual: 85,
    auditory: 45,
    kinesthetic: 60,
    reading: 70
  };

  const performanceData: PerformanceData[] = [
    { subject: 'Elektrotechnik', accuracy: 78, speed: 82, retention: 74, engagement: 89, difficulty: 6 },
    { subject: 'Mathematik', accuracy: 92, speed: 71, retention: 88, engagement: 76, difficulty: 7 },
    { subject: 'Physik', accuracy: 85, speed: 79, retention: 82, engagement: 84, difficulty: 6 },
    { subject: 'Programmierung', accuracy: 69, speed: 88, retention: 65, engagement: 95, difficulty: 8 }
  ];

  const adaptiveRecommendations: AdaptiveRecommendation[] = [
    {
      id: '1',
      type: 'pace',
      title: 'Verlangsamung bei Mathematik empfohlen',
      description: 'Ihre Lerngeschwindigkeit in Mathematik ist zu hoch für optimale Retention.',
      reason: 'Analyse zeigt 20% niedrigere Retention bei aktueller Geschwindigkeit',
      priority: 'high',
      action: 'Reduziere Lerngeschwindigkeit um 15%',
      estimatedTime: 0
    },
    {
      id: '2',
      type: 'method',
      title: 'Visuelle Lernmethoden verstärken',
      description: 'Ihr Lernstil ist stark visuell geprägt. Nutzen Sie mehr Diagramme und Visualisierungen.',
      reason: 'Ihr visueller Lernstil (85%) wird nur zu 60% ausgenutzt',
      priority: 'medium',
      action: 'Wechseln zu visuellen Inhalten',
      estimatedTime: 0
    },
    {
      id: '3',
      type: 'break',
      title: 'Pause empfohlen',
      description: 'Ihre Konzentration ist in den letzten 45 Minuten um 23% gesunken.',
      reason: 'Optionale Produktivität bei kontinuierlichem Lernen',
      priority: 'medium',
      action: '10-15 Minuten Pause einlegen',
      estimatedTime: 10
    },
    {
      id: '4',
      type: 'review',
      title: 'Wiederholung von Grundlagen nötig',
      description: 'In Programmierung zeigen sich Wissenslücken bei Grundkonzepten.',
      reason: 'Fehleranalyse zeigt 67% der Fehler auf Grundlagenproblemen',
      priority: 'high',
      action: 'Grundlagen-Wiederholung',
      estimatedTime: 30
    },
    {
      id: '5',
      type: 'content',
      title: 'Schwierigkeitsgrad anpassen',
      description: 'Der aktuelle Schwierigkeitsgrad in Physik ist zu niedrig für Sie.',
      reason: '95% Erfolgsrate deutet auf zu niedrige Herausforderung hin',
      priority: 'low',
      action: 'Schwierigkeitsgrad erhöhen',
      estimatedTime: 0
    }
  ];

  const learningPatterns: LearningPattern[] = [
    {
      id: '1',
      name: 'Morgenlerner',
      description: 'Höchste Produktivität zwischen 8-11 Uhr',
      strength: 92,
      improvement: 'Nutzen Sie diese Zeit für schwierige Themen',
      color: 'bg-yellow-500'
    },
    {
      id: '2',
      name: 'Visueller Typ',
      description: 'Lernt am besten mit Bildern und Diagrammen',
      strength: 85,
      improvement: 'Mehr interaktive Visualisierungen verwenden',
      color: 'bg-blue-500'
    },
    {
      id: '3',
      name: 'Progressiver Lerner',
      description: 'Braucht schrittweise Steigerung der Komplexität',
      strength: 78,
      improvement: 'Adaptive Schwierigkeitsanpassung aktiviert',
      color: 'bg-green-500'
    },
    {
      id: '4',
      name: 'Sozialer Lerner',
      description: 'Profitiert von Gruppenarbeit und Diskussionen',
      strength: 71,
      improvement: 'Studiengruppen und Peer-Learning empfohlen',
      color: 'bg-purple-500'
    }
  ];

  const recentSessions: LearningSession[] = [
    {
      id: '1',
      subject: 'Elektrotechnik',
      duration: 45,
      score: 78,
      date: new Date('2024-01-14T09:00:00'),
      topics: ['Ohmsches Gesetz', 'Widerstandsschaltungen'],
      difficultyCovered: [3, 4, 5],
      struggledWith: ['Komplexe Schaltungen'],
      masteredConcepts: ['Grundlagen', 'Einfache Schaltungen']
    },
    {
      id: '2',
      subject: 'Mathematik',
      duration: 60,
      score: 92,
      date: new Date('2024-01-14T14:30:00'),
      topics: ['Integralrechnung', 'Substitution'],
      difficultyCovered: [6, 7, 8],
      struggledWith: [],
      masteredConcepts: ['Grundintegrale', 'Partielle Integration']
    },
    {
      id: '3',
      subject: 'Programmierung',
      duration: 75,
      score: 65,
      date: new Date('2024-01-13T16:00:00'),
      topics: ['Datenstrukturen', 'Binary Trees'],
      difficultyCovered: [7, 8, 9],
      struggledWith: ['Tree Traversal', 'Balancing'],
      masteredConcepts: ['Tree Creation']
    }
  ];

  const personalizedContent: PersonalizedContent[] = [
    {
      id: '1',
      title: 'Visuelle Schaltungsanalyse',
      type: 'interactive',
      difficulty: 6,
      estimatedTime: 25,
      adaptationReason: 'Angepasst an Ihren visuellen Lernstil',
      subject: 'Elektrotechnik',
      personalizedFor: ['Visueller Lerntyp', 'Mittlere Schwierigkeit']
    },
    {
      id: '2',
      title: 'Mathematik Grundlagen Auffrischung',
      type: 'video',
      difficulty: 4,
      estimatedTime: 15,
      adaptationReason: 'Basierend auf erkannten Wissenslücken',
      subject: 'Mathematik',
      personalizedFor: ['Grundlagen stärken', 'Schnelles Lerntempo']
    },
    {
      id: '3',
      title: 'Interaktive Programmier-Übungen',
      type: 'exercise',
      difficulty: 5,
      estimatedTime: 35,
      adaptationReason: 'Reduzierte Schwierigkeit für besseres Verständnis',
      subject: 'Programmierung',
      personalizedFor: ['Kinästhetischer Ansatz', 'Schritt-für-Schritt']
    }
  ];

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          Adaptives Lernsystem
        </h1>
        <p className="text-muted-foreground">
          KI-gesteuerte Personalisierung für optimale Lernerfolge
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Übersicht</TabsTrigger>
          <TabsTrigger value="recommendations">Empfehlungen</TabsTrigger>
          <TabsTrigger value="patterns">Lernmuster</TabsTrigger>
          <TabsTrigger value="content">Personalisiert</TabsTrigger>
          <TabsTrigger value="analytics">Analysen</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Learning Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Lernziel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <select
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="speed">Geschwindigkeit</option>
                    <option value="accuracy">Genauigkeit</option>
                    <option value="balanced">Ausgewogen</option>
                    <option value="retention">Langzeitgedächtnis</option>
                  </select>
                  <p className="text-sm text-muted-foreground">
                    KI passt Inhalte automatisch an Ihr Lernziel an
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Heutige Aktivität
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Lernzeit</span>
                    <span className="font-semibold">2h 15min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Abgeschlossen</span>
                    <span className="font-semibold">7/10 Lektionen</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Durchschnitt</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Lernstreak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500">14</div>
                    <p className="text-sm text-muted-foreground">Tage in Folge</p>
                  </div>
                  <Progress value={70} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    Noch 6 Tage bis zum nächsten Meilenstein
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Style Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Ihr Lernstil-Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(learningStyle).map(([style, value]) => (
                  <div key={style} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          className="text-muted"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={`${value * 2.83} 283`}
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold">{value}%</span>
                      </div>
                    </div>
                    <h4 className="font-medium capitalize">{style}</h4>
                    <p className="text-xs text-muted-foreground">
                      {style === 'visual' ? 'Bilder & Diagramme' :
                       style === 'auditory' ? 'Audio & Diskussion' :
                       style === 'kinesthetic' ? 'Praktisch & Haptisch' :
                       'Text & Schrift'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Fach-Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((data) => (
                  <div key={data.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{data.subject}</h4>
                      <div className="flex gap-4 text-sm">
                        <span className={getPerformanceColor(data.accuracy)}>
                          {data.accuracy}% Genauigkeit
                        </span>
                        <span className={getPerformanceColor(data.retention)}>
                          {data.retention}% Retention
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Genauigkeit</div>
                        <Progress value={data.accuracy} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Geschwindigkeit</div>
                        <Progress value={data.speed} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Retention</div>
                        <Progress value={data.retention} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Engagement</div>
                        <Progress value={data.engagement} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">KI-Empfehlungen</h2>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Neu analysieren
            </Button>
          </div>

          <div className="space-y-4">
            {adaptiveRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className={`border-l-4 ${getPriorityColor(recommendation.priority)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {recommendation.type === 'content' && <BookOpen className="h-5 w-5" />}
                        {recommendation.type === 'pace' && <Timer className="h-5 w-5" />}
                        {recommendation.type === 'method' && <Lightbulb className="h-5 w-5" />}
                        {recommendation.type === 'break' && <Clock className="h-5 w-5" />}
                        {recommendation.type === 'review' && <RotateCcw className="h-5 w-5" />}
                        {recommendation.title}
                      </CardTitle>
                      <Badge variant={
                        recommendation.priority === 'high' ? 'destructive' :
                        recommendation.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {recommendation.priority === 'high' ? 'Hohe Priorität' :
                         recommendation.priority === 'medium' ? 'Mittlere Priorität' : 'Niedrige Priorität'}
                      </Badge>
                    </div>
                    {recommendation.estimatedTime > 0 && (
                      <div className="text-sm text-muted-foreground">
                        ~{recommendation.estimatedTime} Min
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{recommendation.description}</p>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">KI-Analyse:</p>
                    <p className="text-sm">{recommendation.reason}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Empfohlene Aktion:</span>
                    <Button size="sm">
                      {recommendation.action}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Ihre Lernmuster</h2>
            <p className="text-muted-foreground">
              KI-erkannte Muster in Ihrem Lernverhalten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPatterns.map((pattern) => (
              <Card key={pattern.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-2 h-full ${pattern.color}`} />
                <CardHeader className="pl-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pattern.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{pattern.strength}%</div>
                      <div className="text-sm text-muted-foreground">Stärke</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pl-8 space-y-4">
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  <Progress value={pattern.strength} className="h-2" />
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Verbesserungsvorschlag</p>
                        <p className="text-sm text-blue-700">{pattern.improvement}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Learning Time Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Optimale Lernzeiten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium mb-2">{day}</div>
                    <div className="space-y-1">
                      {[8, 10, 12, 14, 16, 18, 20].map((hour) => (
                        <div 
                          key={hour}
                          className={`h-3 rounded ${
                            (index < 5 && hour >= 8 && hour <= 11) || 
                            (index >= 5 && hour >= 14 && hour <= 17)
                              ? 'bg-green-400' 
                              : hour >= 12 && hour <= 15
                              ? 'bg-yellow-400'
                              : 'bg-gray-200'
                          }`}
                          title={`${hour}:00`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded" />
                  <span>Optimal (92% Performance)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded" />
                  <span>Gut (75% Performance)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded" />
                  <span>Niedrig (&lt; 65% Performance)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Personalisierte Inhalte</h2>
            <p className="text-muted-foreground">
              Speziell für Ihren Lernstil und Fortschritt angepasst
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalizedContent.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {content.type === 'video' && <Play className="h-5 w-5 text-primary" />}
                      {content.type === 'text' && <BookOpen className="h-5 w-5 text-primary" />}
                      {content.type === 'interactive' && <Zap className="h-5 w-5 text-primary" />}
                      {content.type === 'quiz' && <CheckCircle className="h-5 w-5 text-primary" />}
                      {content.type === 'exercise' && <Target className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{content.subject}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Level {content.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{content.estimatedTime} Min</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Anpassungsgrund:</p>
                    <p className="text-sm text-muted-foreground">{content.adaptationReason}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {content.personalizedFor.map((reason) => (
                      <Badge key={reason} variant="secondary" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Starten
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Detaillierte Analysen</h2>
            <p className="text-muted-foreground">
              Tiefere Einblicke in Ihr Lernverhalten und Ihre Fortschritte
            </p>
          </div>

          {/* Recent Learning Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Letzte Lernsessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{session.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(session.date)} • {session.duration} Minuten
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getPerformanceColor(session.score)}`}>
                          {session.score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Behandelte Themen:</p>
                        <div className="flex flex-wrap gap-1">
                          {session.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Gemeistert:</p>
                        <div className="space-y-1">
                          {session.masteredConcepts.map((concept) => (
                            <div key={concept} className="flex items-center gap-1 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-green-700">{concept}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Schwierigkeiten:</p>
                        <div className="space-y-1">
                          {session.struggledWith.map((struggle) => (
                            <div key={struggle} className="flex items-center gap-1 text-xs">
                              <AlertCircle className="h-3 w-3 text-orange-500" />
                              <span className="text-orange-700">{struggle}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span>Schwierigkeitsbereich: Level {Math.min(...session.difficultyCovered)} - {Math.max(...session.difficultyCovered)}</span>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Wiederholen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Adaptive Learning Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lernfortschritt-Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Diese Woche</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      <span className="font-semibold">+12%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Durchschnittliche Genauigkeit</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      <span className="font-semibold">81%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lerngeschwindigkeit</span>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Minus className="h-4 w-4" />
                      <span className="font-semibold">Stabil</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retention Rate</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      <span className="font-semibold">+8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  KI-Anpassungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Schwierigkeitsanpassungen</span>
                      <span className="text-sm font-medium">23 diese Woche</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Inhaltsempfehlungen</span>
                      <span className="text-sm font-medium">89% Akzeptanzrate</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Timing-Optimierungen</span>
                      <span className="text-sm font-medium">16 Anpassungen</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}