"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon, SunMoon } from "lucide-react";
import { useEffect, useState } from "react";

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
            variant="ghost"
          >
            {theme === "system" ? (
              <SunMoon />
            ) : theme == "dark" ? (
              <MoonIcon />
            ) : (
              <SunIcon />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem onClick={()=> setTheme('system')} checked={theme == "system"}>
            System
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onClick={()=> setTheme('light')} checked={theme == "light"}>
            Light
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onClick={()=> setTheme('dark')} checked={theme == "dark"}>
            Dark
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ModeToggle;
