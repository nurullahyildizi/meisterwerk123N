import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download,
  Share,
  Save,
  RotateCcw,
  Users,
  Settings,
  Maximize,
  Minimize,
  MoreHorizontal
} from "lucide-react";
import { useState } from 'react';

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
  const [isCollaborativeMode, setIsCollaborativeMode] = useState(true);

  const handleExportImage = () => {
    // This would export the whiteboard as an image
    console.log('Exporting whiteboard as image...');
  };

  const handleExportPDF = () => {
    // This would export the whiteboard as a PDF
    console.log('Exporting whiteboard as PDF...');
  };

  const handleSaveTemplate = () => {
    // This would save the current whiteboard as a template
    console.log('Saving whiteboard as template...');
  };

  const handleClearBoard = () => {
    // This would clear the whiteboard
    console.log('Clearing whiteboard...');
  };

  // Custom UI components for educational use
  const customComponents = {
    // Custom toolbar with educational tools
  };

  return (
    <div className={`relative bg-white rounded-lg border ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Whiteboard Controls */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Card className="p-2">
          <div className="flex items-center gap-1">
            {/* Collaboration indicator */}
            <div className="flex items-center gap-1 mr-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">
                {participants.length} online
              </span>
            </div>

            {/* Export buttons */}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleExportImage}
              title="Als Bild exportieren"
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleExportPDF}
              title="Als PDF exportieren"
            >
              <Share className="h-4 w-4" />
            </Button>

            {isInstructor && (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleSaveTemplate}
                  title="Als Vorlage speichern"
                >
                  <Save className="h-4 w-4" />
                </Button>

                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleClearBoard}
                  title="Whiteboard löschen"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </>
            )}

            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Vollbild verlassen" : "Vollbild"}
            >
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

      {/* Quick Tools Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="p-2">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              📝 Text
            </Button>
            <Button size="sm" variant="outline">
              📐 Formen
            </Button>
            <Button size="sm" variant="outline">
              📊 Diagramm
            </Button>
            <Button size="sm" variant="outline">
              🖼️ Bild
            </Button>
            <Button size="sm" variant="outline">
              📌 Post-it
            </Button>
          </div>
        </Card>
      </div>

      {/* TLDraw Whiteboard */}
      <div className="h-full">
        <Tldraw
          persistenceKey={`whiteboard-${roomId}`}
          onMount={(editor) => {
            // Configure editor for collaborative use
            try {
              editor.updateInstanceState({
                isDebugMode: false,
                isReadonly: false,
              });
              
              // Set default tool
              editor.setCurrentTool('draw');
            } catch (error) {
              console.log('Editor configuration error:', error);
            }
          }}
          autoFocus={false}
        />
      </div>

      {/* Educational Templates Overlay (when activated) */}
      <div className="hidden absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
        <Card className="w-96 p-6">
          <h3 className="text-lg font-semibold mb-4">Vorlagen für Elektrotechnik</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">⚡</span>
              <span className="text-xs">Schaltplan</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🔧</span>
              <span className="text-xs">Mindmap</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-xs">Diagramm</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📐</span>
              <span className="text-xs">Geometrie</span>
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="flex-1">Vorlage laden</Button>
            <Button variant="outline">Abbrechen</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}