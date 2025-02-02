import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

/**
 * ThemeSettings Component
 * Manages light/dark mode settings.
 */
export const ThemeSettings = () => {
  const { toast } = useToast();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "dark";
  });

  /**
   * Переключает тему и сохраняет в localStorage.
   */
  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("darkMode", checked ? "dark" : "light");
    document.documentElement.classList.toggle("dark", checked);

    toast({
      title: checked ? "Dark mode enabled" : "Light mode enabled",
      description: `Theme changed to ${checked ? "dark" : "light"} mode`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleDarkModeToggle} />
      </div>
    </div>
  );
};
