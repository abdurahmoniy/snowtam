import { Users } from "lucide-react";
import * as Icons from "../icons";

export const NAV_DATA = [
  // {
  //   label: "ASOSIY MENYU",
  //   items: [
  //     {
  //       title: "Boshqaruv Paneli",
  //       icon: Icons.HomeIcon,
  //       items: [
  //         {
  //           title: "eCommerce",
  //           url: "/",
  //         },
  //       ],
  //     },
  //   ]
  // },
  {
    title: "Панель управления",
    icon: Icons.HomeIcon,
    url: "/",
  },
  {
    title: "Аэропорты",
    icon: Icons.PlaneTakeOffIcon,
    url: "/airports",
  },
  {
    title: "Пользователи",
    icon: Users,
    url: "/users",
  },
];
