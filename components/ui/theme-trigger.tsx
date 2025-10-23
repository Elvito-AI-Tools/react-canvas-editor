"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "@/components/ui/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeTrigger({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait until after client-side hydration to show the theme toggle
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        className={className}
        disabled
      >
        <Sun className="text-foreground" />
      </Button>
    )
  }

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

