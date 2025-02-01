import { Button } from "@/components/ui/button";
import { ThemeSettings } from "./ThemeSettings";
import { SecuritySettings } from "./SecuritySettings";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

interface SettingsProps {
  onClose: () => void;
}

/**
 * Settings component
 * Manages theme settings, security options, and logout functionality.
 */
export const Settings = ({ onClose }: SettingsProps) => {
  const { logout } = useAuth();

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
          <Button onClick={logout} className="bg-red-700 text-white w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
