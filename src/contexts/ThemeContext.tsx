"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { ConfigProvider, ThemeConfig, theme as antdTheme } from "antd";

type Theme = "light" | "dark" | "black";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: (value: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorBgBase: "#020d1a", // Darkest background (body, base)
    colorBgContainer: "#27303e", // Used in modals, cards, sections
    colorTextBase: "#ffffff", // Main text color
    colorPrimary: "#5650f0", // Button and highlight color
    colorBorder: "#5550f064",
  },
  components: {
    Layout: {
      colorBgHeader: "#27303e",
      colorBgBody: "#202124",
    },
    Modal: {
      // colorBgElevated: "#0f1729",
      colorBgElevated: "#202124",
    },
    Card: {
      colorBgContainer: "#27303e",
    },
    Input: {
      colorBgContainer: "#35363a",
      colorText: "#ffffff",
      colorBorder: "#3c4453",
      colorTextPlaceholder: "#6b7280", // subtle gray
      colorBgBase: "#27303e",
    },
    Select: {
      // colorBgElevated: "#27303e",
      colorBgElevated: "#35363a",
      colorBgContainer: "#35363a",

      controlItemBgHover: "#32425a",
      controlItemBgActive: "#1b2940",
      colorText: "#ffffff",
      colorBorder: "#3c4453",
      colorTextPlaceholder: "#6b7280",
    },
    Button: {
      colorPrimary: "#5650f0",
      // colorPrimary: "#202124",
      colorText: "#ffffff",
      colorBorder: "#3c4453",
      // colorBorder: "#5650f0",
      colorPrimaryHover: "#6b63f2",
      colorPrimaryActive: "#433ee4",
      colorBgContainer: "#202124",
    },
    Menu: {
      colorItemBg: "#020d1a",
      colorItemText: "#ffffff",
      colorItemTextHover: "#5650f0",
      colorItemBgActive: "#27303e",
    },
    Popover: {
      colorBgElevated: "#27303e",
      colorText: "#ffffff",
    },
    Tooltip: {
      colorText: "#ffffff",
    },
    Form: {
      colorTextLabel: "#ffffff",
    },
    Dropdown: {
      colorBgElevated: "#202124",
      colorText: "#ffffff",
    },
    Pagination: {
      colorBgContainer: "#27303e",
      colorText: "#ffffff",
      colorPrimary: "#5650f0",
    },
    // Table: {
    //   colorBgContainer: "#27303e",
    //   colorText: "#ffffff",
    //   colorBorderSecondary: "#3c4453",
    //   colorFillAlter: "#1c2431", // alt row bg
    // },
    Table: {
      // colorBgContainer: "#131f32", // Table background
      colorBgContainer: "#202124", // Table background
      colorText: "#ffffff", // Main cell text
      colorBorderSecondary: "#3c4453", // Grid/border lines
      // colorFillAlter: "#192841", // Zebra stripe rows
      colorFillAlter: "#202124", // Zebra stripe rows
      colorTextHeading: "#e5e7eb", // Header text color
      colorTextPlaceholder: "#9ca3af", // When table is empty
    },
    Tabs: {
      colorBgContainer: "#27303e",
      colorPrimary: "#5650f0",
      colorText: "#ffffff",
      colorTextDisabled: "#6b7280",
    },
    Switch: {
      colorPrimary: "#5650f0",
      colorBgContainer: "#27303e",
    },
    Checkbox: {
      colorPrimary: "#5650f0",
      colorBgContainer: "#27303e",
      colorBorder: "#3c4453",
    },
    Radio: {
      colorPrimary: "#5650f0",
      // colorPrimary: "#2e2f32",
      colorBgContainer: "#202124",
      colorText: "#ffffff",
      colorBorder: "#3c4453",
      colorPrimaryHover: "#6b63f2",
      colorPrimaryActive: "#433ee4",
    },
    DatePicker: {
      colorBgContainer: "#35363a",
      colorText: "#ffffff",
      colorBorder: "#3c4453",
      addonBg: "#27303e",
    },
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "dark";

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      // if (theme === "dark") {
      //   document.documentElement.classList.add("dark");
      // } else {
      //   document.documentElement.classList.remove("dark");
      // }

      if (theme == "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("black");
        document.documentElement.classList.remove("light");
      } else if (theme == "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.remove("black");
      } else if (theme == "black") {
        document.documentElement.classList.add("black");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.remove("light");
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = (theme: Theme) => {
    setTheme((prevTheme) => theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={
          theme == "dark"
            ? darkTheme
            : {
                algorithm: antdTheme.defaultAlgorithm,
              }
        }
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
