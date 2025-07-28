import { useState, useEffect } from "react";
import { User, Course, Lesson, Quiz, enrollInCourse } from "@/lib/firebase";
import { getCourseById } from "@/data/courseDatabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoPlayer, { LiveChatPanel } from "@/components/video/VideoPlayer";
import InteractiveVideoPlayer from "@/components/video/InteractiveVideoPlayer";
import Circuit3DSimulator from "@/components/simulation/Circuit3DSimulator";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  Lock,
  ArrowLeft,
  ArrowRight,
  FileText,
  Video,
  HelpCircle,
  Award,
  Download,
  Share,
  Heart,
  MessageSquare,
  Settings,
  Maximize,
  X as XIcon,
  CircuitBoard
} from "lucide-react";


interface CourseViewerProps {
  courseId: string;
  user: User;
  onBack: () => void;
}

export default function CourseViewer({ courseId, user, onBack }: CourseViewerProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    // Load course from database
    const courseData = getCourseById(courseId);
    
    if (!courseData) {
      setLoading(false);
      return;
    }

    setCourse(courseData);
    setCurrentLesson(courseData.lessons[0]);
    setIsEnrolled(user.learningProgress?.[courseId] !== undefined);
    setLoading(false);
  };

  const handleEnroll = async () => {
    try {
      await enrollInCourse(courseId, user.id);
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleNextLesson = () => {
    if (course && currentLessonIndex < course.lessons.length - 1) {
      const nextIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(nextIndex);
      setCurrentLesson(course.lessons[nextIndex]);
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  const handlePreviousLesson = () => {
    if (course && currentLessonIndex > 0) {
      const prevIndex = currentLessonIndex - 1;
      setCurrentLessonIndex(prevIndex);
      setCurrentLesson(course.lessons[prevIndex]);
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const calculateQuizScore = () => {
    if (!currentLesson?.content.quiz) return 0;
    
    let correct = 0;
    let total = 0;
    
    currentLesson.content.quiz.questions.forEach(question => {
      total += question.points;
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct += question.points;
      }
    });
    
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Kurs wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>Kurs nicht gefunden</p>
          <Button onClick={onBack} className="mt-4">Zurück</Button>
        </div>
      </div>
    );
  }

  const completedLessons = course.lessons.filter(lesson => lesson.isCompleted).length;
  const progressPercentage = (completedLessons / course.lessons.length) * 100;

  return (
    <div className="flex h-full bg-background">
      {/* Course Sidebar */}
      <div className="w-80 border-r border-border flex flex-col bg-card">
        {/* Course Header */}
        <div className="p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu Kursen
          </Button>
          
          <h2 className="font-semibold text-sm line-clamp-2 mb-2">{course.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Clock className="h-3 w-3" />
            {Math.floor(course.duration / 60)}h {course.duration % 60}m
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fortschritt</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedLessons} von {course.lessons.length} Lektionen abgeschlossen
            </p>
          </div>
        </div>

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  currentLesson?.id === lesson.id 
                    ? 'bg-primary/10 border-primary/20 border' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setCurrentLesson(lesson);
                  setCurrentLessonIndex(index);
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {lesson.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : currentLesson?.id === lesson.id ? (
                      <Play className="h-4 w-4 text-primary" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {lesson.type === 'video' && <Video className="h-3 w-3 text-muted-foreground" />}
                      {lesson.type === 'text' && <FileText className="h-3 w-3 text-muted-foreground" />}
                      {lesson.type === 'quiz' && <HelpCircle className="h-3 w-3 text-muted-foreground" />}
                      {lesson.type === 'simulation' && <CircuitBoard className="h-3 w-3 text-muted-foreground" />}
                      
                      <span className="text-xs text-muted-foreground">{lesson.duration}min</span>
                    </div>
                    
                    <h4 className="font-medium text-sm line-clamp-2">{lesson.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {lesson.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!isEnrolled ? (
          /* Enrollment Page */
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Course Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {course.instructorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{course.instructorName}</p>
                      <p className="text-sm text-muted-foreground">Kursleiter</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.lessons.length} Lektionen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.enrolledCount.toLocaleString()} Teilnehmer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{course.rating} Bewertung</span>
                    </div>
                  </div>

                  <Button onClick={handleEnroll} className="w-full" size="lg">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Kostenlos einschreiben
                  </Button>
                </div>

                {/* Course Details */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Was Sie lernen werden</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Voraussetzungen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2 flex-wrap">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : currentLesson ? (
          /* Lesson Content */
          <div className="flex-1 flex flex-col">
            {/* Lesson Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{currentLesson.title}</h2>
                  <p className="text-sm text-muted-foreground">{currentLesson.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {currentLesson.type === 'video' && (
                  <div className="space-y-6">
                    <InteractiveVideoPlayer
                      url={currentLesson.content.videoUrl || "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"}
                      title={currentLesson.title}
                      description={currentLesson.description}
                      chapters={[
                        { id: 'ch1', title: 'Einführung', startTime: 0, endTime: 120, description: 'Grundlagen der Elektrotechnik' },
                        { id: 'ch2', title: 'Ohmsche Gesetz', startTime: 120, endTime: 300, description: 'Beziehung zwischen Spannung, Strom und Widerstand' },
                        { id: 'ch3', title: 'Praktische Beispiele', startTime: 300, endTime: 480, description: 'Anwendung in realen Schaltungen' },
                        { id: 'ch4', title: 'Übungsaufgaben', startTime: 480, endTime: 600, description: 'Vertiefung des Gelernten' }
                      ]}
                      annotations={[
                        { id: 'note1', time: 60, type: 'note', title: 'Wichtiger Hinweis', content: 'Die Grundformel U = R × I ist fundamental' },
                        { id: 'quiz1', time: 180, type: 'quiz', title: 'Quiz: Ohmsche Gesetz', content: 'q1' },
                        { id: 'bookmark1', time: 240, type: 'bookmark', title: 'Formeln Übersicht', content: 'Alle wichtigen Formeln zusammengefasst' },
                        { id: 'quiz2', time: 360, type: 'quiz', title: 'Quiz: Widerstand', content: 'q2' }
                      ]}
                      transcript={[
                        { time: 0, text: 'Willkommen zur Lektion über Elektrotechnik. Heute lernen wir die Grundlagen...', speaker: 'Prof. Schmidt' },
                        { time: 30, text: 'Beginnen wir mit der Definition von elektrischem Strom...', speaker: 'Prof. Schmidt' },
                        { time: 60, text: 'Das Ohmsche Gesetz ist eine der wichtigsten Beziehungen in der Elektrotechnik...', speaker: 'Prof. Schmidt' },
                        { time: 120, text: 'Die Formel U = R × I beschreibt den Zusammenhang zwischen Spannung, Widerstand und Strom...', speaker: 'Prof. Schmidt' },
                        { time: 180, text: 'Lassen Sie uns nun einige praktische Beispiele betrachten...', speaker: 'Prof. Schmidt' }
                      ]}
                      onProgress={(progress) => {
                        // Update lesson progress
                        console.log('Video progress:', progress);
                      }}
                      onComplete={() => {
                        // Mark lesson as completed
                        console.log('Video completed');
                      }}
                      onAnnotationAdd={(annotation) => {
                        console.log('New annotation:', annotation);
                      }}
                      onQuizAnswer={(questionId, answer, correct) => {
                        console.log('Quiz answered:', { questionId, answer, correct });
                      }}
                    />
                    {currentLesson.content.textContent && (
                      <div className="prose max-w-none dark:prose-invert">
                        <div className="whitespace-pre-line">{currentLesson.content.textContent}</div>
                      </div>
                    )}
                  </div>
                )}

                {currentLesson.type === 'text' && (
                  <div className="max-w-4xl mx-auto">
                    <div className="prose max-w-none dark:prose-invert">
                      <div className="whitespace-pre-line">{currentLesson.content.textContent}</div>
                    </div>
                  </div>
                )}

                {currentLesson.type === 'quiz' && currentLesson.content.quiz && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{currentLesson.content.quiz.title}</h3>
                      <p className="text-muted-foreground">
                        {currentLesson.content.quiz.questions.length} Fragen • {currentLesson.content.quiz.timeLimit} Minuten
                      </p>
                    </div>

                    {!quizSubmitted ? (
                      <div className="space-y-6">
                        {currentLesson.content.quiz.questions.map((question, index) => (
                          <Card key={question.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Frage {index + 1}: {question.question}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {question.options?.map((option) => (
                                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={question.id}
                                      value={option}
                                      checked={quizAnswers[question.id] === option}
                                      onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                                      className="form-radio"
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        <Button 
                          onClick={handleSubmitQuiz}
                          disabled={Object.keys(quizAnswers).length !== currentLesson.content.quiz.questions.length}
                          className="w-full"
                        >
                          Quiz abschicken
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-center">
                              Quiz-Ergebnis: {calculateQuizScore()}%
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center mb-6">
                              {calculateQuizScore() >= currentLesson.content.quiz.passingScore ? (
                                <div className="text-green-600">
                                  <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                                  <p className="font-medium">Bestanden!</p>
                                </div>
                              ) : (
                                <div className="text-red-600">
                                  <XIcon className="h-12 w-12 mx-auto mb-2" />
                                  <p className="font-medium">Nicht bestanden</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-4">
                              {currentLesson.content.quiz.questions.map((question, index) => {
                                const userAnswer = quizAnswers[question.id];
                                const isCorrect = userAnswer === question.correctAnswer;
                                
                                return (
                                  <div key={question.id} className="border rounded p-4">
                                    <h4 className="font-medium mb-2">
                                      Frage {index + 1}: {question.question}
                                    </h4>
                                    <div className="space-y-2">
                                      <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        Ihre Antwort: {userAnswer}
                                      </p>
                                      {!isCorrect && (
                                        <p className="text-green-600">
                                          Richtige Antwort: {question.correctAnswer}
                                        </p>
                                      )}
                                      {question.explanation && (
                                        <p className="text-sm text-muted-foreground">
                                          {question.explanation}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}

                {currentLesson.type === 'simulation' && (
                  <div className="w-full">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <CircuitBoard className="h-6 w-6 text-primary" />
                        Interaktive 3D-Schaltungssimulation
                      </h3>
                      <p className="text-muted-foreground">
                        Experimentieren Sie mit elektrischen Schaltungen und verstehen Sie die Zusammenhänge zwischen Spannung, Strom und Widerstand.
                      </p>
                    </div>
                    
                    <Circuit3DSimulator 
                      lessonId={currentLesson.id}
                      circuitType={currentLesson.id.includes('parallel') ? 'parallel' : 'series'}
                    />
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Lernziele dieser Simulation:</h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Verstehen Sie das Ohm'sche Gesetz in der Praxis</li>
                        <li>• Beobachten Sie Stromfluss in verschiedenen Schaltungsarten</li>
                        <li>• Experimentieren Sie mit Komponenten-Werten</li>
                        <li>• Analysieren Sie Spannungs- und Stromverteilung</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Vorherige Lektion
                </Button>

                <div className="text-sm text-muted-foreground">
                  {currentLessonIndex + 1} von {course.lessons.length}
                </div>

                <Button
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === course.lessons.length - 1}
                >
                  Nächste Lektion
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}