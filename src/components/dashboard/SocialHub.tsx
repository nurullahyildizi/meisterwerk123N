import { useState, useEffect } from "react";
import { User, SocialPost, createPost, getPosts, likePost, unlikePost, addComment } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart,
  MessageCircle,
  Share2,
  Send,
  Image as ImageIcon,
  Trophy,
  BookOpen,
  HelpCircle,
  Lightbulb,
  MoreHorizontal,
  Smile
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface SocialHubProps {
  user: User;
}

export default function SocialHub({ user }: SocialHubProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState<SocialPost['type']>("text");
  const [loading, setLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [postId: string]: boolean }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await getPosts(50);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    setLoading(true);
    try {
      await createPost(user.id, newPostContent, newPostType);
      setNewPostContent("");
      await loadPosts(); // Refresh posts
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikePost(postId, user.id);
      } else {
        await likePost(postId, user.id);
      }
      await loadPosts(); // Refresh posts
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComment = async (postId: string) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;

    try {
      await addComment(postId, user.id, comment);
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      await loadPosts(); // Refresh posts
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getPostTypeIcon = (type: SocialPost['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'course_completion':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'question':
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getPostTypeColor = (type: SocialPost['type']) => {
    switch (type) {
      case 'achievement':
        return 'border-l-yellow-500';
      case 'course_completion':
        return 'border-l-green-500';
      case 'question':
        return 'border-l-blue-500';
      case 'tip':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Social Hub</h1>
        <p className="text-muted-foreground">
          Teile deine Lernerfahrungen, stelle Fragen und verbinde dich mit anderen Lernenden
        </p>
      </div>

      {/* Create Post Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">Was beschäftigt dich heute?</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Post Type Selection */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={newPostType === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewPostType("text")}
            >
              📝 Text
            </Button>
            <Button
              variant={newPostType === "question" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewPostType("question")}
            >
              ❓ Frage
            </Button>
            <Button
              variant={newPostType === "tip" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewPostType("tip")}
            >
              💡 Tipp
            </Button>
            <Button
              variant={newPostType === "achievement" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewPostType("achievement")}
            >
              🏆 Erfolg
            </Button>
          </div>

          <Textarea
            placeholder="Teile deine Gedanken, Fragen oder Erfahrungen..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Bild
              </Button>
              <Button variant="outline" size="sm">
                <Smile className="h-4 w-4 mr-2" />
                Emoji
              </Button>
            </div>
            <Button 
              onClick={handleCreatePost}
              disabled={loading || !newPostContent.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Posten
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => {
          const isLiked = post.likes.includes(user.id);
          const commentsVisible = showComments[post.id];
          
          return (
            <Card key={post.id} className={`border-l-4 ${getPostTypeColor(post.type)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {post.authorAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{post.authorName}</p>
                        {getPostTypeIcon(post.type)}
                        <Badge variant="secondary" className="text-xs">
                          {post.type === 'text' && '📝 Post'}
                          {post.type === 'question' && '❓ Frage'}
                          {post.type === 'tip' && '💡 Tipp'}
                          {post.type === 'achievement' && '🏆 Erfolg'}
                          {post.type === 'course_completion' && '📚 Kurs abgeschlossen'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { 
                          addSuffix: true, 
                          locale: de 
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{post.content}</p>
                
                {post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id, isLiked)}
                      className={isLiked ? "text-red-500" : ""}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                      {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments(prev => ({ 
                        ...prev, 
                        [post.id]: !prev[post.id] 
                      }))}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {post.comments.length} {post.comments.length === 1 ? 'Kommentar' : 'Kommentare'}
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Teilen
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {commentsVisible && (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Existing Comments */}
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                            {comment.authorAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{comment.authorName}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { 
                                  addSuffix: true, 
                                  locale: de 
                                })}
                              </p>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm">
                              <Heart className="h-3 w-3 mr-1" />
                              {comment.likes.length}
                            </Button>
                            <Button variant="ghost" size="sm">
                              Antworten
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Schreibe einen Kommentar..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) => setCommentInputs(prev => ({ 
                            ...prev, 
                            [post.id]: e.target.value 
                          }))}
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleComment(post.id);
                            }
                          }}
                        />
                        <Button 
                          size="sm"
                          onClick={() => handleComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {posts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Noch keine Posts</h3>
              <p className="text-muted-foreground mb-4">
                Sei der erste, der etwas postet! Teile deine Lernerfahrungen oder stelle eine Frage.
              </p>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Ersten Post erstellen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}