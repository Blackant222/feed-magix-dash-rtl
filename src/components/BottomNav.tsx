import { NavLink, useLocation } from "react-router-dom";
import { Camera, Home, Heart, Clock, Settings } from "lucide-react";

interface Badges {
  pets?: number;
  history?: number;
  settings?: boolean; // show red dot when true
}

export default function BottomNav({ badges }: { badges?: Badges }) {
  const location = useLocation();
  const isScanActive = location.pathname.startsWith("/camera");

  const tabs = [
    { to: "/settings", label: "تنظیمات", icon: Settings, aria: "تنظیمات برنامه", badge: badges?.settings ? "dot" : undefined },
    { to: "/history", label: "تاریخچه", icon: Clock, aria: "تاریخچه تحلیل‌ها", badge: badges?.history && badges.history > 0 ? String(Math.min(99, badges.history)) : undefined },
    // Center scan handled separately
    { to: "/pets", label: "حیوانات", icon: Heart, aria: "مدیریت حیوانات خانگی", badge: badges?.pets && badges.pets > 0 ? String(Math.min(99, badges.pets)) : undefined },
    { to: "/", label: "خانه", icon: Home, aria: "خانه", badge: undefined },
  ] as const;

  return (
    <nav
      dir="rtl"
      aria-label="ناوبری پایین"
      className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden"
      role="navigation"
    >
      {/* Safe area support */}
      <div className="h-20 relative" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {/* Grid container for 5 columns (with center slot for FAB) */}
        <ul className="grid grid-cols-5 h-full items-center text-center">
          {/* RTL order: Settings | History | [Scan] | Pets | Home */}
          {tabs.slice(0, 2).map(({ to, label, icon: Icon, aria, badge }) => (
            <li key={to} className="h-full">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `transition-all duration-200 mx-1 inline-flex h-full flex-col items-center justify-center gap-1 rounded-md px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                  }`
                }
                aria-label={aria + (location.pathname === to ? "، برگه فعال" : "")}
                end={to === "/"}
              >
                <div className="relative">
                  <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                  {badge && (
                    badge === "dot" ? (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" aria-hidden="true" />
                    ) : (
                      <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] rounded-full bg-destructive text-[10px] leading-[18px] px-1 text-white font-bold ring-2 ring-background">
                        {badge}
                      </span>
                    )
                  )}
                </div>
                <span className="text-[12px] leading-4">{label}</span>
              </NavLink>
            </li>
          ))}

          {/* Center slot kept empty (FAB overlays) */}
          <li aria-hidden className="h-full" />

          {tabs.slice(2).map(({ to, label, icon: Icon, aria, badge }) => (
            <li key={to} className="h-full">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `transition-all duration-200 mx-1 inline-flex h-full flex-col items-center justify-center gap-1 rounded-md px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                  }`
                }
                aria-label={aria + (location.pathname === to ? "، برگه فعال" : "")}
                end={to === "/"}
              >
                <div className="relative">
                  <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                  {badge && (
                    badge === "dot" ? (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" aria-hidden="true" />
                    ) : (
                      <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] rounded-full bg-destructive text-[10px] leading-[18px] px-1 text-white font-bold ring-2 ring-background">
                        {badge}
                      </span>
                    )
                  )}
                </div>
                <span className="text-[12px] leading-4">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Elevated center Scan button */}
        <NavLink
          to="/camera"
          aria-label="اسکن غذای حیوان خانگی"
          className={`absolute left-1/2 -translate-x-1/2 -top-6 rounded-full border-4 border-background shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
            isScanActive ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"
          } ${isScanActive ? "" : "pulse"}`}
        >
          <div className="size-14 grid place-items-center">
            <Camera className="h-7 w-7" aria-hidden="true" />
          </div>
        </NavLink>
      </div>
    </nav>
  );
}
