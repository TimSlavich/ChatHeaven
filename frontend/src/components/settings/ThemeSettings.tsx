import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const ThemeSettings = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") || "light";
    const isDark = savedTheme === "dark";

    document.documentElement.classList.toggle("dark", isDark);
    setIsDarkMode(isDark);
  }, []);

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("darkMode", checked ? "dark" : "light");

    toast({
      title: checked ? "Dark mode enabled" : "Light mode enabled",
      description: `Theme changed to ${checked ? "dark" : "light"} mode`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch
          id="dark-mode"
          checked={isDarkMode}
          onCheckedChange={handleDarkModeToggle}
        />
      </div>
    </div>
  );
};
