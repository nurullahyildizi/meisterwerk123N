import { useState, useEffect } from "react";
import { User } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share,
  Plus,
  Search,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Send,
  Filter,
  Bookmark,
  Eye,
  Clock,
  Star,
  Target,
  Zap,
  Trophy,
  Heart,
  MessageCircle,
  UserPlus,
  Settings,
  MoreHorizontal,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeOff,
  Maximize,
  Pin,
  Flag,
  Globe,
  Lock,
  Users2,
  Lightbulb,
  Code,
  Wrench,
  Cpu,
  Flame,
  TrendingUp
} from "lucide-react";

interface CommunityProps {
  user: User;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  timestamp: Date;
  likes: number;
  replies: number;
  views: number;
  tags: string[];
  solved: boolean;
  pinned: boolean;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  attachments?: Array<{type: string, name: string, url: string}>;
}

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  host: string;
  hostAvatar: string;
  date: Date;
  duration: number;
  attendees: number;
  maxAttendees: number;
  type: 'workshop' | 'qa' | 'lecture' | 'project' | 'networking';
  status: 'upcoming' | 'live' | 'ended';
  isOnline: boolean;
  location?: string;
  recordingAvailable?: boolean;
  tags: string[];
  requirements: string[];
}

interface DiscussionGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  maxMembers: number;
  isPrivate: boolean;
  lastActivity: Date;
  moderators: string[];
  tags: string[];
  avatar: string;
  recentMessages: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  deadline: Date;
  prize: string;
  category: string;
  status: 'active' | 'upcoming' | 'ended';
  progress: number;
}

interface ExpertSession {
  id: string;
  expert: string;
  expertTitle: string;
  expertAvatar: string;
  topic: string;
  description: string;
  date: Date;
  duration: number;
  attendees: number;
  maxAttendees: number;
  cost: number;
  rating: number;
  reviews: number;
  tags: string[];
}

export default function EnhancedCommunity({ user }: CommunityProps) {
  const [activeTab, setActiveTab] = useState('forum');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  // Forum categories
  const categories = [
    { id: 'all', name: 'Alle Kategorien', icon: Users, count: 156 },
    { id: 'elektrotechnik', name: 'Elektrotechnik', icon: Zap, count: 45 },
    { id: 'programmierung', name: 'Programmierung', icon: Code, count: 32 },
    { id: 'mechanik', name: 'Mechanik', icon: Wrench, count: 28 },
    { id: 'elektronik', name: 'Elektronik', icon: Cpu, count: 24 },
    { id: 'automation', name: 'Automation', icon: Settings, count: 18 },
    { id: 'karriere', name: 'Karriere', icon: TrendingUp, count: 9 }
  ];

  // Mock data - forum posts
  const forumPosts: ForumPost[] = [
    {
      id: '1',
      title: 'VDE 0100 - Frage zu Schutzleitern in TN-Systemen',
      content: 'Hallo zusammen, ich habe eine Frage bezüglich der korrekten Verlegung von Schutzleitern in TN-Systemen. Kann mir jemand die Unterschiede zwischen TN-C und TN-S erklären?',
      author: 'MaxMustermann',
      authorAvatar: '/api/placeholder/32/32',
      authorRole: 'Elektriker',
      timestamp: new Date('2024-01-14T16:30:00'),
      likes: 12,
      replies: 8,
      views: 156,
      tags: ['VDE 0100', 'Schutzleiter', 'TN-System'],
      solved: false,
      pinned: true,
      category: 'elektrotechnik',
      difficulty: 'intermediate'
    },
    {
      id: '2',
      title: 'SPS Siemens S7-1200 - Programmierung einer Ampelsteuerung',
      content: 'Hat jemand Erfahrung mit der Programmierung einer einfachen Ampelsteuerung? Ich brauche Hilfe bei der Logik für die Zeitsteuerung.',
      author: 'TechnikPro',
      authorAvatar: '/api/placeholder/32/32',
      authorRole: 'Meister',
      timestamp: new Date('2024-01-14T14:15:00'),
      likes: 8,
      replies: 15,
      views: 243,
      tags: ['SPS', 'Siemens S7-1200', 'Programmierung'],
      solved: true,
      pinned: false,
      category: 'automation',
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: 'Meisterprüfung Teil 3 - Tipps für die Vorbereitung',
      content: 'Welche Lernmaterialien könnt ihr für Teil 3 der Meisterprüfung empfehlen? Besonders für den BWL-Teil bin ich unsicher.',
      author: 'AngehenderMeister',
      authorAvatar: '/api/placeholder/32/32',
      authorRole: 'Azubi',
      timestamp: new Date('2024-01-13T19:45:00'),
      likes: 25,
      replies: 31,
      views: 567,
      tags: ['Meisterprüfung', 'Vorbereitung', 'BWL'],
      solved: false,
      pinned: false,
      category: 'karriere',
      difficulty: 'advanced'
    }
  ];

  // Mock data - live events
  const liveEvents: LiveEvent[] = [
    {
      id: '1',
      title: 'Live Q&A: Zukunft der Elektromobilität',
      description: 'Diskutieren Sie mit Experten über die neuesten Entwicklungen in der E-Mobilität',
      host: 'Dr. Elena Schmidt',
      hostAvatar: '/api/placeholder/32/32',
      date: new Date('2024-01-15T19:00:00'),
      duration: 90,
      attendees: 234,
      maxAttendees: 500,
      type: 'qa',
      status: 'live',
      isOnline: true,
      tags: ['E-Mobilität', 'Zukunft', 'Ladeinfrastruktur'],
      requirements: ['Grundkenntnisse Elektrotechnik']
    },
    {
      id: '2',
      title: 'Hands-on Workshop: Arduino Programmierung',
      description: 'Praktischer Workshop für Einsteiger in die Arduino-Programmierung',
      host: 'Prof. Michael Chen',
      hostAvatar: '/api/placeholder/32/32',
      date: new Date('2024-01-16T18:00:00'),
      duration: 120,
      attendees: 45,
      maxAttendees: 50,
      type: 'workshop',
      status: 'upcoming',
      isOnline: true,
      tags: ['Arduino', 'Mikrocontroller', 'IoT'],
      requirements: ['Computer mit Internet', 'Arduino Board (optional)']
    },
    {
      id: '3',
      title: 'Networking Event: Junge Fachkräfte Hamburg',
      description: 'Vernetzen Sie sich mit anderen jungen Elektrotechnikern in Hamburg',
      host: 'Community Hamburg',
      hostAvatar: '/api/placeholder/32/32',
      date: new Date('2024-01-18T18:30:00'),
      duration: 180,
      attendees: 67,
      maxAttendees: 80,
      type: 'networking',
      status: 'upcoming',
      isOnline: false,
      location: 'TechHub Hamburg',
      tags: ['Networking', 'Hamburg', 'Karriere'],
      requirements: ['Anmeldung erforderlich']
    }
  ];

  // Mock data - discussion groups
  const discussionGroups: DiscussionGroup[] = [
    {
      id: '1',
      name: 'SPS Programmierer',
      description: 'Alles rund um SPS-Programmierung, von Grundlagen bis zu fortgeschrittenen Techniken',
      category: 'automation',
      members: 1247,
      maxMembers: 2000,
      isPrivate: false,
      lastActivity: new Date('2024-01-14T15:30:00'),
      moderators: ['TechExpert', 'AutomationPro'],
      tags: ['SPS', 'Siemens', 'Beckhoff', 'Allen-Bradley'],
      avatar: '🤖',
      recentMessages: 23
    },
    {
      id: '2',
      name: 'Meister-Azubis',
      description: 'Support-Gruppe für alle, die den Meistertitel anstreben',
      category: 'karriere',
      members: 856,
      maxMembers: 1500,
      isPrivate: false,
      lastActivity: new Date('2024-01-14T17:45:00'),
      moderators: ['MeisterMax'],
      tags: ['Meisterprüfung', 'Weiterbildung', 'Motivation'],
      avatar: '🎓',
      recentMessages: 42
    },
    {
      id: '3',
      name: 'E-Mobilität Experten',
      description: 'Diskussionen über Elektromobilität, Ladeinfrastruktur und Zukunftstechnologien',
      category: 'elektrotechnik',
      members: 634,
      maxMembers: 1000,
      isPrivate: false,
      lastActivity: new Date('2024-01-14T12:20:00'),
      moderators: ['EMobilityGuru'],
      tags: ['E-Mobilität', 'Ladestation', 'Batterie'],
      avatar: '🔋',
      recentMessages: 15
    }
  ];

  // Mock data - challenges
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Smart Home Automation Challenge',
      description: 'Entwickeln Sie ein innovatives Smart Home System mit IoT-Integration',
      difficulty: 'hard',
      participants: 156,
      deadline: new Date('2024-02-15'),
      prize: '1000€ + Premium-Mitgliedschaft',
      category: 'automation',
      status: 'active',
      progress: 65
    },
    {
      id: '2',
      title: 'Energieeffizienz-Wettbewerb',
      description: 'Finden Sie die beste Lösung zur Energieeinsparung in Industrieanlagen',
      difficulty: 'medium',
      participants: 89,
      deadline: new Date('2024-01-30'),
      prize: '500€ + Zertifikat',
      category: 'elektrotechnik',
      status: 'active',
      progress: 45
    },
    {
      id: '3',
      title: 'Arduino Creativity Contest',
      description: 'Erstellen Sie das kreativste Arduino-Projekt',
      difficulty: 'easy',
      participants: 234,
      deadline: new Date('2024-02-01'),
      prize: 'Arduino Starter Kit',
      category: 'programmierung',
      status: 'active',
      progress: 78
    }
  ];

  // Mock data - expert sessions
  const expertSessions: ExpertSession[] = [
    {
      id: '1',
      expert: 'Dr. Thomas Weber',
      expertTitle: 'Siemens Senior Engineer',
      expertAvatar: '/api/placeholder/32/32',
      topic: 'Industrielle Automation mit SIMATIC',
      description: 'Exklusive 1:1 Session über fortgeschrittene SIMATIC-Programmierung',
      date: new Date('2024-01-16T14:00:00'),
      duration: 60,
      attendees: 1,
      maxAttendees: 1,
      cost: 75,
      rating: 4.9,
      reviews: 127,
      tags: ['SIMATIC', 'Automation', 'Siemens']
    },
    {
      id: '2',
      expert: 'Ing. Sarah Müller',
      expertTitle: 'E-Mobility Consultant',
      expertAvatar: '/api/placeholder/32/32',
      topic: 'Ladeinfrastruktur planen und umsetzen',
      description: 'Praktische Tipps zur Planung von Ladestationen',
      date: new Date('2024-01-17T16:30:00'),
      duration: 90,
      attendees: 3,
      maxAttendees: 5,
      cost: 45,
      rating: 4.8,
      reviews: 89,
      tags: ['E-Mobilität', 'Ladestation', 'Planung']
    }
  ];

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChallengeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'border-green-500 bg-green-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'hard': return 'border-red-500 bg-red-50';
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

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `vor ${days} Tag${days !== 1 ? 'en' : ''}`;
    } else if (hours > 0) {
      return `vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `vor ${minutes} Minute${minutes !== 1 ? 'n' : ''}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Erweiterte Community
        </h1>
        <p className="text-muted-foreground">
          Vernetzen, Lernen und Wachsen - zusammen mit Fachexperten weltweit
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="live-events">Live Events</TabsTrigger>
          <TabsTrigger value="groups">Gruppen</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="experts">Experten</TabsTrigger>
          <TabsTrigger value="projects">Projekte</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          {/* Forum Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Forum durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => setShowNewPostForm(!showNewPostForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Neue Frage
              </Button>
            </div>
          </div>

          {/* Categories Quick Access */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.slice(1).map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCategory(category.id)}>
                <CardContent className="p-4 text-center">
                  <category.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="text-sm font-medium">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} Posts</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Post Form */}
          {showNewPostForm && (
            <Card>
              <CardHeader>
                <CardTitle>Neue Frage stellen</CardTitle>
                <CardDescription>
                  Stellen Sie Ihre Frage an die Community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Titel Ihrer Frage"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Beschreiben Sie Ihr Problem oder Ihre Frage detailliert..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                />
                <div className="flex gap-4">
                  <select className="px-3 py-2 border border-border rounded-md">
                    <option>Kategorie wählen...</option>
                    {categories.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 border border-border rounded-md">
                    <option value="beginner">Anfänger</option>
                    <option value="intermediate">Fortgeschritten</option>
                    <option value="advanced">Experte</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button>Frage posten</Button>
                  <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                    Abbrechen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Forum Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.authorAvatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {post.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {post.pinned && <Pin className="h-4 w-4 text-yellow-500" />}
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            {post.solved && <Badge className="bg-green-500/10 text-green-500">✓ Gelöst</Badge>}
                            <Badge className={`text-xs ${getDifficultyColor(post.difficulty)}`}>
                              {post.difficulty === 'beginner' ? 'Anfänger' : 
                               post.difficulty === 'intermediate' ? 'Fortgeschritten' : 'Experte'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{post.author}</span>
                            <Badge variant="outline">{post.authorRole}</Badge>
                            <span>•</span>
                            <span>{getTimeAgo(post.timestamp)}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageSquare className="h-4 w-4" />
                            {post.replies} Antworten
                          </button>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views} Aufrufe
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live-events" className="space-y-6">
          {/* Live Indicator */}
          <Card className="border-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <Badge variant="destructive">LIVE</Badge>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Live Q&A: Zukunft der Elektromobilität</h3>
                  <p className="text-sm text-muted-foreground">234 Teilnehmer • Dr. Elena Schmidt</p>
                </div>
                <Button>
                  <Video className="h-4 w-4 mr-2" />
                  Jetzt beitreten
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <Badge variant={event.status === 'live' ? 'destructive' : event.status === 'upcoming' ? 'default' : 'secondary'}>
                        {event.status === 'live' ? '🔴 LIVE' : 
                         event.status === 'upcoming' ? '📅 Bald' : '✅ Beendet'}
                      </Badge>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <Badge variant={event.isOnline ? "secondary" : "outline"}>
                      {event.isOnline ? "Online" : "Präsenz"}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={event.hostAvatar} />
                      <AvatarFallback>{event.host.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{event.host}</p>
                      <p className="text-xs text-muted-foreground">Moderator</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.duration} Minuten</span>
                    </div>
                    {!event.isOnline && event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.attendees}/{event.maxAttendees} Teilnehmer</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Progress value={(event.attendees / event.maxAttendees) * 100} className="h-2" />

                  <Button className="w-full">
                    {event.status === 'live' ? (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Jetzt beitreten
                      </>
                    ) : event.status === 'upcoming' ? (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Anmelden
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Aufzeichnung ansehen
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Diskussionsgruppen</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neue Gruppe erstellen
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discussionGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                      {group.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.isPrivate ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {group.members.toLocaleString()} Mitglieder
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{group.recentMessages} neue Nachrichten</span>
                    </div>
                    <span className="text-muted-foreground">
                      {getTimeAgo(group.lastActivity)}
                    </span>
                  </div>

                  <Progress value={(group.members / group.maxMembers) * 100} className="h-2" />

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Beitreten
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Community Challenges</h2>
            <p className="text-muted-foreground">
              Zeigen Sie Ihr Können und gewinnen Sie tolle Preise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className={`border-l-4 ${getChallengeColor(challenge.difficulty)} hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant={challenge.status === 'active' ? 'default' : challenge.status === 'upcoming' ? 'secondary' : 'outline'}>
                      {challenge.status === 'active' ? '🔥 Aktiv' :
                       challenge.status === 'upcoming' ? '📅 Bald' : '✅ Beendet'}
                    </Badge>
                    <Badge variant={
                      challenge.difficulty === 'easy' ? 'secondary' :
                      challenge.difficulty === 'medium' ? 'default' : 'destructive'
                    }>
                      {challenge.difficulty === 'easy' ? 'Einfach' :
                       challenge.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{challenge.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {challenge.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Fortschritt</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.participants} Teilnehmer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Deadline: {challenge.deadline.toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{challenge.prize}</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    {challenge.status === 'active' ? (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Teilnehmen
                      </>
                    ) : challenge.status === 'upcoming' ? (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Benachrichtigen
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Ergebnisse ansehen
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experts" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">1:1 Experten-Sessions</h2>
            <p className="text-muted-foreground">
              Buchen Sie persönliche Beratung mit Branchenexperten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={session.expertAvatar} />
                      <AvatarFallback>{session.expert.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.expert}</h3>
                      <p className="text-sm text-muted-foreground">{session.expertTitle}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{session.rating}</span>
                        <span className="text-sm text-muted-foreground">({session.reviews})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">{session.topic}</h4>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{session.duration} Minuten</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{session.attendees}/{session.maxAttendees} Plätze</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{session.cost}€</span>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Buchen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Community Projekte</h2>
            <p className="text-muted-foreground">
              Arbeiten Sie gemeinsam an realen Projekten und sammeln Sie praktische Erfahrungen
            </p>
          </div>

          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Projekte kommen bald!</h3>
              <p className="text-muted-foreground mb-6">
                Wir arbeiten an einer aufregenden neuen Funktion für kollaborative Projekte. 
                Bald können Sie gemeinsam mit anderen an realen Elektrotechnik-Projekten arbeiten.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Benachrichtigen, wenn verfügbar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}