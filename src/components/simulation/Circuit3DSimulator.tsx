import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CircuitBoard, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Eye,
  Activity,
  Info,
  Zap,
  Gauge,
  Lightbulb,
  Battery
} from "lucide-react";

interface CircuitComponent {
  id: string;
  type: 'battery' | 'resistor' | 'led';
  x: number;
  y: number;
  value?: number;
  unit?: string;
  current?: number;
  voltage?: number;
  power?: number;
  isOn?: boolean;
}

interface Circuit3DSimulatorProps {
  circuitType?: 'series' | 'parallel';
  lessonId?: string;
}

export default function Circuit3DSimulator({ circuitType = 'series', lessonId }: Circuit3DSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(true);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [components, setComponents] = useState<CircuitComponent[]>([]);

  useEffect(() => {
    initializeCircuit();
  }, [circuitType]);

  const initializeCircuit = () => {
    if (circuitType === 'series') {
      setComponents([
        { id: 'battery1', type: 'battery', x: -150, y: 0, value: 12, unit: 'V' },
        { id: 'resistor1', type: 'resistor', x: -50, y: 0, value: 100, unit: 'Ω' },
        { id: 'resistor2', type: 'resistor', x: 50, y: 0, value: 200, unit: 'Ω' },
        { id: 'led1', type: 'led', x: 150, y: 0 }
      ]);
    } else {
      setComponents([
        { id: 'battery1', type: 'battery', x: -150, y: 0, value: 12, unit: 'V' },
        { id: 'resistor1', type: 'resistor', x: 50, y: -30, value: 100, unit: 'Ω' },
        { id: 'resistor2', type: 'resistor', x: 50, y: 30, value: 200, unit: 'Ω' }
      ]);
    }
  };

  const handleSimulation = () => {
    setIsSimulating(!isSimulating);
    if (!isSimulating) {
      calculateCircuitValues();
    }
  };

  const calculateCircuitValues = () => {
    const battery = components.find(c => c.type === 'battery');
    if (!battery || !battery.value) return;

    const updatedComponents = components.map(comp => {
      if (comp.type === 'battery') {
        return { ...comp, voltage: comp.value, current: 0.1 };
      } else if (comp.type === 'resistor' && comp.value) {
        const current = (battery.value || 0) / (comp.value || 1);
        const power = current * current * comp.value;
        return { ...comp, current, voltage: current * comp.value, power };
      } else if (comp.type === 'led') {
        return { ...comp, current: 0.02, voltage: 2.1, isOn: true };
      }
      return comp;
    });

    setComponents(updatedComponents);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    initializeCircuit();
    setSelectedComponent(null);
  };

  const updateComponentValue = (id: string, value: number) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, value } : comp
    ));
    if (isSimulating) {
      calculateCircuitValues();
    }
  };

  const renderComponent = (component: CircuitComponent) => {
    const isSelected = selectedComponent === component.id;
    const baseStyle = {
      position: 'absolute' as const,
      left: `calc(50% + ${component.x}px)`,
      top: `calc(50% + ${component.y}px)`,
      transform: `translate(-50%, -50%) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`,
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    };

    const glowEffect = isSimulating && (component.type === 'led' || component.type === 'battery') ? {
      filter: 'drop-shadow(0 0 10px #3b82f6)',
      animation: 'pulse 2s infinite'
    } : {};

    switch (component.type) {
      case 'battery':
        return (
          <div
            key={component.id}
            style={{ ...baseStyle, ...glowEffect }}
            onClick={() => setSelectedComponent(component.id)}
            className={`w-16 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-md border-2 ${isSelected ? 'border-yellow-400' : 'border-gray-300'} shadow-lg hover:shadow-xl relative`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Battery className="h-6 w-6 text-white" />
            </div>
            {showValues && (
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <Badge variant="secondary" className="text-xs">
                  {component.value}{component.unit}
                </Badge>
              </div>
            )}
          </div>
        );

      case 'resistor':
        return (
          <div
            key={component.id}
            style={{ ...baseStyle }}
            onClick={() => setSelectedComponent(component.id)}
            className={`w-20 h-6 bg-gradient-to-r from-amber-200 to-amber-300 rounded-full border-2 ${isSelected ? 'border-yellow-400' : 'border-gray-400'} shadow-lg hover:shadow-xl relative overflow-hidden`}
          >
            {showValues && (
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <Badge variant="secondary" className="text-xs">
                  {component.value}{component.unit}
                </Badge>
              </div>
            )}
          </div>
        );

      case 'led':
        return (
          <div
            key={component.id}
            style={{ ...baseStyle }}
            onClick={() => setSelectedComponent(component.id)}
            className={`w-8 h-8 rounded-full border-2 ${isSelected ? 'border-yellow-400' : 'border-gray-400'} shadow-lg hover:shadow-xl relative ${!isSimulating || !component.isOn ? 'bg-red-200' : 'bg-red-500'}`}
          >
            <div className="absolute inset-1 rounded-full bg-gradient-to-b from-red-300 to-red-500 flex items-center justify-center">
              <Lightbulb className="h-3 w-3 text-white" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedComp = components.find(c => c.id === selectedComponent);

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="simulator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simulator">3D Simulator</TabsTrigger>
          <TabsTrigger value="controls">Steuerung</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simulator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircuitBoard className="h-5 w-5" />
                Interaktive 3D-Schaltungssimulation
                <Badge variant="secondary">
                  {circuitType === 'series' ? 'Reihenschaltung' : 'Parallelschaltung'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Experimentieren Sie mit elektrischen Schaltungen in einer immersiven 3D-Umgebung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Button onClick={handleSimulation} className="flex items-center gap-2">
                  {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isSimulating ? 'Pausieren' : 'Simulation starten'}
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Zurücksetzen
                </Button>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <Label className="text-sm">Werte anzeigen</Label>
                  <input 
                    type="checkbox" 
                    checked={showValues} 
                    onChange={(e) => setShowValues(e.target.checked)}
                    className="rounded"
                  />
                </div>
              </div>

              <div 
                className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-slate-600 overflow-hidden"
                style={{ perspective: '1000px' }}
              >
                <div className="absolute inset-0">
                  {components.map(renderComponent)}
                </div>
                
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="h-4 w-4" />
                      <span>3D-Steuerung</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-300">Rotation X: {rotationX}°</Label>
                        <Slider
                          value={[rotationX]}
                          onValueChange={(value) => setRotationX(value[0])}
                          max={90}
                          min={-90}
                          step={5}
                          className="w-20"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Zoom: {zoom.toFixed(1)}x</Label>
                        <Slider
                          value={[zoom]}
                          onValueChange={(value) => setZoom(value[0])}
                          max={2}
                          min={0.5}
                          step={0.1}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {isSimulating && (
                  <div className="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur-sm rounded-lg p-3 text-white">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 animate-pulse" />
                      <span className="text-sm font-medium">Simulation läuft</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Komponenten-Editor</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedComp ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedComp.type}</Badge>
                    <span className="font-medium">{selectedComp.id}</span>
                  </div>
                  
                  {selectedComp.type === 'battery' && (
                    <div>
                      <Label>Spannung (V)</Label>
                      <Input
                        type="number"
                        value={selectedComp.value || 0}
                        onChange={(e) => updateComponentValue(selectedComp.id, parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  {selectedComp.type === 'resistor' && (
                    <div>
                      <Label>Widerstand (Ω)</Label>
                      <Input
                        type="number"
                        value={selectedComp.value || 0}
                        onChange={(e) => updateComponentValue(selectedComp.id, parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Klicken Sie auf eine Komponente, um sie zu bearbeiten.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schaltungsanalyse</CardTitle>
            </CardHeader>
            <CardContent>
              {isSimulating ? (
                <div className="space-y-4">
                  {components.map((comp) => (
                    <div key={comp.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{comp.id}</span>
                        <Badge variant="outline">{comp.type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {comp.voltage && (
                          <div className="flex justify-between">
                            <span>Spannung:</span>
                            <span className="font-mono">{comp.voltage.toFixed(2)}V</span>
                          </div>
                        )}
                        {comp.current && (
                          <div className="flex justify-between">
                            <span>Strom:</span>
                            <span className="font-mono">{comp.current.toFixed(3)}A</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Starten Sie die Simulation, um Messwerte zu sehen.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}