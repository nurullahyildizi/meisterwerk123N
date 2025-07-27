import { Tldraw, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download,
  Save,
  Users,
  Maximize,
  Minimize,
  Trash2,
  MousePointer2 // Icon für den Laserpointer
} from "lucide-react";
import { useState, useRef, useEffect } from 'react';

// Eine innere Komponente, um Zugriff auf den Editor-Hook zu haben
const WhiteboardUI = ({ isInstructor, participants, isFullscreen, onToggleFullscreen }: { 
    isInstructor: boolean, 
    participants: string[],
    isFullscreen: boolean,
    onToggleFullscreen: () => void 
}) => {
  const editor = useEditor();

  // Funktion zum Herunterladen von Daten als Datei
  const downloadFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportImage = async () => {
    if (!editor) return;
    console.log('Exporting whiteboard as SVG...');
    try {
        const shapes = editor.currentPageShapes;
        if (!shapes || shapes.length === 0) {
            console.log("No shapes to export.");
            return;
        }
        const shapeIds = shapes.map(shape => shape.id);
        const svg = await editor.getSvg(shapeIds, {
            scale: 1,
            background: true,
            padding: 16,
        });
        if (svg) {
            downloadFile(svg.outerHTML, 'whiteboard-export.svg', 'image/svg+xml');
        }
    } catch (error) {
        console.error("Error exporting SVG:", error);
    }
  };

  const handleClearBoard = () => {
    if (!editor) return;
    console.log('Clearing whiteboard...');
    const shapes = editor.currentPageShapes;
    if (shapes && shapes.length > 0) {
        const shapeIds = shapes.map(shape => shape.id);
        editor.deleteShapes(shapeIds);
    } else {
        console.log("No shapes to clear.");
    }
  };

  const handleSaveTemplate = () => {
    if (!editor) return;
    console.log('Saving whiteboard as template...');
    // Logik zum Speichern als Vorlage: const snapshot = editor.store.getSnapshot();
  };

  const activateLaserPointer = () => {
    if (!editor) return;
    editor.setCurrentTool('laser');
  };

  return (
    <>
      {/* Whiteboard Controls */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Card className="p-2">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 mr-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">
                {participants.length} online
              </span>
            </div>

            {/* NEUE SCHALTFLÄCHE für den Laserpointer */}
            <Button size="sm" variant="ghost" onClick={activateLaserPointer} title="Laserpointer aktivieren">
              <MousePointer2 className="h-4 w-4" />
            </Button>

            <Button size="sm" variant="ghost" onClick={handleExportImage} title="Als Bild exportieren">
              <Download className="h-4 w-4" />
            </Button>

            {isInstructor && (
              <>
                <Button size="sm" variant="ghost" onClick={handleSaveTemplate} title="Als Vorlage speichern">
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleClearBoard} title="Whiteboard löschen">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}

            <Button size="sm" variant="ghost" onClick={onToggleFullscreen} title={isFullscreen ? "Vollbild verlassen" : "Vollbild"}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </div>

      {/* Active Collaborators */}
      <div className="absolute top-2 left-2 z-10">
        <Card className="p-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {participants.slice(0, 5).map((participant, index) => (
                <div
                  key={participant}
                  className="w-6 h-6 rounded-full bg-primary border-2 border-white flex items-center justify-center text-xs text-primary-foreground font-medium"
                  style={{ 
                    backgroundColor: `hsl(${index * 60}, 60%, 50%)`,
                    zIndex: participants.length - index 
                  }}
                >
                  {participant.substring(0, 1).toUpperCase()}
                </div>
              ))}
              {participants.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs text-muted-foreground font-medium">
                  +{participants.length - 5}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}


interface InteractiveWhiteboardProps {
  roomId: string;
  isInstructor?: boolean;
  participants?: string[];
  onSave?: (data: any) => void;
  onShare?: () => void;
}

export default function InteractiveWhiteboard({ 
  roomId, 
  isInstructor = false,
  participants = [],
  onSave,
  onShare 
}: InteractiveWhiteboardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const whiteboardContainerRef = useRef<HTMLDivElement>(null);

  // Synchronisiert den State mit dem echten Vollbildstatus des Browsers
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Verwendet die native Fullscreen API des Browsers
  const toggleFullscreen = () => {
    if (!whiteboardContainerRef.current) return;

    if (!document.fullscreenElement) {
      whiteboardContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    // Das ref wird an diesen Container gebunden
    <div ref={whiteboardContainerRef} className="relative bg-white rounded-lg border h-full w-full">
      <Tldraw
        persistenceKey={`whiteboard-${roomId}`}
        onMount={(editor) => {
          try {
            editor.updateInstanceState({
              isDebugMode: false,
              isReadonly: !isInstructor,
            });
            editor.setCurrentTool('draw');
          } catch (error) {
            console.log('Editor configuration error:', error);
          }
        }}
        autoFocus={false}
      >
          <WhiteboardUI 
              isInstructor={isInstructor} 
              participants={participants}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
          />
      </Tldraw>
    </div>
  );
}
