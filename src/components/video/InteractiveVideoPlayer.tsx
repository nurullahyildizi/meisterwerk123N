import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  SkipBack, 
  SkipForward,
  Bookmark,
  BookmarkPlus,
  StickyNote,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  XCircle,
  Edit3,
  Search,
  List,
  Clock,
  Target,
  Trophy,
  Star,
  Download,
  Share,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Plus
} from 'lucide-react';

interface VideoAnnotation {
  id: string;
  time: number;
  type: 'note' | 'quiz' | 'bookmark' | 'highlight';
  title: string;
  content: string;
  color?: string;
  completed?: boolean;
}

interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnail?: string;
  description?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation?: string;
}

interface VideoTranscript {
  time: number;
  text: string;
  speaker?: string;
}

interface InteractiveVideoPlayerProps {
  url: string;
  title: string;
  description?: string;
  chapters?: VideoChapter[];
  annotations?: VideoAnnotation[];
  transcript?: VideoTranscript[];
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onAnnotationAdd?: (annotation: VideoAnnotation) => void;
  onQuizAnswer?: (questionId: string, answer: number, correct: boolean) => void;
  autoPlay?: boolean;
  startTime?: number;
  className?: string;
}

export default function InteractiveVideoPlayer({
  url,
  title,
  description,
  chapters = [],
  annotations = [],
  transcript = [],
  onProgress,
  onComplete,
  onAnnotationAdd,
  onQuizAnswer,
  autoPlay = false,
  startTime = 0,
  className = ""
}: InteractiveVideoPlayerProps) {
  // Video state
  const [playing, setPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffering, setBuffering] = useState(false);

  // Interactive features state
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('chapters');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [currentAnnotations, setCurrentAnnotations] = useState<VideoAnnotation[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: number}>({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [bookmarks, setBookmarks] = useState<VideoAnnotation[]>([]);
  const [notes, setNotes] = useState<VideoAnnotation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sample quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'Was ist das Ohmsche Gesetz?',
      answers: ['U = R × I', 'P = U × I', 'I = U / R', 'Alle Antworten sind korrekt'],
      correctAnswer: 0,
      explanation: 'Das Ohmsche Gesetz besagt, dass die Spannung gleich dem Widerstand mal dem Strom ist (U = R × I).'
    },
    {
      id: 'q2', 
      question: 'Welche Einheit hat der elektrische Widerstand?',
      answers: ['Ampere', 'Volt', 'Ohm', 'Watt'],
      correctAnswer: 2,
      explanation: 'Der elektrische Widerstand wird in Ohm (Ω) gemessen.'
    }
  ];

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [playing]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  // Check for annotations at current time
  useEffect(() => {
    const currentAnns = annotations.filter(ann => 
      Math.abs(ann.time - currentTime) < 1
    );
    setCurrentAnnotations(currentAnns);

    // Check for quiz
    const quizAnn = currentAnns.find(ann => ann.type === 'quiz');
    if (quizAnn && !showQuiz) {
      const question = quizQuestions.find(q => q.id === quizAnn.content);
      if (question) {
        setCurrentQuiz(question);
        setShowQuiz(true);
        if (videoRef.current && playing) {
          videoRef.current.pause();
          setPlaying(false);
        }
      }
    }
  }, [currentTime, annotations, showQuiz, playing]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (startTime > 0) {
        videoRef.current.currentTime = startTime;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      onProgress?.(current);
    }
  };

  const handleProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const loadedPercentage = (bufferedEnd / duration) * 100;
      setLoaded(loadedPercentage);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    onComplete?.();
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
    resetControlsTimeout();
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const seekTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      const newMuted = !muted;
      setMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleFullscreen = async () => {
    if (!fullscreen) {
      try {
        await containerRef.current?.requestFullscreen();
        setFullscreen(true);
      } catch (error) {
        console.error('Fullscreen error:', error);
      }
    } else {
      try {
        await document.exitFullscreen();
        setFullscreen(false);
      } catch (error) {
        console.error('Exit fullscreen error:', error);
      }
    }
  };

  const handleChapterClick = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  };

  const handleAddBookmark = () => {
    const bookmark: VideoAnnotation = {
      id: `bookmark-${Date.now()}`,
      time: currentTime,
      type: 'bookmark',
      title: `Lesezeichen bei ${formatTime(currentTime)}`,
      content: `Bookmark at ${formatTime(currentTime)}`
    };
    setBookmarks([...bookmarks, bookmark]);
    onAnnotationAdd?.(bookmark);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: VideoAnnotation = {
        id: `note-${Date.now()}`,
        time: currentTime,
        type: 'note',
        title: `Notiz bei ${formatTime(currentTime)}`,
        content: newNote.trim()
      };
      setNotes([...notes, note]);
      onAnnotationAdd?.(note);
      setNewNote('');
      setShowNoteInput(false);
    }
  };

  const handleQuizAnswer = (answer: number) => {
    if (currentQuiz) {
      const correct = answer === currentQuiz.correctAnswer;
      setUserAnswers({...userAnswers, [currentQuiz.id]: answer});
      onQuizAnswer?.(currentQuiz.id, answer, correct);
      
      setTimeout(() => {
        setShowQuiz(false);
        setCurrentQuiz(null);
        if (videoRef.current) {
          videoRef.current.play();
          setPlaying(true);
        }
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentChapter = chapters.find(ch => currentTime >= ch.startTime && currentTime <= ch.endTime);

  const filteredTranscript = transcript.filter(t => 
    !searchTerm || t.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Video Player */}
      <div className="flex-1">
        <div 
          ref={containerRef}
          className={`relative bg-black rounded-lg overflow-hidden group ${
            fullscreen ? 'fixed inset-0 z-50' : 'aspect-video'
          }`}
          onMouseMove={resetControlsTimeout}
          onMouseLeave={() => !fullscreen && setShowControls(false)}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={url}
            poster="/api/placeholder/800/450"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
            onEnded={handleEnded}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onWaiting={() => setBuffering(true)}
            onCanPlay={() => setBuffering(false)}
            playsInline
            preload="metadata"
          />

          {/* Current Chapter Display */}
          {currentChapter && (
            <div className="absolute top-4 left-4 z-20">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <List className="h-3 w-3 mr-1" />
                {currentChapter.title}
              </Badge>
            </div>
          )}

          {/* Annotation Markers */}
          {showAnnotations && (
            <div className="absolute top-4 right-4 z-20 space-y-2">
              {currentAnnotations.map((annotation) => (
                <Badge 
                  key={annotation.id}
                  variant={annotation.type === 'quiz' ? 'destructive' : 'secondary'}
                  className={`${
                    annotation.type === 'quiz' ? 'bg-red-600 animate-pulse' :
                    annotation.type === 'note' ? 'bg-blue-600' :
                    annotation.type === 'bookmark' ? 'bg-yellow-600' :
                    'bg-green-600'
                  } text-white`}
                >
                  {annotation.type === 'quiz' && <HelpCircle className="h-3 w-3 mr-1" />}
                  {annotation.type === 'note' && <StickyNote className="h-3 w-3 mr-1" />}
                  {annotation.type === 'bookmark' && <Bookmark className="h-3 w-3 mr-1" />}
                  {annotation.title}
                </Badge>
              ))}
            </div>
          )}

          {/* Video Title Overlay */}
          <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 transition-all duration-300 z-10 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
            {description && (
              <p className="text-white/80 text-sm line-clamp-2">{description}</p>
            )}
          </div>

          {/* Buffering Indicator */}
          {buffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-15">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
                <p className="text-sm">Puffern...</p>
              </div>
            </div>
          )}

          {/* Center Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className={`text-white bg-black/30 hover:bg-black/50 h-16 w-16 rounded-full transition-all duration-300 ${
                showControls || !playing ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              {playing ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-all duration-300 z-10 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            {/* Progress Bar with Annotations */}
            <div className="mb-4">
              <div className="relative">
                <Slider
                  value={[progressPercentage]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                {/* Buffered indicator */}
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-white/30 rounded-full -translate-y-1/2"
                  style={{ width: `${loaded}%` }}
                />
                {/* Annotation markers on progress bar */}
                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className={`absolute top-1/2 w-2 h-2 rounded-full -translate-y-1/2 -translate-x-1 ${
                      annotation.type === 'quiz' ? 'bg-red-500' :
                      annotation.type === 'note' ? 'bg-blue-500' :
                      annotation.type === 'bookmark' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ left: `${(annotation.time / duration) * 100}%` }}
                    title={annotation.title}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-white/80 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                {/* Skip Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSkip(-10)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSkip(10)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMute}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    {muted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="w-20 hidden sm:block">
                    <Slider
                      value={[muted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.1}
                      className="h-1"
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddBookmark}
                    className="text-white hover:bg-white/20 h-8 w-8"
                    title="Lesezeichen hinzufügen"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                    title="Notiz hinzufügen"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                    title="Annotationen ein/ausblenden"
                  >
                    {showAnnotations ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Playback Speed */}
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                  className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1 focus:outline-none focus:border-white/40"
                >
                  <option value={0.5} className="bg-black">0.5x</option>
                  <option value={0.75} className="bg-black">0.75x</option>
                  <option value={1} className="bg-black">1x</option>
                  <option value={1.25} className="bg-black">1.25x</option>
                  <option value={1.5} className="bg-black">1.5x</option>
                  <option value={2} className="bg-black">2x</option>
                </select>

                {/* Sidebar Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {showSidebar ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFullscreen}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {fullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Note Input */}
          {showNoteInput && (
            <div className="absolute bottom-20 left-4 right-4 z-20">
              <Card className="bg-black/80 border-white/20">
                <CardContent className="p-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Notiz hinzufügen..."
                      className="flex-1 bg-transparent text-white border-white/20"
                      rows={2}
                    />
                    <div className="flex flex-col gap-1">
                      <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowNoteInput(false)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Transcript */}
        {showTranscript && transcript.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Transkript
                <div className="flex-1" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Suchen..."
                  className="w-48"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {filteredTranscript.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-2 rounded cursor-pointer transition-colors hover:bg-muted ${
                      Math.abs(item.time - currentTime) < 2 ? 'bg-primary/20' : ''
                    }`}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = item.time;
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground font-mono">{formatTime(item.time)}</span>
                      {item.speaker && (
                        <span className="font-medium text-primary">{item.speaker}:</span>
                      )}
                    </div>
                    <p className="text-sm mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Interactive Sidebar */}
      {showSidebar && !fullscreen && (
        <div className="w-80 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chapters">Kapitel</TabsTrigger>
              <TabsTrigger value="notes">Notizen</TabsTrigger>
              <TabsTrigger value="bookmarks">Marks</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="chapters">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Kapitel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        onClick={() => handleChapterClick(chapter.startTime)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                          currentChapter?.id === chapter.id ? 'bg-primary/20 border border-primary/40' : 'border border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                            {chapter.thumbnail ? (
                              <img src={chapter.thumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Play className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{chapter.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                            </p>
                            {chapter.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {chapter.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5" />
                    Meine Notizen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notes.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Noch keine Notizen erstellt
                      </p>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = note.time;
                            }
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-mono">
                              {formatTime(note.time)}
                            </span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookmarks">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5" />
                    Lesezeichen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookmarks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Noch keine Lesezeichen gesetzt
                      </p>
                    ) : (
                      bookmarks.map((bookmark) => (
                        <div
                          key={bookmark.id}
                          className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer flex items-center gap-3"
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = bookmark.time;
                            }
                          }}
                        >
                          <Bookmark className="h-4 w-4 text-yellow-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{bookmark.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(bookmark.time)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Quiz & Übungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quizQuestions.map((question) => (
                      <div
                        key={question.id}
                        className={`p-3 border rounded-lg ${
                          userAnswers[question.id] !== undefined 
                            ? userAnswers[question.id] === question.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {userAnswers[question.id] !== undefined ? (
                            userAnswers[question.id] === question.correctAnswer ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )
                          ) : (
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">Quiz {question.id.slice(-1)}</span>
                        </div>
                        <p className="text-sm mb-3">{question.question}</p>
                        <div className="space-y-2">
                          {question.answers.map((answer, index) => (
                            <Button
                              key={index}
                              variant={
                                userAnswers[question.id] === index
                                  ? index === question.correctAnswer ? 'default' : 'destructive'
                                  : 'outline'
                              }
                              size="sm"
                              className="w-full justify-start text-left h-auto p-2"
                              onClick={() => handleQuizAnswer(index)}
                              disabled={userAnswers[question.id] !== undefined}
                            >
                              <span className="mr-2">{String.fromCharCode(65 + index)})</span>
                              {answer}
                            </Button>
                          ))}
                        </div>
                        {userAnswers[question.id] !== undefined && question.explanation && (
                          <div className="mt-3 p-2 bg-muted rounded text-xs">
                            <strong>Erklärung:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                Schnellaktionen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {showTranscript ? 'Transkript ausblenden' : 'Transkript anzeigen'}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Video herunterladen
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                Video teilen
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quiz Overlay */}
      {showQuiz && currentQuiz && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Quiz Frage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{currentQuiz.question}</p>
              <div className="space-y-2">
                {currentQuiz.answers.map((answer, index) => (
                  <Button
                    key={index}
                    variant={
                      userAnswers[currentQuiz.id] === index
                        ? index === currentQuiz.correctAnswer ? 'default' : 'destructive'
                        : 'outline'
                    }
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleQuizAnswer(index)}
                    disabled={userAnswers[currentQuiz.id] !== undefined}
                  >
                    <span className="mr-2 font-bold">{String.fromCharCode(65 + index)})</span>
                    {answer}
                  </Button>
                ))}
              </div>
              {userAnswers[currentQuiz.id] !== undefined && currentQuiz.explanation && (
                <div className="mt-4 p-3 bg-muted rounded">
                  <p className="text-sm">
                    <strong>Erklärung:</strong> {currentQuiz.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}