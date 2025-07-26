import { useState, useEffect } from "react";
import { User, PrivateMessage, getPrivateMessages, sendPrivateMessage, searchUsers } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Send,
  MessageSquare,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Check,
  CheckCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface MessagesProps {
  user: User;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function Messages({ user }: MessagesProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    // This would typically load from a conversations collection
    // For now, we'll use a mock implementation
    const mockConversations: Conversation[] = [
      {
        id: "conv1",
        name: "Maria Schmidt",
        avatar: "MS",
        lastMessage: "Super, danke für die Hilfe!",
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 2,
        isOnline: true
      },
      {
        id: "conv2", 
        name: "Thomas Müller",
        avatar: "TM",
        lastMessage: "Können wir morgen über das Projekt sprechen?",
        lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
        unreadCount: 0,
        isOnline: false
      },
      {
        id: "conv3",
        name: "Elena Rodriguez",
        avatar: "ER",
        lastMessage: "Hast du die Lösung für Aufgabe 3?",
        lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
        unreadCount: 1,
        isOnline: true
      }
    ];
    setConversations(mockConversations);
  };

  const loadMessages = async (conversationId: string) => {
    try {
      // For a real implementation, you'd need to map conversation IDs to user IDs
      const userId = conversationId === "conv1" ? "user1" : 
                   conversationId === "conv2" ? "user2" : "user3";
      
      const fetchedMessages = await getPrivateMessages(user.id, userId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    setLoading(true);
    try {
      const userId = activeConversation === "conv1" ? "user1" : 
                    activeConversation === "conv2" ? "user2" : "user3";
      
      await sendPrivateMessage(user.id, userId, newMessage);
      setNewMessage("");
      await loadMessages(activeConversation);
      await loadConversations(); // Update conversation list
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      try {
        const results = await searchUsers(term);
        setSearchResults(results.filter(u => u.id !== user.id));
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const startNewConversation = (selectedUser: User) => {
    // Add to conversations and switch to it
    const newConv: Conversation = {
      id: `conv_${selectedUser.id}`,
      name: selectedUser.name,
      avatar: selectedUser.avatar,
      unreadCount: 0,
      isOnline: selectedUser.status === 'online'
    };
    
    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv.id);
    setShowNewChat(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const activeConv = conversations.find(c => c.id === activeConversation);

  return (
    <div className="flex h-full bg-background">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Nachrichten</h2>
            <Button 
              size="sm" 
              onClick={() => setShowNewChat(!showNewChat)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {showNewChat && (
            <div className="space-y-3">
              <Input
                placeholder="Benutzer suchen..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
              
              {searchResults.length > 0 && (
                <ScrollArea className="max-h-40">
                  {searchResults.map((foundUser) => (
                    <div
                      key={foundUser.id}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => startNewConversation(foundUser)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {foundUser.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{foundUser.name}</p>
                        <p className="text-xs text-muted-foreground">{foundUser.email}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </div>
          )}
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 ${
                  activeConversation === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {conversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conversation.name}</p>
                    {conversation.lastMessageTime && (
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.lastMessageTime), { 
                          addSuffix: true, 
                          locale: de 
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage || "Noch keine Nachrichten"}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2 px-2 h-5 text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {activeConv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {activeConv.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activeConv.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {activeConv.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Noch keine Nachrichten</p>
                    <p className="text-sm text-muted-foreground">Sende die erste Nachricht!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.senderId === user.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                              {activeConv.avatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            isOwn ? 'justify-end' : 'justify-start'
                          }`}>
                            <p className={`text-xs ${
                              isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {formatDistanceToNow(new Date(message.createdAt), { 
                                addSuffix: true, 
                                locale: de 
                              })}
                            </p>
                            {isOwn && (
                              <div className="text-primary-foreground/70">
                                {message.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {isOwn && (
                          <Avatar className="h-8 w-8">
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
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Nachricht schreiben..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={loading || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Keine Unterhaltung ausgewählt</h3>
              <p className="text-muted-foreground">
                Wähle eine Unterhaltung aus oder starte eine neue
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}