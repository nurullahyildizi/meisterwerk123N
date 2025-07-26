import { useState } from "react";
import { User } from "@/lib/firebase";
import CourseViewer from "@/components/course/CourseViewer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Search,
  Filter,
  Play,
  Lock,
  CheckCircle,
  Zap
} from "lucide-react";

interface LearningPathsProps {
  user: User;
}

// Mock data for learning paths
const learningPaths = [
  {
    id: 1,
    title: "Elektroniker für Energie- und Gebäudetechnik",
    description: "Grundausbildung mit allen wichtigen Bereichen der Elektrotechnik",
    category: "Ausbildung",
    difficulty: "Anfänger",
    duration: "36 Monate",
    modules: 24,
    enrolled: 1250,
    rating: 4.8,
    progress: 45,
    status: "enrolled",
    isPro: false,
    image: "⚡"
  },
  {
    id: 2,
    title: "Meister Vorbereitung Teil 1-4",
    description: "Umfassende Vorbereitung auf die Meisterprüfung",
    category: "Meister",
    difficulty: "Fortgeschritten", 
    duration: "12 Monate",
    modules: 18,
    enrolled: 450,
    rating: 4.9,
    progress: 0,
    status: "available",
    isPro: true,
    image: "🎯"
  },
  {
    id: 3,
    title: "SPS-Programmierung Spezialist",
    description: "Vertiefte Kenntnisse in der SPS-Programmierung",
    category: "Weiterbildung",
    difficulty: "Fortgeschritten",
    duration: "6 Monate", 
    modules: 12,
    enrolled: 890,
    rating: 4.7,
    progress: 0,
    status: "available",
    isPro: false,
    image: "🔧"
  },
  {
    id: 4,
    title: "Betriebselektriker Grundlagen",
    description: "Praktische Kenntnisse für den industriellen Alltag",
    category: "Weiterbildung",
    difficulty: "Anfänger",
    duration: "3 Monate",
    modules: 8,
    enrolled: 670,
    rating: 4.6,
    progress: 100,
    status: "completed",
    isPro: false,
    image: "⚙️"
  },
  {
    id: 5,
    title: "Erneuerbare Energien Techniker",
    description: "Zukunftstechnologien in der Energietechnik",
    category: "Spezialisierung",
    difficulty: "Fortgeschritten",
    duration: "9 Monate",
    modules: 15,
    enrolled: 320,
    rating: 4.8,
    progress: 0,
    status: "available",
    isPro: true,
    image: "🌱"
  },
  {
    id: 6,
    title: "Digitale Messtechnik",
    description: "Moderne Messverfahren und -geräte",
    category: "Technik",
    difficulty: "Mittel",
    duration: "4 Monate",
    modules: 10,
    enrolled: 540,
    rating: 4.5,
    progress: 20,
    status: "enrolled", 
    isPro: false,
    image: "📊"
  }
];

export default function LearningPaths({ user }: LearningPathsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
  };

  // Show CourseViewer if a course is selected
  if (selectedCourseId) {
    return (
      <CourseViewer 
        courseId={selectedCourseId}
        user={user}
        onBack={handleBackToCourses}
      />
    );
  }

  const getStatusIcon = (status: string, progress: number) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "enrolled":
        return progress > 0 ? <Play className="h-4 w-4 text-blue-500" /> : <BookOpen className="h-4 w-4 text-blue-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "enrolled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string, progress: number) => {
    switch (status) {
      case "completed":
        return "Abgeschlossen";
      case "enrolled":
        return progress > 0 ? `${progress}% abgeschlossen` : "Eingeschrieben";
      default:
        return "Verfügbar";
    }
  };

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "enrolled":
        return matchesSearch && path.status === "enrolled";
      case "completed":
        return matchesSearch && path.status === "completed";
      case "available":
        return matchesSearch && path.status === "available";
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lernpfade</h1>
        <p className="text-muted-foreground">
          Entdecken Sie strukturierte Lernwege für Ihre berufliche Entwicklung
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Lernpfade durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Alle ({learningPaths.length})</TabsTrigger>
          <TabsTrigger value="enrolled">
            Aktiv ({learningPaths.filter(p => p.status === "enrolled").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Abgeschlossen ({learningPaths.filter(p => p.status === "completed").length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Verfügbar ({learningPaths.filter(p => p.status === "available").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <Card 
                key={path.id} 
                className="relative group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleOpenCourse(path.id.toString())}
              >
                {path.isPro && user.subscriptionStatus !== "pro" && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl mb-2">{path.image}</div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(path.status, path.progress)}
                    </div>
                  </div>
                  
                  <CardTitle className="line-clamp-2">{path.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {path.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress for enrolled courses */}
                  {path.status === "enrolled" && path.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fortschritt</span>
                        <span>{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  )}

                  {/* Course Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {path.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {path.modules} Module
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {path.enrolled.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {path.rating}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{path.category}</Badge>
                    <Badge variant="outline">{path.difficulty}</Badge>
                  </div>

                  {/* Status Badge */}
                  <Badge className={getStatusColor(path.status)}>
                    {getStatusText(path.status, path.progress)}
                  </Badge>

                  {/* Action Button */}
                  <div className="pt-2">
                    {path.isPro && user.subscriptionStatus !== "pro" ? (
                      <Button className="w-full" variant="outline" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Pro Upgrade erforderlich
                      </Button>
                    ) : path.status === "completed" ? (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCourse(path.id.toString());
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Wiederholen
                      </Button>
                    ) : path.status === "enrolled" ? (
                      <Button 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCourse(path.id.toString());
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Weiter lernen
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCourse(path.id.toString());
                        }}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Einschreiben
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPaths.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Keine Lernpfade gefunden</h3>
              <p className="text-muted-foreground">
                Versuchen Sie eine andere Suche oder wählen Sie eine andere Kategorie.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}