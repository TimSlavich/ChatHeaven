import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X, Trash2 } from "lucide-react";

interface ChatItemProps {
  chat: {
    id: string;
    title: string;
    preview: string;
    timestamp: string;
  };
  selectedChatId: string | null;
  editingChatId: string | null;
  newTitle: string;
  onSelectChat: (chatId: string) => void;
  onStartEdit: (chatId: string, title: string, e: React.MouseEvent) => void;
  onSaveEdit: (chatId: string, e: React.MouseEvent) => void;
  onCancelEdit: (e: React.MouseEvent) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  setNewTitle: (title: string) => void;
}

/**
 * ChatItem Component
 * Renders a single chat item with editing and delete functionality.
 */
export const ChatItem = memo(
  ({
    chat,
    selectedChatId,
    editingChatId,
    newTitle,
    onSelectChat,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDeleteChat,
    setNewTitle,
  }: ChatItemProps) => {
    const isEditing = editingChatId === chat.id;
    const isSelected = selectedChatId === chat.id;

    return (
      <div
        className={`chat-item ${isSelected ? "selected" : ""}`}
        onClick={() => onSelectChat(chat.id)}
      >
        {isEditing ? (
          <div className="p-3 flex items-center gap-2 flex-1">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="chat-edit-input"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <Button size="icon" variant="ghost" onClick={(e) => onSaveEdit(chat.id, e)}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full text-left p-3 flex justify-between items-center group cursor-pointer rounded-lg">
            <div className="flex-1 min-w-0 mr-3">
              <div className="chat-title truncate">{chat.title}</div>
              <div className="chat-preview truncate max-w-[150px] text-sm">{chat.preview}</div>
              <div className="chat-timestamp">{chat.timestamp}</div>
            </div>
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit(chat.id, chat.title, e);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id, e);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
