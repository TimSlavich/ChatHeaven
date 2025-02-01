import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Settings } from "@/components/settings/Settings";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { useChats } from "@/hooks/use-chats";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";

/**
 * Index Page
 * Manages chat interface, settings, and WebSocket communication.
 */
const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    chats,
    selectedChatId,
    setSelectedChatId,
    fetchChats,
    handleNewChat,
    handleRenameChat,
    handleDeleteChat
  } = useChats();

  const { chatMessages, handleSendMessage, isLoading } = useWebSocket(selectedChatId);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={setSelectedChatId}
        selectedChatId={selectedChatId}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
      />
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Settings button */}
        <div className="flex justify-end p-4">
          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-l">
              <Settings onClose={() => setIsSettingsOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        {/* Chat Window should scroll independently */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {selectedChatId ? (
            <ChatWindow messages={chatMessages[selectedChatId] || []} onSendMessage={handleSendMessage} isLoading={isLoading} />
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
