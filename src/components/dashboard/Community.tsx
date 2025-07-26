import { useState } from "react";
import { User } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  BookOpen
} from "lucide-react";

interface CommunityProps {
  user: User;
}

// Mock data
const forumPosts = [
  {
    id: 1,
    title: "VDE 0100 - Frage zu Schutzleitern in TN-Systemen",
    content: "Hallo zusammen, ich habe eine Frage bezüglich der korrekten Verlegung von Schutzleitern...",
    author: "MaxMustermann",
    avatar: "MM",
    role: "Elektriker",
    timestamp: "vor 2 Stunden",
    likes: 5,
    replies: 12,
    tags: ["VDE", "Schutzleiter", "TN-System"],
    solved: false
  },
  {
    id: 2,
    title: "SPS Siemens S7-1200 - Programmierung einer Ampelsteuerung",
    content: "Hat jemand Erfahrung mit der Programmierung einer einfachen Ampelsteuerung?",
    author: "TechnikPro",
    avatar: "TP",
    role: "Meister",
    timestamp: "vor 4 Stunden",
    likes: 8,
    replies: 7,
    tags: ["SPS", "Siemens", "Programmierung"],
    solved: true
  },
  {
    id: 3,
    title: "Meisterprüfung Teil 3 - Tipps für die Vorbereitung",
    content: "Welche Lernmaterialien könnt ihr für Teil 3 der Meisterprüfung empfehlen?",
    author: "AngehenderMeister",
    avatar: "AM", 
    role: "Azubi",
    timestamp: "vor 1 Tag",
    likes: 15,
    replies: 23,
    tags: ["Meister", "Prüfung", "Vorbereitung"],
    solved: false
  }
];

const events = [
  {
    id: 1,
    title: "Online-Workshop: KNX Grundlagen",
    description: "Einführung in die KNX-Bustechnik",
    date: "2024-02-15",
    time: "18:00",
    attendees: 45,
    maxAttendees: 50,
    type: "Workshop",
    isOnline: true
  },
  {
    id: 2,
    title: "Fachtagung Elektromobilität",
    description: "Zukunft der Ladeinfrastruktur",
    date: "2024-02-20",
    time: "09:00",
    location: "Hamburg",
    attendees: 120,
    maxAttendees: 150,
    type: "Tagung",
    isOnline: false
  },
  {
    id: 3,
    title: "Prüfungsvorbereitung Meister Teil 2",
    description: "Intensivkurs für die praktische Prüfung",
    date: "2024-03-01",
    time: "10:00",
    attendees: 12,
    maxAttendees: 15,
    type: "Kurs",
    isOnline: true
  }
];

export default function Community({ user }: CommunityProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const leaderboard = [
    { rank: 1, name: "ElektroExperte", points: 2840, avatar: "EE", badge: "🏆" },
    { rank: 2, name: "MeisterMax", points: 2650, avatar: "MM", badge: "🥈" },
    { rank: 3, name: "TechGuru", points: 2490, avatar: "TG", badge: "🥉" },
    { rank: 4, name: user.name, points: user.xp, avatar: user.avatar, badge: "" },
    { rank: 5, name: "LernProfi", points: 2180, avatar: "LP", badge: "" }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground">
          Vernetzen Sie sich mit anderen Fachkräften und tauschen Sie Wissen aus
        </p>
      </div>

      <Tabs defaultValue="forum" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="leaderboard">Rangliste</TabsTrigger>
        </TabsList>

        {/* Forum Tab */}
        <TabsContent value="forum" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Forum durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowNewPostForm(!showNewPostForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Frage
            </Button>
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
                  placeholder="Beschreiben Sie Ihr Problem oder Ihre Frage..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                />
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
            {forumPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium hover:text-primary transition-colors">
                            {post.title}
                            {post.solved && <Badge className="ml-2 bg-green-500/10 text-green-500">Gelöst</Badge>}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>{post.author}</span>
                            <Badge variant="outline">{post.role}</Badge>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          {post.replies} Antworten
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Share className="h-4 w-4" />
                          Teilen
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge>{event.type}</Badge>
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
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date} um {event.time}</span>
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
                  <Button className="w-full" variant="outline">
                    Anmelden
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Monatliche Rangliste
              </CardTitle>
              <CardDescription>
                Die aktivsten Community-Mitglieder dieses Monats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      entry.name === user.name ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background text-sm font-medium">
                      {entry.rank}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.name}</span>
                        {entry.badge && <span className="text-lg">{entry.badge}</span>}
                        {entry.name === user.name && <Badge variant="outline">Sie</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.points.toLocaleString()} Punkte
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}