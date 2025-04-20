
import React, { useState } from 'react';
import { Image, X, Code, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostsContext';

interface NewPostInputProps {
  communityId?: string;
}

const NewPostInput: React.FC<NewPostInputProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    addPost({
      userId: user.id,
      username: user.username,
      userProfilePic: user.profilePicture,
      content: content.trim(),
      imageUrl: image || undefined,
      communityId,
    });

    setContent('');
    setImage(null);
    setIsExpanded(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, we would upload to a server/cloud storage
    // Here we're just creating a local URL for demo purposes
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
  };

  const addCodeSnippet = () => {
    setContent(prev => `${prev}\n\`\`\`\nYour code here\n\`\`\``);
    setIsExpanded(true);
  };

  if (!user) return null;

  return (
    <div className="dev-card mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              className="dev-input w-full resize-none"
              placeholder={isExpanded ? "What's on your mind?" : "Ask a question or share something with the community..."}
              rows={isExpanded ? 4 : 1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />
            
            {image && (
              <div className="relative mt-2 rounded-md overflow-hidden">
                <img src={image} alt="Upload preview" className="w-full h-auto max-h-60 object-cover" />
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                  onClick={removeImage}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {isExpanded && (
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <label className="cursor-pointer p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors">
                    <Image size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                    onClick={addCodeSnippet}
                  >
                    <Code size={18} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="flex items-center gap-1 dev-button size-sm bg-primary text-primary-foreground px-3 py-1 rounded-md disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send size={16} />
                  <span>Post</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPostInput;
