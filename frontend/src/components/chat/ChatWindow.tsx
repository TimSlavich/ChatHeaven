import { useEffect, useRef, memo } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

/**
 * ChatWindow Component
 * - Ensures only chat messages scroll while keeping the input fixed.
 */
export const ChatWindow = memo(({ messages, onSendMessage, isLoading }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  console.log("isLoading:", isLoading);

  return (
    <div className="flex flex-col h-full w-full max-h-screen">
      <div className="flex-1 overflow-y-auto px-4 py-2 chat-container">
        {messages.map((message) => (
          <ChatMessage key={message.id} content={message.content} isUser={message.isUser} timestamp={message.timestamp} />
        ))}
        {isLoading && (
          <div className="message-bubble message-ai flex items-center gap-2 p-4 rounded-lg">
            <div className="loader animate-spin h-5 w-5 border-4 border-gray-300 border-t-transparent rounded-full"></div>
            <span className="text-gray-500">Печатает...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t bg-background p-4 sticky bottom-0">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
});
