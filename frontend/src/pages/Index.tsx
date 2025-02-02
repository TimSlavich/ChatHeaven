import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { useChats } from "@/hooks/use-chats";
import { useWebSocket } from "@/hooks/use-websocket";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileChatMenu } from "@/components/layout/MobileChatMenu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
    handleNewUserMessage,
  } = useChats();

  const { chatMessages, handleSendMessage, isLoading } = useWebSocket(selectedChatId, handleNewUserMessage);
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();

  const [isChatMenuOpen, setChatMenuOpen] = useState(false);

  useEffect(() => {
    if (selectedChatId && chatHistory[selectedChatId] === undefined) {
        fetchChatHistory(selectedChatId);
    }
}, [selectedChatId]);

  const messages = useMemo(
    () => [
      ...(chatHistory[selectedChatId]?.messages || []),
      ...(chatMessages[selectedChatId] || []),
    ],
    [chatHistory, chatMessages, selectedChatId]
  );

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "dark" : ""}`}>
      {!isMobile && (
        <Sidebar
          chats={chats}
          onNewChat={handleNewChat}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
        />
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-2 flex justify-between items-center border-b">
          {isMobile && (
            <Button variant="ghost" onClick={() => setChatMenuOpen(true)} className="flex items-center">
              <Menu className="h-6 w-6" />
              <span className="ml-2">Чаты</span>
            </Button>
          )}
          <div className="ml-auto"> {/* Перемещение настроек вправо */}
            <SettingsButton />
          </div>
        </div>
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {selectedChatId ? (
            <ChatWindow messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {isMobile ? "Выберите чат в меню" : "Select a chat to start messaging"}
            </div>
          )}
        </div>
      </div>
      {isMobile && (
        <MobileChatMenu
          isOpen={isChatMenuOpen}
          onClose={() => setChatMenuOpen(false)}
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
          onNewChat={handleNewChat}
        />
      )}
    </div>
  );
};

export default Index;
