import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Users, 
  Star, 
  Clock, 
  Search, 
  Plus, 
  MessageSquare, 
  Video, 
  Calendar as CalendarIcon,
  Filter,
  Award,
  BookOpen,
  Target,
  CheckCircle,
  User,
  Heart,
  Brain,
  Lightbulb,
  Coffee,
  Zap,
  Rocket,
  Trophy,
  UserPlus,
  Settings,
  Send,
  Phone,
  MoreHorizontal,
  MapPin,
  Globe,
  GraduationCap,
  Medal
} from 'lucide-react';

interface MentorProfile {
  id: string;
  name: string;
  avatar: string;
  expertise: string[];
  rating: number;
  reviewCount: number;
  bio: string;
  experience: string;
  availability: string[];
  languages: string[];
  pricePerHour?: number;
  isPro: boolean;
  completedSessions: number;
  responseTime: string;
  location: string;
  timezone: string;
  badges: string[];
}

interface MentoringSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  subject: string;
  date: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  rating?: number;
  feedback?: string;
  notes?: string;
  topics: string[];
  sessionType: 'video' | 'chat' | 'screen-share';
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  members: Array<{id: string; name: string; avatar: string; role: 'admin' | 'member'}>;
  maxMembers: number;
  isPrivate: boolean;
  tags: string[];
  nextMeeting?: Date;
  createdBy: string;
  createdAt: Date;
}

interface MentorRequest {
  id: string;
  studentName: string;
  studentAvatar: string;
  subject: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  preferredTime: string;
  budget?: number;
  skills: string[];
  createdAt: Date;
  status: 'open' | 'matched' | 'closed';
}

export default function MentoringSystem() {
  const [activeTab, setActiveTab] = useState('find-mentor');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessionType, setSessionType] = useState<'video' | 'chat' | 'screen-share'>('video');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');

  // Sample data
  const mentors: MentorProfile[] = [
    {
      id: '1',
      name: 'Dr. Elena Müller',
      avatar: '/api/placeholder/64/64',
      expertise: ['Elektrotechnik', 'Physik', 'Mathematik'],
      rating: 4.9,
      reviewCount: 156,
      bio: 'Promovierte Elektroingenieurin mit 15 Jahren Berufserfahrung. Spezialisiert auf Schaltungsdesign und digitale Signalverarbeitung.',
      experience: '15+ Jahre',
      availability: ['Mo-Fr 9-17', 'Sa 10-14'],
      languages: ['Deutsch', 'Englisch', 'Spanisch'],
      pricePerHour: 45,
      isPro: true,
      completedSessions: 2341,
      responseTime: '< 2 Stunden',
      location: 'München, Deutschland',
      timezone: 'CET',
      badges: ['Top Mentor', 'Expert', '1000+ Sessions']
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      avatar: '/api/placeholder/64/64',
      expertise: ['Programmierung', 'KI/ML', 'Datenstrukturen'],
      rating: 4.8,
      reviewCount: 203,
      bio: 'Informatikprofessor und erfahrener Software-Entwickler. Hilft Studenten beim Verstehen komplexer Algorithmen.',
      experience: '12+ Jahre',
      availability: ['Mo-Do 14-20', 'So 10-16'],
      languages: ['Deutsch', 'Englisch', 'Mandarin'],
      pricePerHour: 50,
      isPro: true,
      completedSessions: 1876,
      responseTime: '< 3 Stunden',
      location: 'Berlin, Deutschland',
      timezone: 'CET',
      badges: ['AI Expert', 'University Professor', 'Coding Master']
    },
    {
      id: '3',
      name: 'Sarah Williams',
      avatar: '/api/placeholder/64/64',
      expertise: ['Chemie', 'Biochemie', 'Laborarbeit'],
      rating: 4.7,
      reviewCount: 89,
      bio: 'Biochemikerin mit Passion für Lehre. Erklärt komplexe chemische Prozesse verständlich und praxisnah.',
      experience: '8+ Jahre',
      availability: ['Di-Do 16-21', 'Sa-So 9-15'],
      languages: ['Deutsch', 'Englisch'],
      pricePerHour: 35,
      isPro: false,
      completedSessions: 543,
      responseTime: '< 4 Stunden',
      location: 'Hamburg, Deutschland',
      timezone: 'CET',
      badges: ['Chemistry Expert', 'Patient Teacher']
    }
  ];

  const mySessions: MentoringSession[] = [
    {
      id: '1',
      mentorId: '1',
      mentorName: 'Dr. Elena Müller',
      mentorAvatar: '/api/placeholder/32/32',
      subject: 'Elektrotechnik',
      date: new Date('2024-01-15T14:00:00'),
      duration: 60,
      status: 'scheduled',
      topics: ['Ohmsche Gesetz', 'Widerstandsschaltungen'],
      sessionType: 'video'
    },
    {
      id: '2',
      mentorId: '2',
      mentorName: 'Prof. Michael Chen',
      mentorAvatar: '/api/placeholder/32/32',
      subject: 'Programmierung',
      date: new Date('2024-01-12T16:30:00'),
      duration: 90,
      status: 'completed',
      rating: 5,
      feedback: 'Ausgezeichnete Erklärung der Datenstrukturen!',
      topics: ['Binary Trees', 'Algorithmus-Komplexität'],
      sessionType: 'screen-share'
    }
  ];

  const studyGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'Elektrotechnik Lerngruppe',
      subject: 'Elektrotechnik',
      description: 'Gemeinsam lernen wir die Grundlagen der Elektrotechnik und helfen uns bei schwierigen Aufgaben.',
      members: [
        {id: '1', name: 'Max Mustermann', avatar: '/api/placeholder/32/32', role: 'admin'},
        {id: '2', name: 'Lisa Schmidt', avatar: '/api/placeholder/32/32', role: 'member'},
        {id: '3', name: 'Tom Weber', avatar: '/api/placeholder/32/32', role: 'member'}
      ],
      maxMembers: 8,
      isPrivate: false,
      tags: ['Anfänger', 'Schaltungen', 'Praxis'],
      nextMeeting: new Date('2024-01-16T19:00:00'),
      createdBy: '1',
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Python Coding Circle',
      subject: 'Programmierung',
      description: 'Wöchentliche Python-Sessions für Anfänger und Fortgeschrittene.',
      members: [
        {id: '4', name: 'Anna Kraft', avatar: '/api/placeholder/32/32', role: 'admin'},
        {id: '5', name: 'David Lee', avatar: '/api/placeholder/32/32', role: 'member'}
      ],
      maxMembers: 6,
      isPrivate: false,
      tags: ['Python', 'Projekte', 'Code Review'],
      nextMeeting: new Date('2024-01-18T20:00:00'),
      createdBy: '4',
      createdAt: new Date('2024-01-05')
    }
  ];

  const mentorRequests: MentorRequest[] = [
    {
      id: '1',
      studentName: 'Julia Bauer',
      studentAvatar: '/api/placeholder/32/32',
      subject: 'Mathematik',
      description: 'Brauche Hilfe bei Integralrechnung und Differentialgleichungen für meine Prüfung.',
      urgency: 'high',
      preferredTime: 'Abends nach 18 Uhr',
      budget: 40,
      skills: ['Analysis', 'Calculus'],
      createdAt: new Date('2024-01-14T10:30:00'),
      status: 'open'
    },
    {
      id: '2',
      studentName: 'Kevin Richter',
      studentAvatar: '/api/placeholder/32/32',
      subject: 'Physik',
      description: 'Verstehe die Quantenmechanik nicht. Suche geduldigen Mentor.',
      urgency: 'medium',
      preferredTime: 'Wochenends',
      budget: 30,
      skills: ['Quantenphysik', 'Wellenfunktionen'],
      createdAt: new Date('2024-01-13T15:45:00'),
      status: 'open'
    }
  ];

  const subjects = [
    'Elektrotechnik', 'Mathematik', 'Physik', 'Chemie', 'Informatik', 
    'Programmierung', 'Maschinenbau', 'Wirtschaft', 'Sprachen'
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !selectedSubject || mentor.expertise.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const handleBookSession = () => {
    if (selectedMentor && selectedDate && sessionTopic) {
      // Here would be the actual booking logic
      alert(`Session mit ${selectedMentor.name} am ${selectedDate.toLocaleDateString()} gebucht!`);
      setShowBooking(false);
      setSelectedMentor(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Mentoring & Peer Learning</h1>
        <p className="text-muted-foreground">
          Finde erfahrene Mentoren, schließe dich Lerngruppen an und werde selbst zum Mentor
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="find-mentor">Mentor finden</TabsTrigger>
          <TabsTrigger value="my-sessions">Meine Sessions</TabsTrigger>
          <TabsTrigger value="study-groups">Lerngruppen</TabsTrigger>
          <TabsTrigger value="mentor-requests">Anfragen</TabsTrigger>
          <TabsTrigger value="become-mentor">Mentor werden</TabsTrigger>
        </TabsList>

        <TabsContent value="find-mentor" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Mentor suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md"
                >
                  <option value="">Alle Fächer</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mentor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{mentor.name}</h3>
                        {mentor.isPro && <Badge variant="default">PRO</Badge>}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{mentor.rating}</span>
                        <span className="text-sm text-muted-foreground">({mentor.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {mentor.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mentor.bio}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Antwortzeit: {mentor.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span>{mentor.completedSessions} Sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{mentor.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {mentor.badges.slice(0, 2).map((badge) => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-lg">
                      {mentor.pricePerHour ? `${mentor.pricePerHour}€/Std` : 'Kostenlos'}
                    </span>
                    <Button 
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setShowBooking(true);
                      }}
                    >
                      Buchen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-sessions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Kommende Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mySessions.filter(s => s.status === 'scheduled').map((session) => (
                    <div key={session.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.mentorAvatar} />
                          <AvatarFallback>{session.mentorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{session.mentorName}</h4>
                          <p className="text-sm text-muted-foreground">{session.subject}</p>
                          <p className="text-sm font-medium mt-1">
                            {formatDate(session.date)}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {session.topics.map((topic) => (
                              <Badge key={topic} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <Video className="h-4 w-4 mr-2" />
                          Beitreten
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completed Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Abgeschlossene Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mySessions.filter(s => s.status === 'completed').map((session) => (
                    <div key={session.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.mentorAvatar} />
                          <AvatarFallback>{session.mentorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{session.mentorName}</h4>
                          <p className="text-sm text-muted-foreground">{session.subject}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${
                                i < (session.rating || 0) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} />
                            ))}
                          </div>
                          {session.feedback && (
                            <p className="text-sm text-muted-foreground mt-2">
                              "{session.feedback}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="study-groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Lerngruppen</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Gruppe erstellen
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{group.subject}</p>
                    </div>
                    <Badge variant={group.isPrivate ? "secondary" : "default"}>
                      {group.isPrivate ? 'Privat' : 'Öffentlich'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{group.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {group.members.length}/{group.maxMembers} Mitglieder
                    </span>
                  </div>

                  {group.nextMeeting && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {group.nextMeeting.toLocaleDateString('de-DE', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex -space-x-2">
                    {group.members.slice(0, 4).map((member) => (
                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group.members.length > 4 && (
                      <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium">+{group.members.length - 4}</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Beitreten
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentor-requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mentor-Anfragen</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Anfrage erstellen
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentorRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.studentAvatar} />
                      <AvatarFallback>{request.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{request.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{request.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={
                            request.urgency === 'high' ? 'destructive' : 
                            request.urgency === 'medium' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {request.urgency === 'high' ? 'Dringend' : 
                           request.urgency === 'medium' ? 'Normal' : 'Niedrig'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {request.createdAt.toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{request.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{request.preferredTime}</span>
                    </div>
                    {request.budget && (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>Budget: {request.budget}€/Std</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {request.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Antworten
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="become-mentor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Werde Mentor und teile dein Wissen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Teile dein Wissen</h3>
                  <p className="text-sm text-muted-foreground">
                    Helfe anderen Studenten beim Verstehen komplexer Themen
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Verdiene Geld</h3>
                  <p className="text-sm text-muted-foreground">
                    Monetarisiere dein Expertenwissen und verdiene flexibel
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Entwickle dich weiter</h3>
                  <p className="text-sm text-muted-foreground">
                    Verbessere deine Lehrfähigkeiten und baue dein Netzwerk aus
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Mentor-Profil erstellen</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Fachbereiche (durch Komma getrennt)" />
                  <Input placeholder="Stundensatz (€)" type="number" />
                  <Input placeholder="Verfügbare Zeiten" />
                  <Input placeholder="Sprachen" />
                </div>
                <Textarea 
                  placeholder="Beschreibe deine Erfahrung und deinen Lehrausansatz..." 
                  className="mt-4"
                  rows={4}
                />
                <Button className="mt-4">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Mentor-Profil erstellen
                </Button>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Medal className="h-5 w-5" />
                  Mentor-Vorteile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Flexible Arbeitszeiten</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Wöchentliche Auszahlung</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Kostenlose Weiterbildung</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Premium-Mentor-Badge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Networking-Events</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Modal */}
      {showBooking && selectedMentor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMentor.avatar} />
                  <AvatarFallback>{selectedMentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                Session mit {selectedMentor.name} buchen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Datum wählen</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Session-Typ</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['video', 'chat', 'screen-share'] as const).map((type) => (
                        <Button
                          key={type}
                          variant={sessionType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSessionType(type)}
                        >
                          {type === 'video' && <Video className="h-4 w-4 mr-1" />}
                          {type === 'chat' && <MessageSquare className="h-4 w-4 mr-1" />}
                          {type === 'screen-share' && <Settings className="h-4 w-4 mr-1" />}
                          {type === 'video' ? 'Video' : 
                           type === 'chat' ? 'Chat' : 'Screen Share'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Dauer (Minuten)</label>
                    <select
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    >
                      <option value={30}>30 Minuten</option>
                      <option value={60}>60 Minuten</option>
                      <option value={90}>90 Minuten</option>
                      <option value={120}>120 Minuten</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Thema</label>
                    <Input
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      placeholder="z.B. Ohmsche Gesetz, Schaltungsanalyse..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Beschreibung</label>
                <Textarea
                  value={sessionDescription}
                  onChange={(e) => setSessionDescription(e.target.value)}
                  placeholder="Beschreibe, wobei du Hilfe brauchst..."
                  rows={3}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Session-Kosten:</span>
                  <span className="font-semibold">
                    {selectedMentor.pricePerHour ? 
                      `${(selectedMentor.pricePerHour * sessionDuration / 60).toFixed(2)}€` : 
                      'Kostenlos'
                    }
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedMentor.pricePerHour && 
                    `${sessionDuration} Min. × ${selectedMentor.pricePerHour}€/Std`
                  }
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowBooking(false);
                    setSelectedMentor(null);
                  }}
                >
                  Abbrechen
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleBookSession}
                  disabled={!selectedDate || !sessionTopic}
                >
                  Session buchen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}