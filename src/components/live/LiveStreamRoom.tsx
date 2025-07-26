import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import VideoPlayer, { LiveChatPanel } from '@/components/video/VideoPlayer';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Users, 
  MessageSquare, 
  Settings, 
  Phone,
  PhoneOff,
  Hand,
  MoreVertical,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Circle,
  StopCircle,
  Share,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isInstructor: boolean;
  isMuted: boolean;
  hasVideo: boolean;
  hasHandRaised: boolean;
  joinedAt: Date;
}

interface LiveStreamRoomProps {
  roomId: string;
  roomTitle: string;
  roomDescription?: string;
  isInstructor?: boolean;
  onLeave: () => void;
}

export default function LiveStreamRoom({ 
  roomId, 
  roomTitle, 
  roomDescription,
  isInstructor = false,
  onLeave 
}: LiveStreamRoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker' | 'presentation'>('speaker');

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Prof. Dr. Weber',
      isInstructor: true,
      isMuted: false,
      hasVideo: true,
      hasHandRaised: false,
      joinedAt: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Anna Müller',
      isInstructor: false,
      isMuted: true,
      hasVideo: true,
      hasHandRaised: false,
      joinedAt: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Thomas Klein',
      isInstructor: false,
      isMuted: true,
      hasVideo: false,
      hasHandRaised: true,
      joinedAt: new Date(Date.now() - 3 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Lisa Schmidt',
      isInstructor: false,
      isMuted: true,
      hasVideo: true,
      hasHandRaised: false,
      joinedAt: new Date(Date.now() - 1 * 60 * 1000)
    }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: '1', user: 'Prof. Dr. Weber', message: 'Willkommen zur Live-Vorlesung über Elektrotechnik!', time: '14:30' },
    { id: '2', user: 'Anna Müller', message: 'Vielen Dank! Freue mich auf die Session.', time: '14:31' },
    { id: '3', user: 'Thomas Klein', message: 'Können Sie das Mikrofon bitte lauter stellen?', time: '14:32' },
    { id: '4', user: 'Prof. Dr. Weber', message: 'Ist es jetzt besser zu hören?', time: '14:33' },
    { id: '5', user: 'Lisa Schmidt', message: 'Ja, perfekt!', time: '14:33' }
  ]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize media stream
  useEffect(() => {
    if (isConnected && isVideoOn) {
      navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: isAudioOn 
      }).then(mediaStream => {
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      }).catch(error => {
        console.error('Error accessing media devices:', error);
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isConnected, isVideoOn, isAudioOn]);

  const handleConnect = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoOn, 
        audio: isAudioOn 
      });
      setStream(mediaStream);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting to stream:', error);
      alert('Fehler beim Zugriff auf Kamera/Mikrofon. Bitte überprüfen Sie Ihre Berechtigungen.');
    }
  };

  const handleDisconnect = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsConnected(false);
    onLeave();
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
    setIsAudioOn(!isAudioOn);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
        });
        // Replace video track with screen share
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error starting screen share:', error);
      }
    } else {
      setIsScreenSharing(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In real implementation, start/stop recording
  };

  const handleRaiseHand = () => {
    setHandRaised(!handRaised);
    // Send signal to instructor
  };

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: 'Sie',
      message,
      time: new Date().toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/live-room/${roomId}`;
    navigator.clipboard.writeText(link);
    // Show toast notification
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Live-Stream beitreten</CardTitle>
            <p className="text-muted-foreground">{roomTitle}</p>
            {roomDescription && (
              <p className="text-sm text-muted-foreground mt-2">{roomDescription}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <CameraOff className="h-12 w-12 mx-auto mb-2" />
                    <p>Kamera ist ausgeschaltet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant={isVideoOn ? "default" : "secondary"}
                size="icon"
                onClick={toggleVideo}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isAudioOn ? "default" : "secondary"}
                size="icon"
                onClick={toggleAudio}
              >
                {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </div>

            {/* Join Button */}
            <Button onClick={handleConnect} className="w-full" size="lg">
              <Video className="h-4 w-4 mr-2" />
              Live-Stream beitreten
            </Button>

            <div className="text-center">
              <Button variant="ghost" onClick={onLeave}>
                Zurück
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">{roomTitle}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="destructive" className="animate-pulse">
                  <div className="h-2 w-2 bg-white rounded-full mr-2"></div>
                  LIVE
                </Badge>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {participants.length} Teilnehmer
                </span>
                {isRecording && (
                  <span className="flex items-center gap-1 text-red-600">
                    <Circle className="h-3 w-3 fill-red-600" />
                    Aufzeichnung läuft
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={copyRoomLink}>
                <Share className="h-4 w-4 mr-2" />
                Teilen
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4">
          {viewMode === 'speaker' && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Speaker */}
              <div className="lg:col-span-3">
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  {isScreenSharing ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                      <div className="text-center">
                        <Monitor className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-xl font-semibold">Bildschirmfreigabe</p>
                        <p className="text-muted-foreground">Prof. Dr. Weber teilt seinen Bildschirm</p>
                      </div>
                    </div>
                  ) : (
                    <video
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      poster="/api/placeholder/800/600"
                    />
                  )}
                  
                  {/* Speaker Info */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black/70 text-white">
                      Prof. Dr. Weber
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Participant Grid */}
              <div className="space-y-4">
                {participants.slice(0, 4).map((participant) => (
                  <div key={participant.id} className="aspect-video bg-black rounded-lg overflow-hidden relative">
                    {participant.hasVideo ? (
                      <video
                        autoPlay
                        playsInline
                        muted={participant.isMuted}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    
                    {/* Participant Info */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {participant.name}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {participant.hasHandRaised && (
                          <Hand className="h-3 w-3 text-yellow-500" />
                        )}
                        {participant.isMuted ? (
                          <MicOff className="h-3 w-3 text-red-500" />
                        ) : (
                          <Mic className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="h-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {participants.map((participant) => (
                <div key={participant.id} className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  {participant.hasVideo ? (
                    <video
                      autoPlay
                      playsInline
                      muted={participant.isMuted}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  
                  {/* Participant Info */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <Badge variant="secondary">
                      {participant.name}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {participant.hasHandRaised && (
                        <Hand className="h-3 w-3 text-yellow-500" />
                      )}
                      {participant.isMuted ? (
                        <MicOff className="h-3 w-3 text-red-500" />
                      ) : (
                        <Mic className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="icon"
                onClick={toggleAudio}
              >
                {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="icon"
                onClick={toggleVideo}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>

              {isInstructor && (
                <>
                  <Button
                    variant={isScreenSharing ? "default" : "outline"}
                    size="icon"
                    onClick={toggleScreenShare}
                  >
                    {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    onClick={toggleRecording}
                  >
                    {isRecording ? <StopCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </Button>
                </>
              )}

              {!isInstructor && (
                <Button
                  variant={handRaised ? "default" : "outline"}
                  size="icon"
                  onClick={handleRaiseHand}
                >
                  <Hand className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'speaker' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('speaker')}
                >
                  Speaker
                </Button>
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
              </div>

              <Button
                variant="destructive"
                onClick={handleDisconnect}
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                Verlassen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-border bg-card flex flex-col">
        {/* Tabs */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-2">
            <Button
              variant={showParticipants ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setShowParticipants(true);
                setShowChat(false);
              }}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Teilnehmer ({participants.length})
            </Button>
            <Button
              variant={showChat ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setShowChat(true);
                setShowParticipants(false);
              }}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {showParticipants && (
            <div className="p-4 space-y-3 overflow-y-auto h-full">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {participant.name}
                      </span>
                      {participant.isInstructor && (
                        <Badge variant="secondary" className="text-xs">Dozent</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Beigetreten um {participant.joinedAt.toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {participant.hasHandRaised && (
                      <Hand className="h-3 w-3 text-yellow-500" />
                    )}
                    {participant.isMuted ? (
                      <MicOff className="h-3 w-3 text-red-500" />
                    ) : (
                      <Mic className="h-3 w-3 text-green-500" />
                    )}
                    {!participant.hasVideo && (
                      <VideoOff className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showChat && (
            <LiveChatPanel
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              className="h-full border-0 shadow-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}