import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Camera,
  CheckCircle2,
  Clapperboard,
  ExternalLink,
  Film,
  Images,
  Library,
  MousePointer2,
  PlayCircle,
  Sparkles,
  Wand2,
} from "lucide-react";
import CourseSwitcher from "@/components/CourseSwitcher";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const lessons = [
  {
    id: "manga",
    href: `${import.meta.env.BASE_URL}manga`,
    label: "第一课",
    title: "AI 漫剧制作完全指南",
    subtitle: "从剧本拆解、场景设定、真人感生成到复杂镜头调度，建立完整的 AI 漫剧制作基本功。",
    icon: Clapperboard,
    accent: "violet",
    stats: ["7 个核心模块", "平台对比", "镜头与分镜方法"],
    path: ["制作概述", "场景设定", "真人感生成", "镜头解析", "分镜设计"],
  },
  {
    id: "libtv",
    href: `${import.meta.env.BASE_URL}libtv`,
    label: "第二课",
    title: "LibTV 从无限画布到视频生成",
    subtitle: "把飞书《LibTV 使用指南》转化为可练习课程，学习节点、工作流、工具、模型和合规要点。",
    icon: MousePointer2,
    accent: "cyan",
    stats: ["5 类基础节点", "工具与模型筛选", "练习清单 + 测验"],
    path: ["无限画布", "节点理解", "工作流搭建", "工具检索", "模型选择"],
  },
  {
    id: "image2",
    href: `${import.meta.env.BASE_URL}image2`,
    label: "第三课",
    title: "GPT Image 2 图像迁移魔法课",
    subtitle: "把风格参考、粗糙机位和跨风格融图整理成可练习流程，学会提示、判断风险和清洗纹理。",
    icon: Images,
    accent: "coral",
    stats: ["3 种迁移玩法", "Prompt Builder", "风险雷达"],
    path: ["看案例", "拆方法", "改提示词", "做练习", "去纹理"],
  },
];

const workflow = [
  { icon: BookOpen, title: "先懂故事", body: "从漫剧制作的叙事、镜头和画面结构开始，先把创作语言立起来。" },
  { icon: Wand2, title: "再用工具", body: "进入 LibTV 画布，把参考图、节点、模型和视频生成串成稳定流程。" },
  { icon: PlayCircle, title: "最后做迁移", body: "用 GPT Image 2 练风格、机位和融图，同时学会排查一致性、画质和纹理问题。" },
];

const lessonAccentStyles = {
  violet: {
    border: "border-violet-200/16 hover:border-violet-200/35",
    icon: "bg-violet-300/12 text-violet-200",
    badge: "bg-violet-300/12 text-violet-200",
    action: "text-violet-200",
  },
  cyan: {
    border: "border-cyan-200/16 hover:border-cyan-200/35",
    icon: "bg-cyan-300/12 text-cyan-200",
    badge: "bg-cyan-300/12 text-cyan-200",
    action: "text-cyan-200",
  },
  coral: {
    border: "border-rose-200/16 hover:border-rose-200/35",
    icon: "bg-rose-300/12 text-rose-200",
    badge: "bg-rose-300/12 text-rose-200",
    action: "text-rose-200",
  },
};

const promoCase = {
  title: "红军辣椒宣传片案例参考",
  href: "https://www.liblib.tv/canvas/share?shareId=QzwuyXVOQ",
  cover: asset("cases/hongjun-chili-promo.png"),
  summary: "用于第二课的 LibTV 画布案例参考。点击封面可直接打开项目，查看宣传片画布、素材和生成链路。",
};

export default function CourseHome() {
  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100">
      <CourseSwitcher current="home" />

      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src={asset("home/course-hub-hero.png")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,20,0.92),rgba(7,11,20,0.62)_45%,rgba(7,11,20,0.18))]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070b14] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-200 ring-1 ring-cyan-200/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">AI Creative Course</p>
                <h1 className="text-sm font-semibold text-slate-200">AI 漫剧课程库</h1>
              </div>
            </div>
            <a
              href={lessons[2].href}
              className="hidden rounded-md border border-white/10 bg-white/8 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur transition hover:bg-white/14 sm:inline-flex"
            >
              继续第三课
            </a>
          </header>

          <div className="max-w-3xl pb-12 pt-24 sm:pb-16 lg:pt-28">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs font-medium text-cyan-100">
                <BadgeCheck className="h-3.5 w-3.5" />
                三节课 · 从创作方法到工具工作流再到图像迁移
              </div>
              <h2 className="max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                AI 漫剧制作、LibTV 与 Image 2 实战课程
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                第一课建立 AI 漫剧制作基本功，第二课进入 LibTV 画布工作流，第三课把 GPT Image 2 的风格迁移、机位迁移和跨风格融图整理成可练习方法。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={lessons[0].href}
                  className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                >
                  进入第一课
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={lessons[1].href}
                  className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/14"
                >
                  进入第二课
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={lessons[2].href}
                  className="inline-flex items-center gap-2 rounded-md border border-rose-200/20 bg-rose-300/12 px-4 py-2.5 text-sm font-semibold text-rose-100 backdrop-blur transition hover:bg-rose-300/18"
                >
                  进入第三课
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {lessons.map((lesson, index) => {
            const Icon = lesson.icon;
            const accent = lessonAccentStyles[lesson.accent as keyof typeof lessonAccentStyles];

            return (
              <motion.a
                key={lesson.id}
                href={lesson.href}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`group rounded-lg border bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:bg-white/[0.07] ${accent.border}`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${accent.badge}`}>
                    {lesson.label}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-white">{lesson.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-7 text-slate-400">{lesson.subtitle}</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {lesson.stats.map((stat) => (
                    <div key={stat} className="rounded-md border border-white/8 bg-black/20 px-3 py-2 text-xs text-slate-300">
                      {stat}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {lesson.path.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1 rounded-md bg-white/6 px-2.5 py-1 text-xs text-slate-400">
                      <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                      {item}
                    </span>
                  ))}
                </div>
                <div className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accent.action}`}>
                  开始学习
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {workflow.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-white/8 bg-white/[0.035] p-5">
                <Icon className="mb-4 h-5 w-5 text-amber-200" />
                <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{item.body}</p>
              </div>
            );
          })}
        </div>

        <motion.a
          href={promoCase.href}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="group mt-8 grid overflow-hidden rounded-lg border border-amber-200/18 bg-white/[0.045] transition hover:-translate-y-1 hover:border-amber-200/35 hover:bg-white/[0.07] lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative min-h-72 overflow-hidden">
            <img src={promoCase.cover} alt={promoCase.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/12 to-[#070b14]/70 lg:bg-gradient-to-r" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/12 bg-black/42 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <Film className="h-3.5 w-3.5 text-amber-200" />
              宣传片案例参考
            </div>
          </div>
          <div className="flex flex-col justify-center p-5 sm:p-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-amber-300/12 text-amber-200">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-white">{promoCase.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{promoCase.summary}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
              打开 LibTV 画布
              <ExternalLink className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </div>
        </motion.a>
      </section>

      <footer className="border-t border-white/8 py-8 text-center text-xs text-slate-600">
        AI 漫剧课程库 · 三节课已整理为独立入口
      </footer>
    </main>
  );
}
