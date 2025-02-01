import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

/**
 * ThemeSettings Component
 * Manages light/dark mode settings.
 */
export const ThemeSettings = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "dark";
  });

  // Ensure theme applies correctly on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  /**
   * Toggles theme and saves preference.
   * @param checked - True if dark mode is enabled, false otherwise.
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
