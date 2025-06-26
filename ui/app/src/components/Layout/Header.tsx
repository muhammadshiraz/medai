"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { usePageTitle } from "@/context/PageTitleContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { title } = usePageTitle();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-64 bg-white dark:bg-gray-900 shadow-sm z-40">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
        </div>
        <div className="flex items-center space-x-4 relative">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <span className="sr-only">Notifications</span>
            🔔
          </button>

          <div className="relative cursor-pointer" ref={dropdownRef}>
            <div
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1 pr-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="h-8 w-8 rounded-full bg-medical-primary flex items-center justify-center text-white uppercase">
                {user?.username
                  ?.split(" ")
                  .slice(0, 2)
                  .map((name) => name[0])
                  .join("") || "GU"}
              </div>
              <ChevronDownIcon
                className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {showDropdown && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 animate-in fade-in zoom-in-95"
                role="menu"
              >
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => (window.location.href = "/settings")}
                    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-400 hover:bg-medical-secondary/10 rounded-md transition-colors"
                    role="menuitem"
                  >
                    <Cog6ToothIcon className="h-5 w-5 mr-2 text-medical-primary" />
                    Settings
                  </button>
                  <button
                    onClick={() => (window.location.href = "/about")}
                    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-400 hover:bg-medical-secondary/10 rounded-md transition-colors"
                    role="menuitem"
                  >
                    <InformationCircleIcon className="h-5 w-5 mr-2 text-medical-primary" />
                    About
                  </button>
                  <button
                    onClick={logout}
                    className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    role="menuitem"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
