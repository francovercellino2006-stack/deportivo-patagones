"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Megaphone, Calendar, Trophy, CreditCard, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

const socioItems = [
  { href: "/avisos",     label: "Avisos",    icon: Megaphone      },
  { href: "/calendario", label: "Agenda",    icon: Calendar       },
  { href: "/inicio",     label: "Inicio",    icon: Home           },
  { href: "/eventos",    label: "Eventos",   icon: Trophy         },
  { href: "/cuotas",     label: "Cuotas",    icon: CreditCard     },
];

const profeItems = [
  { href: "/avisos",     label: "Avisos",    icon: Megaphone      },
  { href: "/calendario", label: "Agenda",    icon: Calendar       },
  { href: "/inicio",     label: "Inicio",    icon: Home           },
  { href: "/eventos",    label: "Eventos",   icon: Trophy         },
  { href: "/mi-panel",   label: "Mi panel",  icon: LayoutDashboard},
];

export function BottomNav() {
  const pathname  = usePathname();
  const { session } = useAuth();
  const navItems  = session?.role === "profe" ? profeItems : socioItems;

  return (
    <nav aria-label="Navegación principal" className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#E8ECF4] pb-safe">
      <div className="flex h-16 items-center justify-around max-w-lg mx-auto px-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center gap-0.5 min-w-0 flex-1 py-1"
            >
              <div className={cn(
                "flex items-center justify-center w-11 h-7 rounded-full transition-all duration-200",
                active ? "bg-[#15803D]/10" : ""
              )}>
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    active ? "text-[#15803D]" : "text-[#566070]"
                  )}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span className={cn(
                "text-[10px] truncate transition-all duration-200",
                active ? "text-[#15803D] font-semibold" : "text-[#566070] font-medium"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
