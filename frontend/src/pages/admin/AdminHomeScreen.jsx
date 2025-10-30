import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/Sidebar";
import {
  IconBrandTabler,
  IconUserBolt,
  IconSettings,
  IconArrowLeft,
  IconChalkboard,
  IconUsers
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "../../components/lib/utils";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const links = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Classes",
    href: "/admin/classes",
    icon: <IconChalkboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Subjects",
    href: "/admin/subjects",
    icon: <IconChalkboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Teachers",
    href: "/admin/teachers",
    icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Announcements",
    href: "/admin/announcements",
    icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Digital Library",
    href: "/admin/library",
    icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Logout",
    href: "/admin-signin",
    icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  }
];

import nexuslogo from '../../assets/nexuslogo.png';
function Logo() {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <img src={nexuslogo} alt="Nexus Logo" className="h-8 w-8 shrink-0 rounded-lg" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-black dark:text-white">
        NEXUS
      </motion.span>
    </a>
  );
}
function LogoIcon() {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <img src={nexuslogo} alt="Nexus Logo" className="h-8 w-8 shrink-0 rounded-lg" />
    </a>
  );
}

const AdminHomeScreen = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("nexus_admin_jwt");
    navigate("/admin-signin");
  };
  const API_URL = import.meta.env.VITE_API_URL;
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Sidebar click handler
  const handleSidebarClick = (href) => {
    if (href === "/admin-signin") {
      handleLogout();
      return;
    }
    navigate(href);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={location.pathname === link.href ? "bg-violet-200 dark:bg-violet-900" : ""}
                  onClick={() => handleSidebarClick(link.href)}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Admin",
                href: "/admin/profile",
                icon: (
                  <img
                    src="https://ui-avatars.com/api/?name=Admin"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
              onClick={() => handleSidebarClick("/admin/profile")}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminHomeScreen;
