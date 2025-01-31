import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeSettings } from "./ThemeSettings";
import { SecuritySettings } from "./SecuritySettings";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export const Settings = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  return (
    <div className="p-6 w-full transition-transform duration-300">
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
        <SheetDescription>Manage your preferences and security settings</SheetDescription>
      </SheetHeader>

      <div className="space-y-6 mt-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">Theme</h2>
          <ThemeSettings />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Security</h3>
          <SecuritySettings />
        </div>

        <div className="border-t pt-4">
          <Button onClick={handleLogout} className="bg-red-700 text-white w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
