"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { useUserMe } from "@/hooks/use-me";
import { ROLES } from "@/consts/role-based-routing";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  const CurrentUser = useUserMe();
  const NeedToShowMenu = CurrentUser.data?.data.role.includes(ROLES.SUPER_ADMIN);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-2 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">

      {NeedToShowMenu && (<button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A]"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>)}

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">

        <ThemeToggleSwitch />

        <Notification />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
