"use client"

import React from "react"
import { useTheme } from "@/components/ui/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeTrigger({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      className={className}
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {theme === "dark" ? <Sun className="text-foreground" /> : <Moon className="text-foreground" />}
    </Button>
  )
}

