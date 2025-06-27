"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

type NavSubItem = { title: string; url: string };
type NavGroupItem = { title: string; icon: any; items: NavSubItem[] };
type NavSection = { label: string; items: NavGroupItem[] };
type NavDirectLink = { title: string; icon: any; url: string };
type NavData = (NavSection | NavDirectLink)[];

function isNavSection(item: any): item is NavSection {
  return 'items' in item && Array.isArray(item.items);
}
function isNavGroupItem(item: any): item is NavGroupItem {
  return 'items' in item && Array.isArray(item.items);
}

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    (NAV_DATA as NavData).forEach((section) => {
      if (isNavSection(section)) {
        section.items.forEach((item: NavGroupItem) => {
          if (isNavGroupItem(item)) {
            item.items.forEach((subItem: NavSubItem) => {
              if (subItem.url === pathname) {
                if (!expandedItems.includes(item.title)) {
                  toggleExpanded(item.title);
                }
              }
            });
          }
        });
      }
    });
  }, [pathname, expandedItems]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-5 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 min-[850px]:py-0 text-lg"
            >
              <h1 className="mb-0.5 text-heading-6 font-bold text-dark dark:text-white">
                Dashboard
              </h1>
            </Link>

            {/* <button
              onClick={toggleSidebar}
              className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
            >
              <span className="sr-only">Menuni yopish</span>

              <ArrowLeftIcon className="ml-auto size-7" />
            </button> */}

          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {(NAV_DATA as NavData).map((section, idx) => {
              if (isNavSection(section)) {
                return (
                  <div key={section.label || idx} className="mb-6">
                    {section.label && (
                      <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                        {section.label}
                      </h2>
                    )}
                    <nav role="navigation" aria-label={section.label || "Navigation"}>
                      <ul className="space-y-2">
                        {section.items.map((item: NavGroupItem) => (
                          <li key={item.title}>
                            {item.items && item.items.length ? (
                              <div>
                                <MenuItem
                                  isActive={item.items.some(({ url }: NavSubItem) => url === pathname)}
                                  onClick={() => toggleExpanded(item.title)}
                                >
                                  <item.icon
                                    className="size-6 shrink-0"
                                    aria-hidden="true"
                                  />

                                  <span>{typeof item.title === "string" ? item.title : ""}</span>

                                  <ChevronUp
                                    className={cn(
                                      "ml-auto rotate-180 transition-transform duration-200",
                                      expandedItems.includes(item.title) &&
                                      "rotate-0",
                                    )}
                                    aria-hidden="true"
                                  />
                                </MenuItem>

                                {expandedItems.includes(item.title) && (
                                  <ul
                                    className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                    role="menu"
                                  >
                                    {item.items.map((subItem: NavSubItem) => (
                                      <li key={subItem.title} role="none">
                                        <MenuItem
                                          as="link"
                                          href={subItem.url}
                                          isActive={pathname === subItem.url}
                                        >
                                          <span>{subItem.title}</span>
                                        </MenuItem>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ) : (
                              <MenuItem
                                className="flex items-center gap-3 py-3"
                                as="link"
                                href={
                                  "url" in item && typeof item.url === "string" && item.url
                                    ? item.url
                                    : typeof item.title === "string"
                                      ? "/" + item.title.toLowerCase().split(" ").join("-")
                                      : "/"
                                }
                                isActive={
                                  pathname ===
                                  ("url" in item && typeof item.url === "string" && item.url
                                    ? item.url
                                    : typeof item.title === "string"
                                      ? "/" + item.title.toLowerCase().split(" ").join("-")
                                      : "/")
                                }
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span>{typeof item.title === "string" ? item.title : ""}</span>
                              </MenuItem>
                            )}
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                );
              }
              // If section is a direct item (no items array)
              const direct = section as NavDirectLink;
              return (
                <div key={direct.title || idx} className="mb-6">
                  <nav role="navigation" aria-label={direct.title || "Navigation"}>
                    <ul className="space-y-2">
                      <li>
                        <MenuItem
                          className="flex items-center gap-3 py-3"
                          as="link"
                          href={
                            "url" in direct && typeof direct.url === "string" && direct.url
                              ? direct.url
                              : typeof direct.title === "string"
                                ? "/" + direct.title.toLowerCase().split(" ").join("-")
                                : "/"
                          }
                          isActive={
                            pathname ===
                            ("url" in direct && typeof direct.url === "string" && direct.url
                              ? direct.url
                              : typeof direct.title === "string"
                                ? "/" + direct.title.toLowerCase().split(" ").join("-")
                                : "/")
                          }
                        >
                          <direct.icon className="size-6 shrink-0" aria-hidden="true" />
                          <span>{typeof direct.title === "string" ? direct.title : ""}</span>
                        </MenuItem>
                      </li>
                    </ul>
                  </nav>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
