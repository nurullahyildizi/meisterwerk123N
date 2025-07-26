import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
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
  Radio,
  Users,
  MessageSquare,
  Heart,
  Download,
  Share
} from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
  description?: string;
  isLive?: boolean;
  chatEnabled?: boolean;
  viewers?: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  startTime?: number;
  className?: string;
}

export default function VideoPlayer({
  url,
  title,
  description,
  isLive = false,
  chatEnabled = false,
  viewers = 0,
  onProgress,
  onComplete,
  autoPlay = false,
  startTime = 0,
  className = ""
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [liked, setLiked] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: '1', user: 'Anna M.', message: 'Sehr interessanter Kurs!', time: '14:32' },
    { id: '2', user: 'Thomas K.', message: 'Kann jemand die Formel nochmal erklären?', time: '14:33' },
    { id: '3', user: 'Lisa S.', message: 'Danke für die ausführliche Erklärung!', time: '14:34' },
  ]);

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
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${
        fullscreen ? 'fixed inset-0 z-50' : 'aspect-video'
      } ${className}`}
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

      {/* Live Stream Badge */}
      {isLive && (
        <div className="absolute top-4 left-4 z-20">
          <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">
            <Radio className="h-3 w-3 mr-1" />
            LIVE
          </Badge>
        </div>
      )}

      {/* Viewer Count */}
      {isLive && viewers > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="secondary" className="bg-black/70 text-white">
            <Users className="h-3 w-3 mr-1" />
            {viewers.toLocaleString()} Zuschauer
          </Badge>
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
        {/* Progress Bar */}
        {!isLive && (
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
            </div>
            <div className="flex justify-between text-xs text-white/80 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

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

            {/* Skip Buttons (not for live) */}
            {!isLive && (
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
            )}

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

            {/* Time Display */}
            <span className="text-white/80 text-sm hidden md:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback Speed */}
            {!isLive && (
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
            )}

            {/* Quality */}
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1 focus:outline-none focus:border-white/40"
            >
              <option value="auto" className="bg-black">Auto</option>
              <option value="1080p" className="bg-black">1080p</option>
              <option value="720p" className="bg-black">720p</option>
              <option value="480p" className="bg-black">480p</option>
            </select>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLiked(!liked)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <Share className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>

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
      </div>
    </div>
  );
}

// Live Chat Component
export function LiveChatPanel({ 
  messages, 
  onSendMessage,
  className = "" 
}: {
  messages: Array<{ id: string; user: string; message: string; time: string }>;
  onSendMessage: (message: string) => void;
  className?: string;
}) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Live Chat
        </h3>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-primary">{msg.user}</span>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-foreground break-words">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nachricht eingeben..."
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={200}
          />
          <Button type="submit" size="sm" disabled={!input.trim()}>
            Senden
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}