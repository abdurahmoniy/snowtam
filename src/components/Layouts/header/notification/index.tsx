"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BellIcon } from "./icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllNotificationData, MarkAsReadNotification } from "@/services/notification.services";
import { Button } from "antd";
import { Eye } from "lucide-react";

const notificationList = [
  {
    image: "/images/user/user-15.png",
    title: "Piter Joined the Team!",
    subTitle: "Congratulate him",
  },
  {
    image: "/images/user/user-03.png",
    title: "New message",
    subTitle: "Devid sent a new message",
  },
  {
    image: "/images/user/user-26.png",
    title: "New Payment received",
    subTitle: "Check your earnings",
  },
  {
    image: "/images/user/user-28.png",
    title: "Jolly completed tasks",
    subTitle: "Assign new task",
  },
  {
    image: "/images/user/user-27.png",
    title: "Roman Joined the Team!",
    subTitle: "Congratulate him",
  },
];

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDotVisible, setIsDotVisible] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const NotificationsData = useQuery({
    queryKey: ["notification-data"],
    queryFn: () => getAllNotificationData()
  })

  const MarkAsRead = useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) => MarkAsReadNotification({
      notificationId
    })
  })

  console.log(NotificationsData.data, "NotificationsData");

  useEffect(() => {
    if(NotificationsData.data?.data.find((item) => !item.isRead)) setIsDotVisible(true);
  }, [NotificationsData.data]);


  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);

        if (setIsDotVisible) setIsDotVisible(false);
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="Bildirishnomalarni ko'rish"
      >
        <span className="relative">
          <BellIcon />

          {isDotVisible && (
            <span
              className={cn(
                "absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[20rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Уведомления
          </span>
        </div>

        <ul className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto">
          {NotificationsData.data?.data?.map((item, index) => (
            <li key={index} role="menuitem">
              <div
                // href="#"
                // onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 rounded-lg px-2 py-1.5 outline-none hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3"
              >

                <div className="flex justify-between items-center w-full">
                  <strong className="block text-sm font-medium text-dark dark:text-white">
                    {item.text}
                  </strong>

                  {/* <span className="truncate text-sm font-medium text-dark-5 dark:text-dark-6">
                    {item.subTitle}
                  </span> */}

                 {!item.isRead &&  <Button className="px-2" size={"small"}  onClick={() =>

                    MarkAsRead.mutate({
                      notificationId: String(item.id)
                    }, {
                      onSuccess(data, variables, context) {
                        queryClient.invalidateQueries();
                      },
                    })}><Eye size={16} /></Button>}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* <Link
          href="#"
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary outline-none transition-colors hover:bg-blue-light-5 focus:bg-blue-light-5 focus:text-primary focus-visible:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7 dark:focus-visible:border-dark-5 dark:focus-visible:bg-dark-3 dark:focus-visible:text-dark-7"
        >
          Barcha bildirishnomalarni ko&apos;rish
        </Link> */}
      </DropdownContent>
    </Dropdown>
  );
}
