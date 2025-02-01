import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatItem } from "./ChatItem";

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

/**
 * Sidebar Component
 * Displays a list of chats and provides options to create, rename, or delete chats.
 */
export const Sidebar = ({
  chats,
  onNewChat,
  onSelectChat,
  selectedChatId,
  onRenameChat,
  onDeleteChat,
}: SidebarProps) => {
  const { toast } = useToast();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  /**
   * Starts chat title editing.
   */
  const handleStartEdit = (chatId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setNewTitle(title);
  };

  /**
   * Saves the new chat title.
   */
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

  /**
   * Cancels chat title editing.
   */
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
    setNewTitle("");
  };

  return (
    <div className="w-[300px] h-screen border-r flex flex-col">
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
      <ScrollArea className="flex-1 overflow-y-auto p-4">
        <div className="p-4 space-y-2">
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              selectedChatId={selectedChatId}
              editingChatId={editingChatId}
              newTitle={newTitle}
              onSelectChat={onSelectChat}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onDeleteChat={onDeleteChat}
              setNewTitle={setNewTitle}
            />
          ))}
        </div>
      </ScrollArea>

    </div>
  );
};
