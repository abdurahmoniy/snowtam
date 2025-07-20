"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { Avatar } from 'antd';
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { LogOutIcon } from "./icons";
import { useRouter } from "next/navigation";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const USER = {
    name: session?.user?.fullname || "User",
    email: session?.user?.email || "",
    img: "/images/user/user-03.png",
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">Mening hisobim</span>

        <figure className="flex items-center gap-1">
          {/* <Image
            src={USER.img}
            className="size-12"
            alt={`${USER.name} avatari`}
            role="presentation"
            width={200}
            height={200}
          /> */}
          <Avatar>
            {USER.name.slice(0, 1)}
          </Avatar>
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem] overflow-hidden"
        align="end"
      >
        <h2 className="sr-only">Foydalanuvchi ma&apos;lumotlari</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5 hover:bg-slate-300 cursor-pointer" onClick={() => { router.push("/profile") }}>
          {/* <Image
            src={USER.img}
            className="size-12"
            alt={`${USER.name} uchun avatar`}
            role="presentation"
            width={200}
            height={200}
          /> */}
          <Avatar>
            {USER.name.slice(0, 1)}
          </Avatar>

          <figcaption className="space-y-1 text-base font-medium " >
            <div className="mb-2 leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="leading-none text-gray-6">{USER.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        {/* <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">Profilni ko'rish</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Hisob sozlamalari
            </span>
          </Link>
        </div> */}

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Chiqish</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
