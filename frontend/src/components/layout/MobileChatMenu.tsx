import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatItem } from "./ChatItem";

interface MobileChatMenuProps {
  isOpen: boolean;
  onClose: () => void;
  chats: { id: string; title: string; preview: string; timestamp: string }[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
}

export const MobileChatMenu = ({
  isOpen,
  onClose,
  chats,
  selectedChatId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onNewChat,
}: MobileChatMenuProps) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Выберите чат</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] p-2">
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              selectedChatId={selectedChatId}
              editingChatId={editingChatId}
              newTitle={newTitle}
              onSelectChat={(chatId) => {
                onSelectChat(chatId);
                onClose();
              }}
              onStartEdit={(chatId, title, e) => {
                e.stopPropagation();
                setEditingChatId(chatId);
                setNewTitle(title);
              }}
              onSaveEdit={(chatId, e) => {
                e.stopPropagation();
                if (newTitle.trim()) {
                  onRenameChat(chatId, newTitle);
                }
                setEditingChatId(null);
                setNewTitle("");
              }}
              onCancelEdit={(e) => {
                e.stopPropagation();
                setEditingChatId(null);
                setNewTitle("");
              }}
              onDeleteChat={onDeleteChat}
              setNewTitle={setNewTitle}
            />
          ))}
        </ScrollArea>
        <Button onClick={onNewChat} className="w-full mt-2">
          Новый чат
        </Button>
      </DialogContent>
    </Dialog>
  );
};
