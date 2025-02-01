import { cn } from "@/lib/utils";
import { MessageCircle, Bot } from "lucide-react";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

/**
 * ChatMessage Component
 * Displays a user or AI-generated message inside the chat.
 */
export const ChatMessage = ({ content, isUser, timestamp }: ChatMessageProps) => {
  /**
   * Returns the appropriate icon for the message sender.
   */
  const renderIcon = () => (isUser ? <MessageCircle className="h-5 w-5" /> : <Bot className="h-5 w-5" />);

  return (
    <div
      className={cn(
        "message-bubble flex gap-2 items-start",
        isUser ? "message-user" : "message-ai"
      )}
      aria-label={isUser ? "User message" : "AI response"}
    >
      <div className="mt-1">{renderIcon()}</div>
      <div className="flex-1">
        <p className="text-sm md:text-base">{content}</p>
        <span className="text-xs opacity-70 mt-2 block">{timestamp}</span>
      </div>
    </div>
  );
};
