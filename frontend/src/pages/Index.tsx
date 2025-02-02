import { useEffect, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { useChats } from "@/hooks/use-chats";
import { useWebSocket } from "@/hooks/use-websocket";
import { useTheme } from "@/hooks/use-theme";

const Index = () => {
  const {
    chats,
    selectedChatId,
    setSelectedChatId,
    chatHistory,
    fetchChatHistory,
    handleNewChat,
    handleRenameChat,
    handleDeleteChat,
    handleNewUserMessage
  } = useChats();

  const { chatMessages, handleSendMessage, isLoading } = useWebSocket(selectedChatId, handleNewUserMessage);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (selectedChatId) {
      fetchChatHistory(selectedChatId);
    }
  }, [selectedChatId]);

  const messages = useMemo(() => [
    ...(chatHistory[selectedChatId]?.messages || []),
    ...(chatMessages[selectedChatId] || [])
  ], [chatHistory, chatMessages, selectedChatId]);

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "dark" : ""}`}>
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={setSelectedChatId}
        selectedChatId={selectedChatId}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <SettingsButton />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {selectedChatId ? (
            <ChatWindow messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
