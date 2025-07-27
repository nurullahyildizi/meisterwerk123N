import { useState, useRef, useEffect } from "react";
import { User } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User as UserIcon, 
  Lightbulb, 
  BookOpen, 
  Target, 
  Clock,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  HelpCircle,
  Zap,
  Brain
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'course-recommendation' | 'quiz-help';
  metadata?: {
    courseId?: string;
    lessonId?: string;
    confidence?: number;
  };
}

interface LearningAssistantProps {
  user: User;
}

export default function LearningAssistant({ user }: LearningAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hallo ${user.name.split(' ')[0]}! 👋 Ich bin Ihr persönlicher KI-Lernassistent. Ich kann Ihnen bei Ihren Elektrotechnik-Kursen helfen, Fragen beantworten und personalisierte Lernempfehlungen geben. Wie kann ich Ihnen heute helfen?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // KI-Antworten basierend auf Eingabe
  const getAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Verschiedene Kategorien von Antworten
    if (lowerMessage.includes('ohm') || lowerMessage.includes('widerstand') || lowerMessage.includes('spannung') || lowerMessage.includes('strom')) {
      return {
        id: Date.now().toString(),
        content: `Das Ohm'sche Gesetz ist fundamental! 🔋 **U = R × I**\n\n📝 **Erklärung:**\n• U = Spannung (Volt)\n• R = Widerstand (Ohm) \n• I = Strom (Ampere)\n\n💡 **Merkhilfe:** "Uri ist ein Riese" - U gleich R mal I!\n\nMöchten Sie eine praktische Übung dazu machen? Ich kann Ihnen eine passende Lektion empfehlen!`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: { confidence: 0.95 }
      };
    }
    
    if (lowerMessage.includes('sps') || lowerMessage.includes('programmierung') || lowerMessage.includes('steuerung')) {
      return {
        id: Date.now().toString(),
        content: `Excellent! SPS-Programmierung ist sehr spannend! 🤖\n\n**Was ist eine SPS?**\n• **S**peicher**p**rogrammierbare **S**teuerung\n• Industrieller Computer für Automatisierung\n• Ersetzt klassische Relais-Steuerungen\n\n🔧 **Programmiersprachen:**\n• KOP (Kontaktplan)\n• FUP (Funktionsplan) \n• AWL (Anweisungsliste)\n• ST (Strukturierter Text)\n\nBasierend auf Ihrem Fortschritt empfehle ich die nächste SPS-Lektion über digitale Ein-/Ausgänge!`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'course-recommendation',
        metadata: { courseId: '2', confidence: 0.92 }
      };
    }
    
    if (lowerMessage.includes('photovoltaik') || lowerMessage.includes('solar') || lowerMessage.includes('pv')) {
      return {
        id: Date.now().toString(),
        content: `Photovoltaik - die Zukunft der Energie! ☀️\n\n**Grundprinzip:**\n• Photonen treffen auf Halbleiter\n• Elektronen werden freigesetzt\n• Gleichstrom entsteht\n• Wechselrichter wandelt DC→AC\n\n📊 **Wirkungsgrade:**\n• Monokristallin: 20-22% ⭐\n• Polykristallin: 16-18% 🔹\n• Dünnschicht: 8-12% 📱\n\n🎯 Ihre Erfolgsrate bei erneuerbaren Energien liegt bei 87%! Perfekt für fortgeschrittene PV-Themen.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: { confidence: 0.89 }
      };
    }
    
    if (lowerMessage.includes('hilfe') || lowerMessage.includes('help') || lowerMessage.includes('was kannst du')) {
      return {
        id: Date.now().toString(),
        content: `Ich bin Ihr intelligenter Lernpartner! 🚀 Hier sind meine Fähigkeiten:\n\n🎓 **Lernhilfe:**\n• Elektrotechnik-Konzepte erklären\n• Formeln und Berechnungen\n• Praktische Beispiele geben\n\n📚 **Kursempfehlungen:**\n• Personalisierte Lernpfade\n• Nächste optimale Schritte\n• Schwachstellen identifizieren\n\n⏰ **Lernoptimierung:**\n• Beste Lernzeiten vorschlagen\n• Fortschritt analysieren\n• Motivation steigern\n\n💬 **Einfach fragen:**\n"Erkläre mir das Ohm'sche Gesetz"\n"Was soll ich als nächstes lernen?"\n"Hilfe bei SPS-Programmierung"`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: { confidence: 1.0 }
      };
    }
    
    if (lowerMessage.includes('nächster') || lowerMessage.includes('empfehlung') || lowerMessage.includes('weiter')) {
      return {
        id: Date.now().toString(),
        content: `Basierend auf Ihrer Lernanalyse empfehle ich: 🎯\n\n**Priorität 1:** VDE 0100 Vertiefung\n• ✅ Ihre Elektrotechnik-Erfolgsrate: 94%\n• ⏰ Optimale Zeit: 14:00-15:00\n• 🎲 Erfolgswahrscheinlichkeit: 92%\n\n**Priorität 2:** SPS Praktische Übungen\n• ⚡ Wissenslücke bei digitalen Schaltungen\n• 🛠️ Hands-on Programmierung\n• 📈 +67% Verständnis durch Praxis\n\n**Priorität 3:** Interaktive Simulation\n• 🎮 Spielerisches Lernen\n• 🧠 Verbessert Retention um 45%\n\nWelche Empfehlung interessiert Sie am meisten?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion',
        metadata: { confidence: 0.96 }
      };
    }
    
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('prüfung')) {
      return {
        id: Date.now().toString(),
        content: `Perfekt! Tests sind der beste Weg zu lernen! 📝\n\n**Ihr aktueller Stand:**\n• Elektrotechnik-Quiz: 87% ✅\n• SPS-Grundlagen: 73% 📈\n• Photovoltaik: Noch nicht absolviert ⏳\n\n🎯 **Empfehlung:**\nStarten Sie mit einem kurzen Ohm'sches Gesetz Quiz (5 Min.)\n\n**Beispiel-Frage:**\n"Ein Widerstand von 10Ω wird mit 20V betrieben. Wie groß ist der Strom?"\n\nA) 1A  B) 2A  C) 5A  D) 200A\n\n💡 **Tipp:** I = U/R = 20V/10Ω = 2A\n\nMöchten Sie das vollständige Quiz starten?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'quiz-help',
        metadata: { confidence: 0.88 }
      };
    }
    
    // Standardantwort für unbekannte Anfragen
    return {
      id: Date.now().toString(),
      content: `Interessante Frage! 🤔 Ich lerne ständig dazu, um Ihnen besser zu helfen.\n\n**Meine Spezialgebiete:**\n• Elektrotechnik-Grundlagen\n• SPS-Programmierung  \n• Photovoltaik & Erneuerbare Energien\n• VDE-Bestimmungen\n• Lernstrategien & -optimierung\n\nKönnen Sie Ihre Frage spezifischer stellen? Zum Beispiel:\n"Erkläre mir Reihenschaltungen"\n"Wie funktioniert eine SPS?"\n"Was sind die besten Lernzeiten?"\n\nIch bin hier, um zu helfen! 💪`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      metadata: { confidence: 0.7 }
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // User-Nachricht hinzufügen
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuliere KI-Verarbeitung
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 Sekunden
  };

  const quickSuggestions = [
    "Erkläre das Ohm'sche Gesetz",
    "Was soll ich als nächstes lernen?",
    "Hilfe bei SPS-Programmierung",
    "Quiz starten",
    "Beste Lernzeit?"
  ];

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 shadow-2xl border-primary/20 z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-blue-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">KI-Lernassistent</CardTitle>
              <CardDescription className="text-xs">Powered by AI • Online</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={message.sender === 'user' ? 'bg-primary text-white' : 'bg-blue-500 text-white'}>
                        {message.sender === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-white' 
                        : message.type === 'suggestion'
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 dark:from-green-950/50 dark:to-emerald-950/50'
                          : message.type === 'course-recommendation'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 dark:from-blue-950/50 dark:to-indigo-950/50'
                            : 'bg-muted'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      
                      {message.type === 'suggestion' && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Empfehlung befolgen
                          </Button>
                        </div>
                      )}
                      
                      {message.type === 'course-recommendation' && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Kurs öffnen
                          </Button>
                        </div>
                      )}
                      
                      {message.type === 'quiz-help' && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <HelpCircle className="h-3 w-3 mr-1" />
                            Quiz starten
                          </Button>
                        </div>
                      )}
                      
                      {message.metadata?.confidence && message.sender === 'ai' && (
                        <div className="mt-2 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">
                            KI-Vertrauen: {Math.round(message.metadata.confidence * 100)}%
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-2 text-xs text-muted-foreground opacity-50">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0ms]"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:150ms]"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:300ms]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t">
              <div className="text-xs text-muted-foreground mb-2">💡 Schnellvorschläge:</div>
              <div className="flex flex-wrap gap-1">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setInputMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Fragen Sie mich alles über Elektrotechnik..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}