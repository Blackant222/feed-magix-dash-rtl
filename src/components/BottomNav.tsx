import { NavLink } from "react-router-dom";
import { Camera, Home, PawPrint, History, Settings } from "lucide-react";

const items = [
  { to: "/", label: "خانه", icon: Home },
  { to: "/camera", label: "اسکن", icon: Camera },
  { to: "/pets", label: "حیوانات", icon: PawPrint },
  { to: "/history", label: "تاریخچه", icon: History },
  { to: "/settings", label: "تنظیمات", icon: Settings },
] as const;

export default function BottomNav() {
  return (
    <nav
      dir="rtl"
      aria-label="ناوبری پایین"
      className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 text-xs transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5 mb-1" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
