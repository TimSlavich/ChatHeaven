import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { Settings } from "@/components/settings/Settings";
import { useState } from "react";

/**
 * Floating settings button that opens the settings panel.
 */
export const SettingsButton = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
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
  );
};
