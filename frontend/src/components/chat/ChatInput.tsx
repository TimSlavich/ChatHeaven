import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

/**
 * ChatInput Component
 * Handles user message input and sending functionality.
 */
export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles sending a message when submitting the form.
   * @param e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    onSendMessage(message);
    setMessage("");

    setTimeout(() => setIsLoading(false), 500);
  };

  /**
   * Handles "Enter" key press for sending a message.
   * "Shift + Enter" creates a new line, while "Enter" sends the message.
   * @param e
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="min-h-[60px] max-h-[200px] resize-none"
        disabled={disabled || isLoading}
        aria-label="Chat input field"
      />
      <Button type="submit" disabled={disabled || isLoading || !message.trim()} aria-label="Send message">
        {isLoading ? "..." : <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
};
