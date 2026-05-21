import { Home, Library, Sparkles } from "lucide-react";

type CourseKey = "home" | "manga" | "libtv";

const base = import.meta.env.BASE_URL;

const links: Array<{ key: CourseKey; label: string; href: string; icon: typeof Home }> = [
  { key: "home", label: "主页", href: base, icon: Home },
  { key: "manga", label: "第一课", href: `${base}manga`, icon: Library },
  { key: "libtv", label: "第二课", href: `${base}libtv`, icon: Sparkles },
];

export default function CourseSwitcher({ current }: { current: CourseKey }) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-1 rounded-lg border border-white/10 bg-[#0a0e1a]/85 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
      {links.map((link) => {
        const Icon = link.icon;
        const active = current === link.key;

        return (
          <a
            key={link.key}
            href={link.href}
            className={`flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition ${
              active
                ? "bg-cyan-300/15 text-cyan-200"
                : "text-slate-400 hover:bg-white/8 hover:text-slate-100"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}
