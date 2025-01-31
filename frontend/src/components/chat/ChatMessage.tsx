import { cn } from "@/lib/utils";
import { MessageCircle, Bot } from "lucide-react";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

export const ChatMessage = ({ content, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "message-bubble",
        isUser ? "message-user" : "message-ai"
      )}
    >
      <div className="flex items-start gap-2">
        <div className="mt-1">
          {isUser ? (
            <MessageCircle className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm md:text-base">{content}</p>
          <span className="text-xs opacity-70 mt-2 block">{timestamp}</span>
        </div>
      </div>
    </div>
  );
};