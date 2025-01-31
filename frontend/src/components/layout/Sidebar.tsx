import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit2, Check, X, Trash2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface SidebarProps {
  chats: Chat[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar = ({
  chats,
  onNewChat,
  onSelectChat,
  selectedChatId,
  onRenameChat,
  onDeleteChat
}: SidebarProps) => {
  const { toast } = useToast();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleStartEdit = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setNewTitle(chat.title);
  };

  const handleSaveEdit = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!newTitle.trim()) {
      toast({
        title: "Error",
        description: "Chat title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onRenameChat(chatId, newTitle);
    setEditingChatId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
    setNewTitle("");
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteChat(chatId);
  };

  return (
    <div className="w-[300px] h-full border-r flex flex-col">
      <div className="heaven-icon flex items-center mt-5 justify-center gap-3">
        <Heart className="h-8 w-8 font-bold text-[hsl(var(--foreground))]" />
        <span className="text-[hsl(var(--foreground))] text-lg font-bold">HEAVEN</span>
      </div>
      <div className="p-4 flex flex-col items-center">
        <Button onClick={onNewChat} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChatId === chat.id ? "selected" : ""}`}
              onClick={() => onSelectChat(chat.id)}
            >
              {editingChatId === chat.id ? (
                <div className="p-3 flex items-center gap-2 flex-1">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="chat-edit-input"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button size="icon" variant="ghost" onClick={(e) => handleSaveEdit(chat.id, e)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full text-left p-3 flex justify-between items-center group cursor-pointer rounded-lg">
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="chat-title truncate">{chat.title}</div>
                    <div className="chat-preview truncate max-w-[190px]">{chat.preview}</div>
                    <div className="chat-timestamp">{chat.timestamp}</div>
                  </div>
                  <div className="chat-actions">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(chat, e);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id, e);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
