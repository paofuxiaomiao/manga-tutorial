/**
 * AI漫剧制作教学网页
 * 设计风格：暗色科技感 + 漫画元素融合
 * 面向初学者的交互式学习平台
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Palette, Camera, Film, FileText, Users,
  ChevronDown, ChevronRight, ExternalLink, Sparkles,
  Layers, Eye, Wand2, Clapperboard, ArrowRight,
  CheckCircle2, Lightbulb, AlertTriangle, Zap, Monitor
} from "lucide-react";

// ==================== 配图URLs ====================
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663337528333/bppFKAV5NRAg3uuLc4cMbM/manga-hero-SFF3CuZmUm5arXaEhhZ2b4.webp",
  scene: "https://d2xsxph8kpxj0f.cloudfront.net/310519663337528333/bppFKAV5NRAg3uuLc4cMbM/manga-scene-VeoLDSM4rVp38zcto2Rnzh.webp",
  realistic: "https://d2xsxph8kpxj0f.cloudfront.net/310519663337528333/bppFKAV5NRAg3uuLc4cMbM/manga-realistic-EqpTRpUdPsBPebBpHpUmtC.webp",
  camera: "https://d2xsxph8kpxj0f.cloudfront.net/310519663337528333/bppFKAV5NRAg3uuLc4cMbM/manga-camera-XinXUanubbLzc2zFS2fnJY.webp",
  storyboard: "https://d2xsxph8kpxj0f.cloudfront.net/310519663337528333/bppFKAV5NRAg3uuLc4cMbM/manga-storyboard-3LqAPEkHnEZP4nwhyQTPg8.webp",
};

// ==================== 导航数据 ====================
const NAV_ITEMS = [
  { id: "overview", label: "制作概述", icon: BookOpen },
  { id: "scene", label: "场景设定", icon: Palette },
  { id: "realistic", label: "真人感生成", icon: Eye },
  { id: "camera", label: "镜头解析", icon: Camera },
  { id: "storyboard", label: "分镜设计", icon: Film },
  { id: "pullfilm", label: "拉片方法", icon: FileText },
  { id: "workflow", label: "工作流程", icon: Users },
  { id: "platforms", label: "创作平台", icon: Monitor },
];

// ==================== 主组件 ====================
export default function MangaTutorial() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100">
      {/* ===== 顶部导航栏 ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-semibold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI漫剧</span>
              <span className="text-gray-300 ml-1">制作教程</span>
            </h1>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/5 text-gray-400"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ===== 移动端侧边栏 ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-14 bottom-0 z-40 w-64 bg-[#0d1220] border-r border-white/5 p-4 overflow-y-auto"
            >
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { scrollTo(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${
                      activeSection === item.id
                        ? "bg-violet-500/15 text-violet-300"
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== 主内容 ===== */}
      <main className="pt-14">
        <HeroSection />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <OverviewSection />
          <SceneSection />
          <RealisticSection />
          <CameraSection />
          <StoryboardSection />
          <PullFilmSection />
          <WorkflowSection />
          <PlatformSection />
        </div>
      </main>

      {/* ===== 页脚 ===== */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600">
        <p>AI漫剧制作教程 · 创芽OPC社区出品</p>
      </footer>
    </div>
  );
}

// ==================== Hero ====================
function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/40 via-[#0a0e1a]/60 to-[#0a0e1a]" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            面向初学者的系统化教程
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 font-serif">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
              AI漫剧制作
            </span>
            <br />
            <span className="text-gray-100">完全指南</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
            从剧本拆解到场景设定，从真人感生成到复杂镜头调度，
            系统掌握AI漫剧制作的核心技术与工作流程
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["7大核心模块", "实战案例解析", "工具链全覆盖"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </motion.div>
    </section>
  );
}

// ==================== 通用组件 ====================
function SectionHeader({ id, icon: Icon, title, subtitle, gradient }: {
  id: string; icon: any; title: string; subtitle: string; gradient: string;
}) {
  return (
    <div id={id} className="pt-20 mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent border border-white/10`}>
          <Icon className="w-3.5 h-3.5 text-gray-400" />
          <span>{subtitle}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-gray-100">{title}</h2>
      </motion.div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children, color = "violet" }: {
  icon: any; title: string; children: React.ReactNode; color?: string;
}) {
  const colors: Record<string, string> = {
    violet: "from-violet-500/10 to-violet-500/5 border-violet-500/15",
    cyan: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/15",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/15",
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/15",
    rose: "from-rose-500/10 to-rose-500/5 border-rose-500/15",
  };
  const iconColors: Record<string, string> = {
    violet: "text-violet-400", cyan: "text-cyan-400", amber: "text-amber-400",
    emerald: "text-emerald-400", rose: "text-rose-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`rounded-xl border bg-gradient-to-b ${colors[color]} p-5 sm:p-6`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <Icon className={`w-4.5 h-4.5 ${iconColors[color]}`} />
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
      </div>
      <div className="text-sm text-gray-400 leading-relaxed">{children}</div>
    </motion.div>
  );
}

function TipBox({ type, children }: { type: "tip" | "warning" | "key"; children: React.ReactNode }) {
  const config = {
    tip: { icon: Lightbulb, bg: "bg-emerald-500/8 border-emerald-500/15", iconColor: "text-emerald-400", label: "技巧" },
    warning: { icon: AlertTriangle, bg: "bg-amber-500/8 border-amber-500/15", iconColor: "text-amber-400", label: "注意" },
    key: { icon: Zap, bg: "bg-violet-500/8 border-violet-500/15", iconColor: "text-violet-400", label: "重点" },
  };
  const { icon: TipIcon, bg, iconColor, label } = config[type];
  return (
    <div className={`rounded-lg border ${bg} p-4 my-4`}>
      <div className="flex items-center gap-2 mb-2">
        <TipIcon className={`w-3.5 h-3.5 ${iconColor}`} />
        <span className={`text-xs font-semibold ${iconColor}`}>{label}</span>
      </div>
      <div className="text-sm text-gray-400 leading-relaxed">{children}</div>
    </div>
  );
}

function ExpandableBlock({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/5 rounded-lg overflow-hidden my-3 bg-white/[0.02]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
      >
        <span>{title}</span>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== 模块一：制作概述 ====================
function OverviewSection() {
  const steps = [
    { icon: FileText, label: "剧本拆解", desc: "将故事拆分为可执行的分镜脚本", color: "text-violet-400" },
    { icon: Palette, label: "场景设定", desc: "设计场景概念图与艺术风格", color: "text-cyan-400" },
    { icon: Layers, label: "人物资产", desc: "创建角色设定与一致性参考", color: "text-emerald-400" },
    { icon: Film, label: "分镜设计", desc: "规划镜头语言与画面构图", color: "text-amber-400" },
    { icon: Wand2, label: "AI生成", desc: "使用AI工具生成图片与视频", color: "text-rose-400" },
    { icon: Clapperboard, label: "后期合成", desc: "剪辑、转场、音效与字幕", color: "text-purple-400" },
  ];

  const tools = [
    { name: "MidJourney", desc: "概念图生成", tag: "图像" },
    { name: "星流", desc: "细节修复与风格迁移", tag: "图像" },
    { name: "即梦 4.5", desc: "服装一致性生成", tag: "图像" },
    { name: "可灵", desc: "视频生成", tag: "视频" },
    { name: "Nano", desc: "四宫格分镜生成", tag: "图像" },
    { name: "Gemini", desc: "分镜助手与剧本分析", tag: "AI助手" },
    { name: "豆包", desc: "抠图与画面补全", tag: "图像" },
    { name: "SEEDANCE 2.0", desc: "高质量视频生成", tag: "视频" },
  ];

  return (
    <section>
      <SectionHeader
        id="overview"
        icon={BookOpen}
        title="AI漫剧制作概述"
        subtitle="MODULE 01"
        gradient="from-violet-400 to-cyan-400"
      />

      <p className="text-sm text-gray-400 leading-relaxed mb-8">
        AI漫剧是一种利用人工智能工具辅助完成从剧本到成片全流程的新型漫画/动画制作方式。
        相比传统制作，AI漫剧大幅降低了美术门槛，让创作者能够专注于故事本身。
        下面是完整的制作流程：
      </p>

      {/* 流程步骤 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative group"
            >
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 text-center hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-200 mb-1">{step.label}</div>
                <div className="text-[11px] text-gray-500 leading-snug">{step.desc}</div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 工具链 */}
      <h3 className="text-lg font-semibold text-gray-200 mb-4 font-serif">常用工具链</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {tools.map((tool) => (
          <div key={tool.name} className="rounded-lg bg-white/[0.03] border border-white/5 p-3.5 hover:bg-white/[0.06] transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-200">{tool.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-medium">{tool.tag}</span>
            </div>
            <p className="text-xs text-gray-500">{tool.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==================== 模块二：场景设定 ====================
function SceneSection() {
  return (
    <section>
      <SectionHeader
        id="scene"
        icon={Palette}
        title="场景设定：快、准、狠"
        subtitle="MODULE 02"
        gradient="from-cyan-400 to-emerald-400"
      />

      <div className="rounded-xl overflow-hidden mb-8 border border-white/5">
        <img src={IMAGES.scene} alt="AI场景设计工作流" className="w-full" />
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        场景设定是AI漫剧制作的基础环节。在接到任务时，首先需要确定设定图的标准（是否4K、画面比例）、
        艺术风格选择，以及场景是否会在剧本中重复出现、是否有额外的说明或伏笔。
        场景的氛围需要与人物搭配，让人物能和谐融入场景中。
      </p>

      {/* 三原则 */}
      <h3 className="text-lg font-semibold text-gray-200 mb-4 font-serif">场景设定三原则</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <InfoCard icon={Zap} title="快 — 高辨识度" color="cyan">
          <p>快速交代清楚背景地点信息和人物关系、阶级差异。参考《木塘想象力》的高辨识度场景设计。</p>
        </InfoCard>
        <InfoCard icon={CheckCircle2} title="准 — 冲突催化剂" color="emerald">
          <p>场景本身就是冲突的催化剂，准确服务于叙事需要。场景设计要能推动剧情发展。</p>
        </InfoCard>
        <InfoCard icon={Sparkles} title="狠 — 放大情绪" color="rose">
          <p>场景要能放大角色的情绪表达。可以参考「斩仙台」开场的情绪渲染方式。</p>
        </InfoCard>
      </div>

      {/* 黄金场景 */}
      <TipBox type="key">
        <p className="font-semibold text-gray-300 mb-2">最常用的黄金场景类型：</p>
        <div className="grid grid-cols-3 gap-2">
          {["身份反转场景", "偶遇重逢场景", "公开场景"].map(s => (
            <div key={s} className="text-center py-2 rounded-md bg-violet-500/10 text-violet-300 text-xs font-medium">{s}</div>
          ))}
        </div>
      </TipBox>

      {/* 设计技巧 */}
      <h3 className="text-lg font-semibold text-gray-200 mb-4 mt-8 font-serif">场景设计技巧</h3>
      <div className="space-y-2 mb-6">
        {[
          { title: "标志性道具快速定位", desc: "用一个标志性道具就能让观众瞬间理解场景含义和角色身份" },
          { title: "AB场景对比", desc: "通过两个场景的强烈对比来突出角色处境变化或情绪反差" },
          { title: "场景即人设", desc: "用场景细节展现人物人设，环境就是角色性格的外化" },
        ].map(item => (
          <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-200">{item.title}</span>
              <span className="text-sm text-gray-500 ml-2">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <TipBox type="warning">
        <p className="font-semibold text-gray-300 mb-1">三个坑要避免：</p>
        <p>场景别太碎（切换不要超过三个）、场景别太多（保持叙事聚焦）、避免无意义的场景堆砌。</p>
      </TipBox>

      {/* AI场景设定技巧 */}
      <h3 className="text-lg font-semibold text-gray-200 mb-4 mt-8 font-serif">AI场景设定技巧</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoCard icon={Wand2} title="MJ概念图 → 星流修复" color="violet">
          <p>先用MidJourney生成概念图，再用星流修复细节。生成草图后做风格迁移，效率更高。</p>
        </InfoCard>
        <InfoCard icon={Layers} title="Gemini分镜助手" color="cyan">
          <p>用Gemini分镜助手生成多分解图，或直接用Nano生成四宫格分镜。也可以直接给星流剧本生成对应设计。</p>
        </InfoCard>
        <InfoCard icon={Eye} title="豆包抠图补全" color="emerald">
          <p>使用豆包的抠图功能补全画面细节。在文生图模式下可以直接进行提示词删改，无需额外工具。</p>
        </InfoCard>
        <InfoCard icon={Sparkles} title="场景卡 + 风格卡" color="amber">
          <p>借助AI生成场景卡和艺术风格卡，利用AI的阅读能力解决场景隐含设定的问题。根据参考片风格准备2-3种风格选择。</p>
        </InfoCard>
      </div>

      <ExpandableBlock title="实战案例：修仙风格场景设定提示词">
        <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-gray-400 leading-relaxed overflow-x-auto">
          <p className="text-violet-300 mb-2">// 场景卡示例</p>
          <p>进行场景设计（Environment Design），画面风格：3D修仙风格UE5渲染</p>
          <p className="mt-2">场景卡【绩效考核法术阵｜核心冲突：现代管理术语 vs 传统修仙规则</p>
          <p>- 画面风格：CG风格修仙、赛博朋克光影</p>
          <p>- 场景定位：修仙界悬崖边暴雨夜</p>
          <p>- 核心元素：暴雨中的悬崖边缘、绿色长袍追杀者、悬浮的火球术、空中投影的PPT虚影</p>
          <p>- 视觉冲突：现代办公术语引发古老灵力共鸣】</p>
          <p className="mt-2 text-cyan-300">// 依次生成：</p>
          <p>1.【构图设定表】低角度仰拍视角，陈闲位于画面中心...</p>
          <p>2.【元素分解表】传统修仙元素 + 现代元素 + 融合点...</p>
          <p>3.【风格渲染表】色彩基调 + 质感表现 + 参考风格...</p>
        </div>
      </ExpandableBlock>
    </section>
  );
}

// ==================== 模块三：真人感生成 ====================
function RealisticSection() {
  const keywords = [
    { category: "皮肤质感", items: ["皮肤微小绒毛", "红润质感", "真实微小瑕疵", "血管起伏"] },
    { category: "头发细节", items: ["发丝真实飘逸", "自然光泽", "层次分明"] },
    { category: "五官表情", items: ["完全真人比例", "面部肌肉和谐", "细微容貌变化"] },
    { category: "去AI味", items: ["不要过度光滑", "不要肌肉僵硬", "避免塑料感"] },
  ];

  return (
    <section>
      <SectionHeader
        id="realistic"
        icon={Eye}
        title="真人感图片生成"
        subtitle="MODULE 03"
        gradient="from-rose-400 to-amber-400"
      />

      <div className="rounded-xl overflow-hidden mb-8 border border-white/5">
        <img src={IMAGES.realistic} alt="真人感生成对比" className="w-full" />
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        真人感是AI漫剧区别于传统动画的关键特征之一。通过精确的提示词控制和工具选择，
        可以生成接近真人质感的角色图片。核心在于消除"AI味"——即过度光滑、缺乏细节的塑料感。
      </p>

      <TipBox type="tip">
        <p>推荐使用<strong className="text-gray-200">即梦4.5</strong>生成服装一致性图片，配合关键词"高清、自然、写实"来增强真人感。</p>
      </TipBox>

      <h3 className="text-lg font-semibold text-gray-200 mb-4 mt-8 font-serif">真人感关键词体系</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {keywords.map(group => (
          <div key={group.category} className="rounded-lg bg-white/[0.03] border border-white/5 p-4">
            <h4 className="text-sm font-semibold text-gray-200 mb-3">{group.category}</h4>
            <div className="flex flex-wrap gap-2">
              {group.items.map(item => (
                <span key={item} className="px-2.5 py-1 rounded-md bg-rose-500/8 border border-rose-500/15 text-rose-300 text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TipBox type="warning">
        <p>常见问题：生成的人物"塑料感"严重。解决方法是在提示词中明确要求"皮肤有微小绒毛和真实瑕疵"，
        避免使用"完美皮肤""光滑无瑕"等关键词。同时注意五官比例要符合真人标准，不要过度美化。</p>
      </TipBox>
    </section>
  );
}

// ==================== 模块四：复杂镜头解析 ====================
function CameraSection() {
  const shotStructure = [
    { name: "镜头定位", desc: "类型、机位、运动方式、核心表达", icon: "🎬" },
    { name: "开始画面 Frame In", desc: "初始构图、色调、空间关系建立", icon: "📍" },
    { name: "镜头运动 Movement", desc: "平移/推拉/俯仰的速度与方向", icon: "🎥" },
    { name: "前景介入 Foreground", desc: "前景元素的切入时机与方式", icon: "👤" },
    { name: "景深关系 Depth", desc: "前景清晰/中景过渡/背景虚化", icon: "🔍" },
    { name: "叙事关系 Meaning", desc: "镜头传达的隐含叙事信息", icon: "🧠" },
    { name: "结束画面 Frame Out", desc: "镜头结束时的构图与状态", icon: "🎯" },
  ];

  return (
    <section>
      <SectionHeader
        id="camera"
        icon={Camera}
        title="复杂镜头解析"
        subtitle="MODULE 04"
        gradient="from-amber-400 to-rose-400"
      />

      <div className="rounded-xl overflow-hidden mb-8 border border-white/5">
        <img src={IMAGES.camera} alt="复杂镜头解析" className="w-full" />
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        复杂镜头是AI漫剧制作中最具挑战性的部分。一个专业的镜头调度稿需要精确描述
        从开始到结束的每一个画面变化，包括机位、运动、景深、前景元素和叙事关系。
      </p>

      <h3 className="text-lg font-semibold text-gray-200 mb-4 font-serif">专业镜头调度稿结构</h3>
      <div className="space-y-2 mb-8">
        {shotStructure.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <div>
              <span className="text-sm font-medium text-gray-200">{item.name}</span>
              <span className="text-sm text-gray-500 ml-2">{item.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-200 mb-4 font-serif">难点与解决策略</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <InfoCard icon={AlertTriangle} title="常见难点" color="rose">
          <ul className="space-y-1.5">
            <li>· 模型不理解空间关系</li>
            <li>· 视角刁钻，人物众多</li>
            <li>· 主体多且杂，位置分布无规律</li>
            <li>· 远近层次难以表达</li>
          </ul>
        </InfoCard>
        <InfoCard icon={Lightbulb} title="解决策略" color="emerald">
          <ul className="space-y-1.5">
            <li>· 用多参考图解决复杂主体关系</li>
            <li>· 多视角提供更多空间关系信息</li>
            <li>· 连续首尾帧定镜头位置与运镜</li>
            <li>· 长运镜拆分成短运镜，从近拉远反向输出</li>
          </ul>
        </InfoCard>
      </div>

      <TipBox type="key">
        <p>模型选择建议：优先尝试强模型如SEEDANCE 2.0，但注意排队时间。
        如果遇到无法生成的情况，可以退而求其次使用可灵等替代方案，
        通过多次迭代和参考图引导来逼近目标效果。</p>
      </TipBox>
    </section>
  );
}

// ==================== 模块五：分镜设计 ====================
function StoryboardSection() {
  const sampleShots = [
    { id: "1-1", time: "0-3s", desc: "全景·城市夜景，霓虹灯闪烁", camera: "缓慢推进", audio: "城市环境音" },
    { id: "1-2", time: "3-5s", desc: "中景·财神爷从天而降", camera: "跟踪下移", audio: "风声+铃铛" },
    { id: "1-3", time: "5-8s", desc: "近景·财神爷手持元宝微笑", camera: "静止", audio: "欢快BGM起" },
    { id: "2-1", time: "8-11s", desc: "全景·饭店内部，一家人围桌", camera: "缓慢右移", audio: "碗筷声+笑声" },
    { id: "2-2", time: "11-14s", desc: "特写·红烧肉冒着热气", camera: "微推", audio: "滋滋声" },
    { id: "2-3", time: "14-16s", desc: "中景·财神爷闯入画面", camera: "快速横移", audio: "惊叹声" },
  ];

  return (
    <section>
      <SectionHeader
        id="storyboard"
        icon={Film}
        title="分镜设计实战"
        subtitle="MODULE 05"
        gradient="from-emerald-400 to-cyan-400"
      />

      <div className="rounded-xl overflow-hidden mb-8 border border-white/5">
        <img src={IMAGES.storyboard} alt="分镜设计模板" className="w-full" />
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        分镜表是将剧本转化为可执行画面的关键文档。每个分镜需要包含序号、时间、
        画面描述、运镜特效和音效台词等要素。以《一桌好菜》宣传片为例，
        全片共47个分镜，涵盖了从城市全景到食物特写的完整镜头语言。
      </p>

      <h3 className="text-lg font-semibold text-gray-200 mb-4 font-serif">分镜表示例</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">序号</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">时间</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">画面描述</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">运镜</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">音效</th>
            </tr>
          </thead>
          <tbody>
            {sampleShots.map((shot, i) => (
              <tr key={shot.id} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                <td className="py-2.5 px-3 text-violet-400 font-mono text-xs">{shot.id}</td>
                <td className="py-2.5 px-3 text-gray-400 font-mono text-xs">{shot.time}</td>
                <td className="py-2.5 px-3 text-gray-300">{shot.desc}</td>
                <td className="py-2.5 px-3 text-cyan-400 text-xs">{shot.camera}</td>
                <td className="py-2.5 px-3 text-gray-500 text-xs">{shot.audio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TipBox type="tip">
        <p>分镜设计的关键在于<strong className="text-gray-200">景别变化</strong>和<strong className="text-gray-200">运镜设计</strong>。
        避免连续使用相同景别，通过全景→中景→特写的切换来引导观众视线。
        转场方面，每个镜头结束时角色或物体要"出画"，下一个镜头从画外"入画"，
        这样后期剪辑时能实现自然衔接。</p>
      </TipBox>
    </section>
  );
}

// ==================== 模块六：拉片方法 ====================
function PullFilmSection() {
  return (
    <section>
      <SectionHeader
        id="pullfilm"
        icon={FileText}
        title="拉片笔记方法"
        subtitle="MODULE 06"
        gradient="from-purple-400 to-violet-400"
      />

      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        拉片是提升漫剧制作水平的重要学习方法。通过系统化地分析优秀作品的镜头语言、
        叙事结构和节奏控制，可以快速积累制作经验。以下是拉片笔记的标准模板：
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <InfoCard icon={FileText} title="基础信息" color="violet">
          <ul className="space-y-1">
            <li>· 视频标题与对标账号</li>
            <li>· 核心目的（娱乐/教育/营销）</li>
            <li>· 视频时长与画面比例</li>
            <li>· 整体风格与色调</li>
          </ul>
        </InfoCard>
        <InfoCard icon={Zap} title="节奏与感受" color="cyan">
          <ul className="space-y-1">
            <li>· 0-3秒的第一感受</li>
            <li>· 完播动力来源分析</li>
            <li>· BGM变化点标记</li>
            <li>· 情绪曲线走向</li>
          </ul>
        </InfoCard>
        <InfoCard icon={Camera} title="分镜拆解" color="emerald">
          <ul className="space-y-1">
            <li>· 逐镜截图 + 文字描述</li>
            <li>· 关键转折点标注</li>
            <li>· 景别与运镜记录</li>
            <li>· 转场方式分析</li>
          </ul>
        </InfoCard>
        <InfoCard icon={BookOpen} title="叙事结构" color="amber">
          <ul className="space-y-1">
            <li>· 起承转合节点</li>
            <li>· 悬念设置方式</li>
            <li>· 信息密度分布</li>
            <li>· 可借鉴的技巧</li>
          </ul>
        </InfoCard>
      </div>

      <TipBox type="tip">
        <p>推荐找一些漫剧如「斩仙台」参考画面构成以及分镜处理。
        拉片时重点关注：开头3秒如何抓住注意力、中间如何维持节奏、结尾如何留下悬念。</p>
      </TipBox>
    </section>
  );
}

// ==================== 模块七：工作流程 ====================
function WorkflowSection() {
  const problems = [
    { problem: "塑料感严重", solution: "增加真人感关键词，调整五官比例，避免过度美化" },
    { problem: "生成混乱", solution: "有序工作，先确定风格再批量生成，保持参考图一致" },
    { problem: "速度慢/排队久", solution: "选择合适的模型，避开高峰期，准备备选方案" },
    { problem: "废片率高", solution: "积累经验，建立提示词库，多次迭代优化" },
    { problem: "镜头不连贯", solution: "出画→入画衔接，后期剪辑弥补AI转场不足" },
    { problem: "Logo/文字乱码", solution: "专人审核，规范中英文，防止画面中出现不规范文字" },
  ];

  return (
    <section>
      <SectionHeader
        id="workflow"
        icon={Users}
        title="工作流程与团队协作"
        subtitle="MODULE 07"
        gradient="from-cyan-400 to-violet-400"
      />

      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        AI漫剧制作是一个团队协作的过程，通常分为图片组、视频组和剪辑组。
        高效的工作流程和明确的质量标准是保证成片质量的关键。
      </p>

      <h3 className="text-lg font-semibold text-gray-200 mb-4 font-serif">常见问题与解决方案</h3>
      <div className="space-y-2 mb-8">
        {problems.map((item) => (
          <div key={item.problem} className="flex items-start gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/5">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-200">{item.problem}</span>
              <ArrowRight className="w-3 h-3 text-gray-600 inline mx-2" />
              <span className="text-sm text-gray-400">{item.solution}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-200 mb-4 font-serif">质量把控要点</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <InfoCard icon={Eye} title="画面审核" color="violet">
          <p>所有画面中出现的文字要防止乱码，Logo要规范中英文，不同场景间保持一致性。</p>
        </InfoCard>
        <InfoCard icon={Film} title="转场处理" color="cyan">
          <p>生成视频时确保角色出画，下一镜从画外入画。不能完全依靠AI做复杂转场，后期剪辑要弥补。</p>
        </InfoCard>
        <InfoCard icon={Camera} title="景别与细节" color="emerald">
          <p>注意景别变化和细节丰富度。避免每次都是同一角度，增加第一视角、特写等多样化视角。</p>
        </InfoCard>
      </div>

      <TipBox type="key">
        <p>核心原则：<strong className="text-gray-200">有序工作、交付成品片段、积累经验</strong>。
        每完成一个镜头就要确保它是可用的成品，而不是等到最后才发现问题。
        团队成员之间要及时沟通，图片组完成后视频组立即跟进，避免等待浪费时间。</p>
      </TipBox>
    </section>
  );
}

// ==================== 模块八：AI漫剧创作平台 ====================
function PlatformSection() {
  const platforms = [
    {
      name: "Octo（小章鱼）",
      company: "字节跳动 / 即梦AI",
      url: "https://jimeng.jianying.com",
      color: "violet",
      tagline: "AI原生动态叙事创作工具",
      desc: "Octo 主打\u201CVibe Create\u201D（共感创作）理念，通过对话式交互与创作者深度协作，将AI从被动执行工具转变为创意合伙人。用户只需用自然语言描述想法，Octo可协助完善剧情、设计角色、构建世界观，实时生成概念图与分镜预览。",
      features: [
        "对话式共创 — 像开剧本会一样聊天即可创作",
        "智能资产看板 — 自动生成角色/场景/风格资产",
        "多模态素材解析 — 上传PDF剧本、图片等自动分析",
        "调用Seedance 2.0 — 自动拆分场次生成视频并剪辑导出",
      ],
      status: "内测阶段",
    },
    {
      name: "Seko",
      company: "商汤科技",
      url: "https://seko.sensetime.com",
      color: "cyan",
      tagline: "行业首款创编一体AI视频生成智能体",
      desc: "Seko是商汤科技推出的AI视频创作Agent，支持输入一句话想法即可自动生成包含剧本、角色、画面、镜头、配音在内的完整视频。Seko 2.0支持多达100集剧集生成，确保人物、场景及道具跨集一致性，制作时间缩短超80%。",
      features: [
        "一句话生成完整视频 — 剧本、角色、画面、配音一步到位",
        "100集剧集生成 — 跨集人物/场景/道具一致性保持",
        "擅长解说漫、AI音乐MV、AI真人剧",
        "20万+创作者 — 孵化作品登顶抖音AI短剧榜",
      ],
      status: "已上线（Seko 2.0）",
    },
    {
      name: "RHTV",
      company: "RunningHub",
      url: "https://www.runninghub.cn",
      color: "emerald",
      tagline: "原生AI智能体驱动的一站式内容创作平台",
      desc: "RHTV是RunningHub推出的内容创作平台，核心是一张搭载了原生AI智能体的无限画布。智能体为画布原生内置，无需跳转或挂载外部工具，背靠RunningHub庞大开源生态，支持ComfyUI工作流，实现AI换脸、精修、双模型视频生成、一站式剪辑等全流程能力。",
      features: [
        "画布原生Agent — 智能体内置，自动分析任务复杂度匹配路径",
        "ComfyUI工作流 — 背靠RunningHub开源生态",
        "内置多场景模板 — 品牌设计、TVC广告、AI漫剧、营销等",
        "AI换脸+精修+双模型视频 — 全部在同一张无限画布内完成",
      ],
      status: "已上线",
    },
    {
      name: "LibTV",
      company: "LiblibAI（哩布哩布）",
      url: "https://www.liblib.tv",
      color: "amber",
      tagline: "同时为人类和Agent设计的AI视频创作平台",
      desc: "LibTV是LiblibAI发布的专业AI视频创作平台，创新推出双版本设计：人类创作者用无限画布搭工作流，AI Agent用Skill接口自动干活。支持20+图像模型、30+视频模型，节点可自由拖拽连线，实现从脚本、分镜、角色、画面到成片的全流程AI视频创作。",
      features: [
        "双入口设计 — 人类用画布，Agent用Skill接口",
        "20+图像模型 / 30+视频模型 — 模型丰富可选",
        "节点式工作流 — 自由拖拽连线，灵活编排",
        "龙虾Agent接入 — 支持一键复刻爆款短剧",
      ],
      status: "已上线（含免费版）",
    },
  ];

  return (
    <section>
      <SectionHeader
        id="platforms"
        icon={Monitor}
        title="AI漫剧创作平台"
        subtitle="MODULE 08"
        gradient="from-amber-400 to-rose-400"
      />

      <p className="text-sm text-gray-400 leading-relaxed mb-8">
        随着AI漫剧行业的快速发展，多个大厂纷纷推出专业级创作平台，
        覆盖从剧本到成片的全流程。以下是目前主流的四大AI漫剧创作平台，
        各有侧重，创作者可根据自身需求选择。
      </p>

      {/* 平台卡片 */}
      <div className="space-y-5 mb-10">
        {platforms.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-xl border bg-gradient-to-b p-5 sm:p-6 ${
              p.color === "violet" ? "from-violet-500/10 to-violet-500/5 border-violet-500/15" :
              p.color === "cyan" ? "from-cyan-500/10 to-cyan-500/5 border-cyan-500/15" :
              p.color === "emerald" ? "from-emerald-500/10 to-emerald-500/5 border-emerald-500/15" :
              "from-amber-500/10 to-amber-500/5 border-amber-500/15"
            }`}
          >
            {/* 头部 */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="text-base font-bold text-gray-100">{p.name}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    p.color === "violet" ? "bg-violet-500/15 text-violet-400" :
                    p.color === "cyan" ? "bg-cyan-500/15 text-cyan-400" :
                    p.color === "emerald" ? "bg-emerald-500/15 text-emerald-400" :
                    "bg-amber-500/15 text-amber-400"
                  }`}>{p.status}</span>
                </div>
                <p className="text-xs text-gray-500">{p.company} · {p.tagline}</p>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* 描述 */}
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{p.desc}</p>

            {/* 特性列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.features.map((f) => (
                <div key={f} className="flex items-start gap-2 text-xs text-gray-400">
                  <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    p.color === "violet" ? "text-violet-400" :
                    p.color === "cyan" ? "text-cyan-400" :
                    p.color === "emerald" ? "text-emerald-400" :
                    "text-amber-400"
                  }`} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 对比表 */}
      <h3 className="text-lg font-semibold text-gray-200 mb-4 font-serif">平台对比</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-xs text-gray-400 border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-3 text-gray-300 font-semibold">对比维度</th>
              <th className="text-left py-3 px-3 text-violet-400 font-semibold">Octo</th>
              <th className="text-left py-3 px-3 text-cyan-400 font-semibold">Seko</th>
              <th className="text-left py-3 px-3 text-emerald-400 font-semibold">RHTV</th>
              <th className="text-left py-3 px-3 text-amber-400 font-semibold">LibTV</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["开发者", "字节/即梦AI", "商汤科技", "RunningHub", "LiblibAI"],
              ["交互方式", "对话式共创", "一句话生成", "画布+Agent", "画布+节点工作流"],
              ["核心优势", "叙事共创能力", "极致易用性", "开源生态支撑", "双入口+模型丰富"],
              ["视频引擎", "Seedance 2.0", "商汤自研", "ComfyUI工作流", "20+图像/30+视频模型"],
              ["剧集支持", "多场次拆分", "最多100集", "单集/多集", "全流程支持"],
              ["适合人群", "有灵感缺执行的创作者", "追求效率的内容团队", "专业技术创作者", "全民创作者/Agent开发者"],
            ].map((row, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className={`py-2.5 px-3 ${j === 0 ? "text-gray-300 font-medium" : ""}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TipBox type="tip">
        <p><strong className="text-gray-200">选择建议：</strong>
        如果你有模糊的灵感需要AI帮你完善故事，选<strong className="text-violet-300">Octo</strong>；
        如果你追求极致效率一句话出片，选<strong className="text-cyan-300">Seko</strong>；
        如果你是技术流想要最大控制力，选<strong className="text-emerald-300">RHTV</strong>；
        如果你想要模型多样性和Agent自动化，选<strong className="text-amber-300">LibTV</strong>。
        实际创作中可以组合使用，发挥各平台优势。</p>
      </TipBox>
    </section>
  );
}
