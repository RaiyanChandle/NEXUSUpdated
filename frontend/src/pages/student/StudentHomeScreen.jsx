import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/Sidebar";
import { IconChalkboard, IconUserBolt, IconArrowLeft } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "../../components/lib/utils";

const links = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: <IconChalkboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Subjects",
    href: "/student/subjects",
    icon: <IconChalkboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Attendance",
    href: "/student/attendance",
    icon: <IconChalkboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Assignments",
    href: "/student/assignments",
    icon: <IconChalkboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Library",
    href: "/student/library",
    icon: <IconChalkboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Announcements",
    href: "/student/announcements",
    icon: <IconChalkboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Profile",
    href: "/student/profile",
    icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Logout",
    href: "/student-signin",
    icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  }
];

function Logo() {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-black dark:text-white">
        NEXUS
      </motion.span>
    </a>
  );
}

function LogoIcon() {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
}

const StudentHomeScreen = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("nexus_student_jwt");
    navigate("/student-signin");
  };
  const handleSidebarClick = (href) => {
    if (href === "/student-signin") {
      handleLogout();
      return;
    }
    navigate(href);
  };

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800", "h-screen")}> 
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
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentHomeScreen;
