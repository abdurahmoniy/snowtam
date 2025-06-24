import { cn } from "@/lib/utils";
// import { useTheme } from "next-themes";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { Moon, Sun } from "./icons";

const THEMES = [
  {
    name: "light",
    Icon: Sun,
  },
  {
    name: "black",
    Icon: Moon,
  },
];

export function ThemeToggleSwitch() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  console.log(theme, "theme");


  return (
    <button
      onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
      className="group rounded-full bg-gray-3 p-[3px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-[#020D1A] dark:text-current"
    >
      <span className="sr-only">
        Switch to {theme === "light" ? "dark" : "light"} mode
      </span>

      <span aria-hidden className="relative flex gap-2.5">

        <span className="absolute size-[28px] rounded-full border border-gray-200 bg-white transition-all dark:translate-x-[38px] dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3" />

        {THEMES.map(({ name, Icon }) => (
          <span
            key={name}
            className={cn(
              "relative grid size-[28px] place-items-center rounded-full",
              name === "dark" && "dark:text-white",
            )}
          >
            <Icon />
          </span>
        ))}
      </span>
    </button>
  );
}
