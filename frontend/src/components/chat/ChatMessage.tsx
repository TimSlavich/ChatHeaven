import { cn } from "@/lib/utils";
import { MessageCircle, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

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
        <ReactMarkdown
          className="prose prose-sm md:prose-base text-foreground dark:text-white"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
        <span className="text-xs opacity-70 mt-2 block">{formatDateTime(timestamp)}</span>
      </div>
    </div>
  );
};
