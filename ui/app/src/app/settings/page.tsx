// src/app/settings/page.tsx
"use client";
import { useSettings, Language } from "@/context/SettingsContext";
import { usePageTitle } from "@/context/PageTitleContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

export default function SettingsPage() {
  const { setTitle } = usePageTitle();
  const { theme, toggleTheme, language, setLanguage } = useSettings();

  useEffect(() => {
    setTitle("Settings");
  }, [setTitle]);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Preferences</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your application settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-800">
            <div className="space-y-1">
              <Label htmlFor="theme-toggle" className="dark:text-gray-300">Dark Mode</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark theme
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>

          {/* Language Settings */}
          <div className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-800">
            <div className="space-y-1">
              <Label htmlFor="language-select" className="dark:text-gray-300">Language</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select your preferred language
              </p>
            </div>
            <Select
              value={language}
              onValueChange={(value: Language) => setLanguage(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
