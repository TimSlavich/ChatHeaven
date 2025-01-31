import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Settings } from "@/components/settings/Settings";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({});
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const theme = localStorage.getItem("darkMode");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      console.warn("⚠️ Нет сохраненного токена или user_id. Пользователь не аутентифицирован.");
    }

    fetchChats();
  }, []);

  useEffect(() => {
    if (!selectedChatId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Ошибка: Токен отсутствует, WebSocket не может подключиться.");
      return;
    }

    const wsUrl = `${import.meta.env.VITE_WS_URL}/chat/ws/${selectedChatId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = (event) => {
      if (event.code === 1005) return;

      console.warn(`⚠️ WebSocket отключен. Код: ${event.code}, Причина: ${event.reason || "Не указана"}`);

      if (event.code !== 1000) {
        console.log("🔄 Попытка переподключения через 3 секунды...");
        setTimeout(() => {
          if (selectedChatId) {
            setSocket(new WebSocket(wsUrl));
          }
        }, 3000);
      } else {
        setSocket(null);
      }
    };

    return () => {
      ws.close();
    };
  }, [selectedChatId]);

  const fetchChats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Ошибка: Токен отсутствует, не могу загрузить чаты.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/chats`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки чатов: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();

      setChats(data.chats.map((chat: any) => ({
        id: chat.id,
        title: chat.name,
        preview: "",
        timestamp: "Недавно"
      })));
    } catch (error) {
      console.error("❌ Ошибка загрузки чатов:", error);
    }
  };

  const handleSendMessage = (message: string) => {
    if (!selectedChatId || !socket) return;

    setIsLoading(true);

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
    }));

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId ? { ...chat, preview: message, timestamp: "Just now" } : chat
      )
    );

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error("WebSocket is not connected");
    }

    setIsLoading(false);
  };

  const handleNewChat = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      console.error("❌ Ошибка: Токен или user_id отсутствует, не могу создать чат.");
      alert("Войдите в систему перед созданием чата!");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: parseInt(userId) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при создании чата: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setChats((prev) => [{ id: data.chat_id, title: "New Chat", preview: "", timestamp: "Just now" }, ...prev]);
      setSelectedChatId(data.chat_id);
    } catch (error) {
      console.error("❌ Ошибка создания чата:", error);
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Ошибка: Токен отсутствует, невозможно отправить запрос.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/${chatId}?new_name=${encodeURIComponent(newTitle)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при изменении названия чата: ${response.status} - ${errorText}`);
      }

      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat))
      );

      toast({ title: "Chat renamed", description: `Renamed to "${newTitle}"` });
    } catch (error) {
      console.error("❌ Ошибка изменения чата:", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при удалении чата: ${response.status} - ${errorText}`);
      }
      if (selectedChatId === chatId && socket) {
        socket.close();
      }

      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      setSelectedChatId(null);
      toast({ title: "Chat deleted", description: "The chat has been removed" });
    } catch (error) {
      console.error("❌ Ошибка удаления чата:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={setSelectedChatId}
        selectedChatId={selectedChatId}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
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
          <main className="flex-1">
            {selectedChatId ? (
              <ChatWindow messages={chatMessages[selectedChatId] || []} onSendMessage={handleSendMessage} isLoading={isLoading} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a chat to start messaging
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
