import { useState, useEffect } from "react";
// HINWEIS: Fügen Sie 'listenToLearningRooms' zu Ihren Firebase-Importen hinzu
import { User, LearningRoom, GroupMessage, createLearningRoom, listenToLearningRooms, joinLearningRoom, sendGroupMessage, listenToGroupMessages } from "@/lib/firebase";
import InteractiveWhiteboard from "../whiteboard/InteractiveWhiteboard";
import LiveStreamRoom from "../live/LiveStreamRoom";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Video,
  Users,
  Plus,
  Mic,
  MicOff,
  VideoOff,
  Share,
  MessageSquare,
  PenTool,
  FileText,
  Download,
  MoreHorizontal,
  Send
} from "lucide-react";

interface LearningRoomsProps {
  user: User;
}

export default function LearningRooms({ user }: LearningRoomsProps) {
  const [rooms, setRooms] = useState<LearningRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  // KORREKTUR: Der Ladezustand wird initial auf 'true' gesetzt.
  const [loading, setLoading] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Create room form state
  const [newRoomData, setNewRoomData] = useState({
    name: "",
    description: "",
    subject: "",
    maxParticipants: 10,
    isPrivate: false
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState<GroupMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // KORREKTUR: Verwendet jetzt einen Echtzeit-Listener, um die Räume dynamisch zu aktualisieren.
  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenToLearningRooms((fetchedRooms) => {
      setRooms(fetchedRooms);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to learning rooms:", error);
      setLoading(false);
    });

    // Wichtig: Die Listener-Funktion beim Verlassen der Komponente beenden
    return () => unsubscribe();
  }, []);

  // Listen to chat messages when active room changes
  useEffect(() => {
    if (activeRoom) {
      const unsubscribe = listenToGroupMessages(activeRoom, (messages) => {
        setChatMessages(messages);
      });
      return () => unsubscribe();
    }
  }, [activeRoom]);

  const handleCreateRoom = async () => {
    if (!newRoomData.name.trim() || !newRoomData.description.trim()) return;

    setLoading(true);
    try {
      const roomData = {
        ...newRoomData,
        createdBy: user.id,
        instructors: [user.id],
        participants: [user.id],
        resources: [],
        tags: newRoomData.subject.split(',').map(tag => tag.trim()).filter(Boolean),
        isActive: true
      };

      const roomId = await createLearningRoom(roomData);
      setNewRoomData({
        name: "",
        description: "",
        subject: "",
        maxParticipants: 10,
        isPrivate: false
      });
      setShowCreateRoom(false);
      // Kein manuelles Neuladen mehr nötig, da der Listener die Liste automatisch aktualisiert.
      setActiveRoom(roomId);
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      // setLoading(false) wird vom Listener übernommen
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinLearningRoom(roomId, user.id);
      setActiveRoom(roomId);
      // Kein manuelles Neuladen nötig
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const handleSendChatMessage = async () => {
    if (!newChatMessage.trim() || !activeRoom) return;

    setChatLoading(true);
    try {
      await sendGroupMessage(activeRoom, user.id, newChatMessage);
      setNewChatMessage("");
    } catch (error) {
      console.error("Error sending chat message:", error);
    } finally {
      setChatLoading(false);
    }
  };

  const activeRoomData = rooms.find(room => room.id === activeRoom);

  const subjects = [
    "Elektrotechnik",
    "Programmierung",
    "Automatisierung",
    "Mechatronik",
    "Mathematik",
    "Physik",
    "Projektmanagement",
    "Sicherheit",
    "Qualitätssicherung",
    "Sonstiges"
  ];

  // KORREKTUR: Zeigt eine Ladeanzeige, während die Daten aus Firestore geladen werden.
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Lernräume werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Rooms Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Lernräume</h2>
            <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Neuen Lernraum erstellen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Raumname"
                    value={newRoomData.name}
                    onChange={(e) => setNewRoomData(prev => ({ ...prev, name: e.target.value }))}
                  />

                  <Textarea
                    placeholder="Beschreibung"
                    value={newRoomData.description}
                    onChange={(e) => setNewRoomData(prev => ({ ...prev, description: e.target.value }))}
                  />

                  <Select
                    value={newRoomData.subject}
                    onValueChange={(value) => setNewRoomData(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fachbereich auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Max. Teilnehmer:</label>
                    <Input
                      type="number"
                      min="2"
                      max="50"
                      value={newRoomData.maxParticipants}
                      onChange={(e) => setNewRoomData(prev => ({
                        ...prev,
                        maxParticipants: parseInt(e.target.value) || 10
                      }))}
                      className="w-20"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setShowCreateRoom(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleCreateRoom} disabled={loading}>
                      Erstellen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-sm text-muted-foreground">
            {rooms.length} {rooms.length === 1 ? 'Raum verfügbar' : 'Räume verfügbar'}
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto p-2">
            {rooms.map((room) => {
              const isParticipant = room.participants.includes(user.id);
              const isActive = activeRoom === room.id;

              return (
                <Card
                  key={room.id}
                  className={`mb-3 cursor-pointer transition-colors ${
                    isActive ? 'border-primary' : 'hover:border-muted-foreground/50'
                  }`}
                  onClick={() => isParticipant ? setActiveRoom(room.id) : handleJoinRoom(room.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm truncate">{room.name}</h3>
                      {room.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {room.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {room.participants.length}/{room.maxParticipants}
                        </span>
                      </div>

                      <Badge variant="secondary" className="text-xs">
                        {room.subject}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(room.createdAt), {
                          addSuffix: true,
                          locale: de
                        })}
                      </span>

                      {!isParticipant && (
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          Beitreten
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* KORREKTUR: Diese Nachricht wird nur angezeigt, wenn das Laden abgeschlossen ist UND keine Räume vorhanden sind. */}
            {rooms.length === 0 && !loading && (
              <div className="text-center py-8">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Noch keine Lernräume</p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowCreateRoom(true)}
                >
                  Ersten Raum erstellen
                </Button>
              </div>
            )}
        </div>
      </div>

      {/* Room Content */}
      <div className="flex-1 flex flex-col">
        {activeRoomData ? (
          <>
            {/* Room Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{activeRoomData.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {activeRoomData.participants.length} Teilnehmer • {activeRoomData.subject}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isLiveMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsLiveMode(!isLiveMode)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {isLiveMode ? 'Live beenden' : 'Live-Stream'}
                  </Button>

                  <Button
                    variant={isAudioOn ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setIsAudioOn(!isAudioOn)}
                  >
                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant={isVideoOn ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>

                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex">
              {isLiveMode ? (
                <div className="flex-1">
                  <LiveStreamRoom
                    roomId={activeRoomData.id}
                    roomTitle={activeRoomData.name}
                    roomDescription={activeRoomData.description}
                    isInstructor={activeRoomData.instructors.includes(user.id)}
                    onLeave={() => setIsLiveMode(false)}
                  />
                </div>
              ) : (
                <>
                  {/* Video/Whiteboard Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Video Grid */}
                    <div className="flex-1 bg-muted/20 p-4">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="col-span-2 bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Videokonferenz</h3>
                            <p className="text-muted-foreground mb-4">
                              Video-Chat wird geladen...
                            </p>
                            <div className="flex items-center gap-4 justify-center">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                    {user.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Sie</span>
                              </div>

                              {activeRoomData.participants.slice(1, 4).map((participantId) => (
                                <div key={participantId} className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                      {participantId.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">Teilnehmer</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Whiteboard Area */}
                    <div className="h-80 border-t border-border">
                      <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
                        <div className="flex items-center gap-2">
                          <PenTool className="h-4 w-4" />
                          <span className="text-sm font-medium">Interaktives Whiteboard</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Exportieren
                          </Button>
                          <Button variant="outline" size="sm">
                            Löschen
                          </Button>
                        </div>
                      </div>

                      <div className="h-full bg-white">
                        {activeRoomData && (
                          <InteractiveWhiteboard
                            roomId={activeRoomData.id}
                            isInstructor={activeRoomData.instructors.includes(user.id)}
                            participants={activeRoomData.participants}
                            onSave={(data) => {
                              console.log('Saving whiteboard data:', data);
                            }}
                            onShare={() => {
                              console.log('Sharing whiteboard');
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Side Panel */}
                  <div className="w-80 border-l border-border flex flex-col">
                    {/* Participants */}
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Teilnehmer ({activeRoomData.participants.length})
                      </h3>

                      <div className="space-y-2">
                        {activeRoomData.participants.map((participantId) => {
                          const isCurrentUser = participantId === user.id;
                          const isInstructor = activeRoomData.instructors.includes(participantId);

                          return (
                            <div key={participantId} className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                  {isCurrentUser ? user.avatar : participantId.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {isCurrentUser ? user.name : `Teilnehmer ${participantId.substring(0, 4)}`}
                                  {isCurrentUser && " (Sie)"}
                                </p>
                                {isInstructor && (
                                  <Badge variant="secondary" className="text-xs">
                                    Dozent
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chat */}
                    <div className="flex-1 flex flex-col">
                      <div className="p-3 border-b border-border">
                        <h3 className="font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Chat
                        </h3>
                      </div>

                      <div className="flex-1 p-3 overflow-y-auto">
                        <div className="space-y-3">
                          {chatMessages.length === 0 ? (
                            <div className="text-xs text-muted-foreground text-center py-4">
                              Noch keine Nachrichten
                            </div>
                          ) : (
                            chatMessages.map((message) => {
                              const isOwnMessage = message.senderId === user.id;
                              return (
                                <div key={message.id} className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                  {!isOwnMessage && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                        {message.senderAvatar}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}

                                  <div className={`max-w-xs rounded-lg px-3 py-2 ${
                                    isOwnMessage
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}>
                                    {!isOwnMessage && (
                                      <p className="text-xs font-medium mb-1">{message.senderName}</p>
                                    )}
                                    <p className="text-sm">{message.content}</p>
                                    <p className={`text-xs mt-1 ${
                                      isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                    }`}>
                                      {formatDistanceToNow(new Date(message.createdAt), {
                                        addSuffix: true,
                                        locale: de
                                      })}
                                    </p>
                                  </div>

                                  {isOwnMessage && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                        {user.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="p-3 border-t border-border">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nachricht schreiben..."
                            value={newChatMessage}
                            onChange={(e) => setNewChatMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendChatMessage();
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={handleSendChatMessage}
                            disabled={chatLoading || !newChatMessage.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="border-t border-border p-4">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Materialien
                      </h3>
                      <div className="space-y-2">
                         {/* Dynamische Ressourcenliste hier einfügen */}
                        <Button variant="ghost" size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Material hochladen
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Kein Lernraum ausgewählt</h3>
              <p className="text-muted-foreground mb-4">
                Wähle einen Lernraum aus oder erstelle einen neuen
              </p>
              <Button onClick={() => setShowCreateRoom(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Neuen Raum erstellen
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}