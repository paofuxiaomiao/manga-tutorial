/**
 * LibTV interactive course
 * Built from the Feishu wiki guide and shaped to match the original manga-tutorial
 * single-page learning format: dark course UI, modular cards, step-by-step flows,
 * filters, progress tracking, and readable practice notes.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Box,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Film,
  Grid3X3,
  Image,
  Keyboard,
  Layers,
  Lightbulb,
  ListChecks,
  Maximize2,
  Mic2,
  Monitor,
  MousePointer2,
  PanelLeft,
  PlayCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  SplitSquareHorizontal,
  Star,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import CourseSwitcher from "@/components/CourseSwitcher";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const ORIGINAL_DOC_URL = "https://resonate.feishu.cn/wiki/Loxfw6XHziYRk0kKzdjcFfp9nhb";
const PROMO_CASE = {
  title: "红军辣椒宣传片案例参考",
  href: "https://www.liblib.tv/canvas/share?shareId=QzwuyXVOQ",
  cover: asset("cases/hongjun-chili-promo.png"),
  summary: "用作第二课的案例参考。点击封面进入 LibTV 画布，可对照课程里的节点、工作流和素材管理方法观察完整宣传片项目。",
};

const SOURCE_IMAGES = {
  canvasEntry: asset("libtv/source/canvas-entry.png"),
  nodeTypes: asset("libtv/source/node-types.png"),
  workflowOverview: asset("libtv/source/workflow-overview.png"),
  canvasPanels: asset("libtv/source/canvas-panels.png"),
  slashMenu: asset("libtv/source/slash-menu.png"),
  imageToolMenu: asset("libtv/source/image-tool-menu.png"),
  panorama720: asset("libtv/source/panorama-720.png"),
  lightingTool: asset("libtv/source/lighting-tool.png"),
  gridStoryboard: asset("libtv/source/grid-storyboard.png"),
  videoToolMenu: asset("libtv/source/video-tool-menu.png"),
  styleLibrary: asset("libtv/source/style-library.png"),
  subjectLibrary: asset("libtv/source/subject-library.png"),
  complianceCheck: asset("libtv/source/compliance-check.png"),
  shortcutEntry: asset("libtv/source/shortcut-entry.png"),
};

const NAV_ITEMS = [
  { id: "overview", label: "课程总览", icon: BookOpen },
  { id: "canvas", label: "无限画布", icon: MousePointer2 },
  { id: "workflow", label: "工作流搭建", icon: SplitSquareHorizontal },
  { id: "case", label: "案例参考", icon: Camera },
  { id: "tools", label: "实用工具", icon: Wand2 },
  { id: "models", label: "模型清单", icon: Layers },
  { id: "compliance", label: "合规与音色", icon: ShieldCheck },
  { id: "practice", label: "练习与测验", icon: ClipboardCheck },
  { id: "shortcuts", label: "快捷键", icon: Keyboard },
  { id: "source", label: "原文配图", icon: ExternalLink },
];

const SHORTCUT_GROUPS: Array<{
  title: string;
  icon: typeof BookOpen;
  tone: ToolTone;
  items: Array<{ action: string; keys: string[]; after?: string }>;
}> = [
  {
    title: "创作",
    icon: Sparkles,
    tone: "cyan",
    items: [
      { action: "成组", keys: ["⌘", "G"] },
      { action: "合并分镜组", keys: ["⌘", "⌥", "G"] },
      { action: "解组", keys: ["⌘", "⇧", "G"] },
      { action: "连线", keys: ["⌘", "L"] },
      { action: "复制整组", keys: ["⌘", "⇧", "C"] },
      { action: "生成", keys: ["⌘", "Enter"] },
      { action: "新建节点", keys: ["Tab"] },
      { action: "节点复制", keys: ["Option"], after: "+ 拖动节点" },
      { action: "创建副本", keys: ["⌘", "Option"], after: "+ 拖动" },
    ],
  },
  {
    title: "缩放",
    icon: Maximize2,
    tone: "emerald",
    items: [
      { action: "放大", keys: ["⌘", "+"] },
      { action: "缩小", keys: ["⌘", "-"] },
      { action: "适应画布", keys: ["⌘", "0"] },
      { action: "触控板缩放", keys: ["双指捏合"] },
      { action: "鼠标缩放", keys: ["⌘"], after: "+ 鼠标滚轮" },
    ],
  },
  {
    title: "移动画布",
    icon: MousePointer2,
    tone: "violet",
    items: [
      { action: "键盘移动", keys: ["Space"], after: "+ 拖动画布" },
      { action: "触控板移动", keys: ["双指拖动"] },
      { action: "鼠标移动", keys: ["鼠标滚轮"] },
      { action: "整理画布", keys: ["⌥", "⇧", "F"] },
    ],
  },
  {
    title: "其他",
    icon: RotateCcw,
    tone: "amber",
    items: [
      { action: "撤销", keys: ["⌘", "Z"] },
      { action: "重做", keys: ["⌘", "⇧", "Z"] },
      { action: "删除", keys: ["Delete"] },
    ],
  },
];

const COURSE_MODULES = [
  {
    id: "start",
    title: "进入 LibTV",
    duration: "5 分钟",
    level: "入门",
    icon: Monitor,
    summary: "从首页的「开始创作」进入无限画布，并理解一个画布就是一个项目。",
    checkpoints: ["找到「最新项目」中的开始创作", "知道「全部项目」的两个入口", "会双击画布名称重命名项目"],
  },
  {
    id: "nodes",
    title: "五大基础节点",
    duration: "18 分钟",
    level: "核心",
    icon: Box,
    summary: "掌握文本、图片、视频、音频、脚本五类节点的输入来源与生成方式。",
    checkpoints: ["双击空白处新建节点", "拖入图片/视频/音频素材", "理解模型生成结果会回到对应节点"],
  },
  {
    id: "workflow",
    title: "连接成工作流",
    duration: "20 分钟",
    level: "核心",
    icon: SplitSquareHorizontal,
    summary: "用连线把参考图、角色设定、图像生成、视频生成组合成可复用流程。",
    checkpoints: ["从参考图拉线创建图片节点", "把角色设定文本接入提示词", "生成图像后连接视频节点"],
  },
  {
    id: "tools",
    title: "图像与视频工具",
    duration: "30 分钟",
    level: "进阶",
    icon: Wand2,
    summary: "用 Slash 快捷功能、全景、多角度、打光、分镜组、视频合成提升创作效率。",
    checkpoints: ["会用 / 调用快捷功能", "会把 9 宫格切成单张分镜", "会使用视频解析和视频合成"],
  },
  {
    id: "models",
    title: "模型选择",
    duration: "25 分钟",
    level: "进阶",
    icon: Layers,
    summary: "根据任务选择图像、视频、语言和音频模型，避免在错误入口浪费时间。",
    checkpoints: ["区分文生、图生、首尾帧、全能参考", "理解 Seedance 2.0 的参考限制", "知道音频模型的适用场景"],
  },
];

const NODE_CARDS: Array<{
  title: string;
  icon: typeof BookOpen;
  color: ToolTone;
  body: string;
  tips: string[];
}> = [
  {
    title: "文本节点",
    icon: FileText,
    color: "violet",
    body: "承载剧本、角色设定、提示词和模型生成文本。可手写，也可调用语言大模型生成。",
    tips: ["适合写角色设定", "可作为下游节点提示词", "推荐保留结构化字段"],
  },
  {
    title: "图片节点",
    icon: Image,
    color: "cyan",
    body: "承载上传图片或图像模型结果，支持文生图、图生图、多图融合和图像编辑。",
    tips: ["可作为风格参考", "可进入全景预览", "可用多角度和打光工具"],
  },
  {
    title: "视频节点",
    icon: Film,
    color: "rose",
    body: "承载上传视频或视频模型结果，支持文生、图生、首尾帧、多模态参考和视频编辑。",
    tips: ["可做视频解析", "可高清放大或补帧", "可接入视频合成"],
  },
  {
    title: "音频节点",
    icon: Mic2,
    color: "amber",
    body: "承载音频素材或音频模型结果，适合生成音乐、音效、配音或为视频提供参考。",
    tips: ["可生成 TTS", "可与视频合成", "可做声音克隆"],
  },
  {
    title: "脚本节点",
    icon: Clapperboard,
    color: "emerald",
    body: "通过剧情、剧本、角色图或参考视频生成分镜脚本，并批量生成分镜图片与视频。",
    tips: ["可切换卡片视图", "支持全屏编辑表格", "适合批量分镜生产"],
  },
];

const WORKFLOW_STEPS = [
  {
    title: "上传风格参考图",
    detail: "从风格参考图右侧拉线，新建图片节点；参考图会自动进入新节点生成器。",
    icon: Image,
  },
  {
    title: "接入角色设定",
    detail: "把角色设定写进文本节点，再连接到图片节点，让它成为提示词的一部分。",
    icon: FileText,
  },
  {
    title: "生成关键画面",
    detail: "在图片生成器中输入需求，选择模型、比例、张数，生成符合风格的画面。",
    icon: Sparkles,
  },
  {
    title: "图像转视频",
    detail: "从生成图右侧拉线创建视频节点，输入动态提示词，选择视频模型和时长。",
    icon: Film,
  },
  {
    title: "打组并复用",
    detail: "全选工作流后 Ctrl/Cmd+G 打组，可创建工作流、保存到工具箱并整组执行。",
    icon: Layers,
  },
];

const TOOL_GROUPS = [
  {
    id: "slash",
    title: "Slash 快捷功能",
    icon: Zap,
    cover: SOURCE_IMAGES.slashMenu,
    summary: "在带参考图的图像生成器中输入 /，快速调用智能分镜、角色视图和画面推演。",
    items: ["多机位九宫格", "剧情推演四宫格", "25 宫格连贯分镜", "电影级光影矫正", "角色三视图生成", "画面推演 3 秒后/5 秒前"],
  },
  {
    id: "image-tools",
    title: "图像工具",
    icon: Image,
    cover: SOURCE_IMAGES.imageToolMenu,
    summary: "图像节点顶部菜单提供全景、多角度、打光、高清、扩图、重绘、擦除、抠图、裁剪等工具。",
    items: ["720 全景图与视角截图", "8 个水平环绕点位", "26 个主光点位与 9 个轮廓光点位", "宫格切分", "标注重绘", "旋转与镜像"],
  },
  {
    id: "storyboard-group",
    title: "分镜组",
    icon: Grid3X3,
    cover: SOURCE_IMAGES.gridStoryboard,
    summary: "把多张图片节点整合成规整宫格，统一查看、排序、拼接和管理。",
    items: ["框选多图合并分镜组", "普通组转分镜组", "宫格切分后创建分镜组", "支持 21:9、16:9、9:16、1:1 等比例", "可导出 2K/4K 拼接图"],
  },
  {
    id: "video-tools",
    title: "视频工具",
    icon: Film,
    cover: SOURCE_IMAGES.videoToolMenu,
    summary: "视频节点支持高清、解析、剪辑、合成、人声/背景音分离与分离音视频。",
    items: ["2/4/6 倍高清放大", "30/60/90 fps 帧率提升", "视频分镜解析表", "10 分钟内 MP4 基础剪辑", "20 分钟长视频合成", "空格播放暂停，I/O 设置入出点"],
  },
];

const SOURCE_GALLERY = [
  { src: SOURCE_IMAGES.canvasEntry, title: "新建画布入口", caption: "原文教程 1.2：从首页进入「开始创作」，新建无限画布。" },
  { src: SOURCE_IMAGES.nodeTypes, title: "五大基础节点", caption: "文本、图片、视频、音频、脚本节点是后续所有工作流的基本单元。" },
  { src: SOURCE_IMAGES.workflowOverview, title: "工作流搭建示例", caption: "从参考图拉线创建图片节点，再连接文本、图像与视频节点。" },
  { src: SOURCE_IMAGES.canvasPanels, title: "四大画布功能区", caption: "项目菜单栏、画布左侧栏、个人中心和小地图导航。" },
  { src: SOURCE_IMAGES.slashMenu, title: "Slash 快捷菜单", caption: "用 / 调出多机位、四宫格、25 宫格、三视图和画面推演。" },
  { src: SOURCE_IMAGES.imageToolMenu, title: "图像工具菜单", caption: "图像节点顶部菜单中的全景、多角度、打光和基础编辑入口。" },
  { src: SOURCE_IMAGES.panorama720, title: "720 全景", caption: "支持生成全景图、进入全景预览并截取多个视角。" },
  { src: SOURCE_IMAGES.lightingTool, title: "打光工具", caption: "通过坐标球、预设、亮度和颜色控制画面光影。" },
  { src: SOURCE_IMAGES.gridStoryboard, title: "九宫格分镜", caption: "用于快速生成或整理多个连贯分镜画面。" },
  { src: SOURCE_IMAGES.videoToolMenu, title: "视频工具菜单", caption: "高清、解析、剪辑、合成、音视频分离等视频节点能力。" },
  { src: SOURCE_IMAGES.styleLibrary, title: "风格素材库", caption: "图像生成器中的风格素材、风格选择与自定义风格相关入口。" },
  { src: SOURCE_IMAGES.subjectLibrary, title: "视频主体库", caption: "角色/主体素材管理和视频生成器中的主体库使用场景。" },
  { src: SOURCE_IMAGES.complianceCheck, title: "合规校验", caption: "Seedance 2.0 真人素材校验入口与通过标识。" },
  { src: SOURCE_IMAGES.shortcutEntry, title: "快捷键入口", caption: "原文快捷键操作章节的入口截图。" },
];

const MODEL_CATALOG = [
  {
    type: "图像",
    name: "Lib Image",
    badge: "推荐",
    bestFor: "高质量图像生成与编辑、海报、表格、PPT、详情页",
    strengths: ["中文字符渲染强", "版式设计能力强", "支持 4 张参考图", "真实感和一致性强"],
  },
  {
    type: "图像",
    name: "LibNavo 2",
    badge: "高速",
    bestFor: "图像生成、编辑、极端画幅比和中文文本渲染",
    strengths: ["速度更快", "支持 1:4/4:1/1:8/8:1", "空间理解更准", "中文更稳定"],
  },
  {
    type: "图像",
    name: "Seedream 5.0 Lite",
    badge: "设计",
    bestFor: "角色一致性、电商设计、空间布局和信息可视化",
    strengths: ["角色一致性更稳", "PPT/图表表现好", "适合设计场景", "领域知识更强"],
  },
  {
    type: "图像",
    name: "Z Image Turbo",
    badge: "写实",
    bestFor: "摄影级真实感、亚洲人像、复杂中文海报",
    strengths: ["光影纹理优秀", "中文文化理解强", "文本修改能力好", "中英文混排稳定"],
  },
  {
    type: "视频",
    name: "Seedance 2.0",
    badge: "旗舰",
    bestFor: "多模态全能参考、智能分镜、影视级运镜、视频复刻和延展",
    strengths: ["最多 12 个参考文件", "可混合文本/图像/视频/音频", "角色场景稳定", "需注意合规校验"],
  },
  {
    type: "视频",
    name: "HappyHorse 1.0",
    badge: "电影感",
    bestFor: "广告、短视频、社媒营销和中近景电影质感",
    strengths: ["3-15 秒", "720/1080P", "人物表现力强", "多风格还原"],
  },
  {
    type: "视频",
    name: "Kling 3.0",
    badge: "音画",
    bestFor: "文生、图生、首尾帧生视频和原生音画同步",
    strengths: ["自定义多分镜", "提示词控制说话/音效/BGM", "适合叙事视频"],
  },
  {
    type: "视频",
    name: "Wan 2.6",
    badge: "对话",
    bestFor: "文生、图生视频、多角色对话和视频参考",
    strengths: ["智能多镜头", "支持角色与语音参考", "音画同步", "多角色对话"],
  },
  {
    type: "语言",
    name: "CVLM5.5",
    badge: "文本",
    bestFor: "提示词、反推提示词、故事剧情、脚本和角色设定",
    strengths: ["文本与图像解析", "适合结构化生成", "可做前期策划"],
  },
  {
    type: "语言",
    name: "Qwen3 VL Flash",
    badge: "视觉理解",
    bestFor: "图像理解、视频理解、OCR、2D/3D 定位",
    strengths: ["支持长视频理解", "可定位到秒级", "能分析空间关系"],
  },
  {
    type: "音频",
    name: "Minimax 2.8",
    badge: "音色",
    bestFor: "高表现力语音合成、精品音色和声音克隆",
    strengths: ["300+ 音色", "情绪表达丰富", "支持语速音高控制", "支持音色克隆"],
  },
  {
    type: "音频",
    name: "Mureka V8",
    badge: "音乐",
    bestFor: "文本生成歌曲或纯音乐",
    strengths: ["适合配乐草稿", "可用于短视频氛围音乐"],
  },
];

const PRACTICE_TASKS = [
  "在空白画布中新建文本、图片、视频三个节点，并分别命名。",
  "用一张风格参考图连接图片节点，再连接视频节点，形成「参考生图到图转视频」链路。",
  "把至少四张图片合并为分镜组，并尝试切换 16:9 与 1:1。",
  "用视频解析生成分镜表，找出其中的景别、起始节点、时长与运镜提示词。",
  "为真人素材完成 Seedance 2.0 合规校验，并记录通过标识的位置。",
];

const QUIZ = [
  {
    question: "想严格使用首帧和尾帧生成视频时，优先选择哪种入口？",
    answer: "图生视频-首尾帧",
    options: ["全能参考", "图生视频-首尾帧", "视频解析"],
  },
  {
    question: "把多张图片节点整理成可排序的宫格，应该使用哪个功能？",
    answer: "分镜组",
    options: ["分镜组", "视频合成", "音色克隆"],
  },
  {
    question: "Seedance 2.0 的多模态参考一次最多支持多少个参考文件？",
    answer: "12 个",
    options: ["4 个", "9 个", "12 个"],
  },
];

type ModelType = "全部" | "图像" | "视频" | "语言" | "音频";
type ToolTone = "violet" | "cyan" | "rose" | "amber" | "emerald";

export default function MangaTutorial() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("libtv-course-progress") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("libtv-course-progress", JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    const handleScroll = () => {
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progress = Math.round((completedTasks.length / PRACTICE_TASKS.length) * 100);

  const toggleTask = (task: string) => {
    setCompletedTasks((current) =>
      current.includes(task) ? current.filter((item) => item !== task) : [...current, task],
    );
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  return (
    <div className="libtv-light min-h-screen bg-[#0b0f19] text-slate-100">
      <CourseSwitcher current="libtv" />

      <Header activeSection={activeSection} progress={progress} onNavigate={scrollTo} onMenu={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} activeSection={activeSection} onClose={() => setSidebarOpen(false)} onNavigate={scrollTo} />

      <main className="pt-14">
        <HeroSection progress={progress} onStart={() => scrollTo("overview")} />
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <OverviewSection />
          <CanvasSection />
          <WorkflowSection />
          <CaseReferenceSection />
          <ToolsSection />
          <ModelsSection />
          <ComplianceSection />
          <PracticeSection completedTasks={completedTasks} onToggleTask={toggleTask} />
          <ShortcutSection />
          <SourceGallerySection />
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        LibTV 交互课程 · 内容来源于飞书使用指南 · 原文：
        <a href={ORIGINAL_DOC_URL} target="_blank" rel="noreferrer" className="ml-1 text-cyan-300 hover:text-cyan-200">
          https://resonate.feishu.cn/wiki/Loxfw6XHziYRk0kKzdjcFfp9nhb
        </a>
      </footer>
    </div>
  );
}

function Header({
  activeSection,
  progress,
  onNavigate,
  onMenu,
}: {
  activeSection: string;
  progress: number;
  onNavigate: (id: string) => void;
  onMenu: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0b0f19]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <button className="flex items-center gap-3 text-left" onClick={() => onNavigate("overview")}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
            <PlayCircle className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight text-slate-100">LibTV 创作课程</span>
            <span className="hidden text-[11px] text-slate-500 sm:block">无限画布到成片工作流</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-cyan-400/10 text-cyan-200"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 sm:flex">
            <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-cyan-300" style={{ width: `${progress}%` }} />
            </span>
            {progress}%
          </div>
          <button className="rounded-md p-2 text-slate-400 hover:bg-white/5 xl:hidden" onClick={onMenu} aria-label="打开课程目录">
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileSidebar({
  open,
  activeSection,
  onClose,
  onNavigate,
}: {
  open: boolean;
  activeSection: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 xl:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 top-14 z-40 w-72 overflow-y-auto border-r border-white/5 bg-[#0f1522] p-4 xl:hidden"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    activeSection === item.id ? "bg-cyan-400/10 text-cyan-200" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function HeroSection({ progress, onStart }: { progress: number; onStart: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.10),transparent_32%)]" />
      <div className="relative mx-auto grid min-h-[520px] max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-xs font-medium text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            飞书指南课程化改编
          </div>
          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            LibTV 从无限画布到专业视频创作
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            把原始使用文档整理成可学习、可练习、可检索的课程：先理解节点和工作流，再掌握图像工具、视频工具、模型选择、合规校验与音色克隆。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-md bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              开始学习
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://www.liblib.tv/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              打开 LibTV
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={ORIGINAL_DOC_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/8 px-4 py-2.5 text-sm font-medium text-cyan-100 hover:bg-cyan-300/12"
            >
              原始飞书文档
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["8", "课程章节"],
              ["5", "基础节点"],
              [`${progress}%`, "练习进度"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
                <div className="text-2xl font-bold text-slate-100">{value}</div>
                <div className="mt-1 text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative hidden lg:block"
        >
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl shadow-cyan-950/20">
            <div className="flex items-center gap-1 border-b border-white/8 bg-white/[0.03] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-slate-500">LibTV learning map</span>
            </div>
            <div className="p-4">
              <img src={SOURCE_IMAGES.canvasEntry} alt="LibTV 新建画布入口截图" className="aspect-video w-full rounded-lg object-cover" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {["文本", "图片", "视频", "音频"].map((item) => (
                  <div key={item} className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-300" />
                    {item}节点
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <ChevronDown className="h-5 w-5 text-slate-500" />
      </motion.div>
    </section>
  );
}

function OverviewSection() {
  return (
    <section>
      <SectionHeader id="overview" icon={BookOpen} eyebrow="MODULE 01" title="课程总览：先学路径，再查工具" />

      <p className="mb-8 max-w-3xl text-sm leading-7 text-slate-400">
        原文是一份面向实操的 LibTV 使用指南。这里把它重新组织成课程路径：每一课都有学习目标、检查点和可练习动作，便于快速上手，也便于以后作为工作手册检索。
      </p>

      <div className="mb-8 rounded-xl border border-cyan-300/15 bg-cyan-300/8 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">Source</div>
            <h3 className="text-lg font-semibold text-slate-100">内容来源：飞书《LibTV使用指南》</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
              本页不是简单复制文档，而是把原文中的操作说明、注意事项、模型清单和 14 张关键截图重新组织成课程。学习时可先看课程路径，遇到细节再跳回原文核对。
            </p>
          </div>
          <a
            href={ORIGINAL_DOC_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
          >
            打开原始飞书链接
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {COURSE_MODULES.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.article
              key={module.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-white/8 bg-white/[0.03] p-4 hover:border-cyan-300/25 hover:bg-white/[0.05]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                <span className="rounded bg-white/8 px-2 py-0.5 text-[10px] text-slate-400">{module.duration}</span>
                <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-200">{module.level}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100">{module.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{module.summary}</p>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <InfoPanel icon={Lightbulb} title="学习建议" tone="emerald">
          <p>第一次学习按顺序走完；第二次使用时直接跳到「模型清单」和「实用工具」。如果你正在做一个视频项目，优先完成工作流章节，再回头补齐图像和视频工具。</p>
        </InfoPanel>
        <InfoPanel icon={BadgeCheck} title="完成标准" tone="cyan">
          <p>你能独立完成一个「参考图生成关键画面，再转为视频」的最小闭环；能判断哪类任务该用图片模型、视频模型或音频模型；知道真人素材什么时候需要合规校验。</p>
        </InfoPanel>
      </div>
    </section>
  );
}

function CanvasSection() {
  return (
    <section>
      <SectionHeader id="canvas" icon={MousePointer2} eyebrow="MODULE 02" title="无限画布：所有创作都从节点开始" />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 text-sm leading-7 text-slate-400">
            无限画布是 LibTV 的主战场。进入首页后点击「开始创作」即可新建画布；画布内双击空白处可新建节点，也可以把图片、视频、音频直接拖进画布。原文里强调：一个画布就是一个项目，项目可以从「最新项目」快速进入，也可以从「全部项目」集中管理。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <SourceImage src={SOURCE_IMAGES.canvasEntry} title="新建画布入口" caption="首页点击「开始创作」进入新的无限画布。" />
            <SourceImage src={SOURCE_IMAGES.nodeTypes} title="五大基础节点" caption="双击空白处新建节点，或把素材直接拖入画布。" />
          </div>
        </div>
        <div className="space-y-3">
          {[
            ["1. 新建与命名", "从首页或全部项目进入画布后，双击画布标题可重命名。建议用「项目名-日期-版本」命名，方便后续查找。"],
            ["2. 添加素材", "图片、视频、音频可以直接拖入画布；文本和脚本更适合用双击空白处新建，再补充结构化内容。"],
            ["3. 连接节点", "从节点右侧拉线到空白处，可创建下游节点；从参考素材拉线到生成器，可自动把素材带入生成器。"],
            ["4. 管理全局", "项目菜单、左侧栏、个人中心和小地图导航分别负责项目管理、节点入口、账号资源和复杂画布定位。"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="mb-4 mt-10 font-serif text-xl font-semibold text-slate-100">五大基础节点</h3>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {NODE_CARDS.map((card) => (
          <NodeCard key={card.title} {...card} />
        ))}
      </div>

      <TipBox type="key">
        <p>常用节点操作：右键可复制、复用、删除和创建资产。复制粘贴不保留连线；「副本」会保留已有连线，适合基于同一组素材生成多个版本。</p>
      </TipBox>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <SourceImage src={SOURCE_IMAGES.canvasPanels} title="四大画布功能区" caption="原文截图：项目菜单栏、画布左侧栏、个人中心、小地图导航。" />
        <InfoPanel icon={PanelLeft} title="新手最容易漏掉的 4 个位置" tone="cyan">
          <p>
            左侧栏负责添加节点和查看工具箱；右上角个人中心能查看积分、消息与发布入口；小地图适合节点很多时快速定位；项目菜单栏负责返回主页、全部项目、创建项目和删除项目。
          </p>
        </InfoPanel>
      </div>
    </section>
  );
}

function WorkflowSection() {
  const [selected, setSelected] = useState(0);
  const selectedStep = WORKFLOW_STEPS[selected];
  const SelectedIcon = selectedStep.icon;

  return (
    <section>
      <SectionHeader id="workflow" icon={SplitSquareHorizontal} eyebrow="MODULE 03" title="工作流搭建：把单点能力变成可复用流程" />

      <p className="mb-8 max-w-3xl text-sm leading-7 text-slate-400">
        基于文本、图像、视频、音频四类节点，通过连线搭建任务工作流。一个简单但实用的闭环是「参考生图到图转视频」：先上传风格参考，再接入角色设定，生成关键画面，最后转为视频。
      </p>

      <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <SourceImage src={SOURCE_IMAGES.workflowOverview} title="原文工作流示例" caption="参考图、文本设定、图片生成和视频生成通过连线串成可复用流程。" />
        <InfoPanel icon={Layers} title="推荐练习：做一个最小闭环" tone="emerald">
          <p>
            先准备一张风格参考图和一段角色设定。把参考图连到图片节点，把角色设定文本连到图片节点提示词，再把生成图连到视频节点。这个闭环足够小，但已经覆盖 LibTV 最重要的节点关系。
          </p>
        </InfoPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <button
                key={step.title}
                onClick={() => setSelected(index)}
                className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                  selected === index ? "border-cyan-300/30 bg-cyan-300/10" : "border-white/8 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/8 text-cyan-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-100">{index + 1}. {step.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{step.detail}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-white/8 bg-[#101826] p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
              <SelectedIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{selectedStep.title}</h3>
              <p className="text-xs text-slate-500">当前步骤 {selected + 1} / {WORKFLOW_STEPS.length}</p>
            </div>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
            <p className="text-sm leading-7 text-slate-400">{selectedStep.detail}</p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
            {["打组", "创建工作流", "整组执行"].map((item) => (
              <div key={item} className="rounded-lg border border-white/8 bg-white/[0.03] p-3 text-slate-400">
                <CheckCircle2 className="mx-auto mb-2 h-4 w-4 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
          <TipBox type="warning">
            <p>框选时如果选到了分镜表，可能无法触发打组功能。分镜表节点不支持创建工作流操作。</p>
          </TipBox>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          ["工作流和打组的区别", "打组只是把当前节点整理到一起；创建工作流会把这一组保存成可复用工具，之后可从工具箱调用。"],
          ["整组执行的价值", "当每个节点的输入关系已经稳定，整组执行可以减少重复点击，适合批量做角色镜头或同风格分镜。"],
          ["什么时候不要打组", "分镜表节点、临时试验节点、还在频繁修改提示词的节点不适合过早打组，先把逻辑跑通再保存。"],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CaseReferenceSection() {
  return (
    <section>
      <SectionHeader id="case" icon={Camera} eyebrow="CASE STUDY" title="宣传片案例参考：红军辣椒项目画布" />

      <div className="grid overflow-hidden rounded-xl border border-amber-200/18 bg-white/[0.03] lg:grid-cols-[1.08fr_0.92fr]">
        <a
          href={PROMO_CASE.href}
          target="_blank"
          rel="noreferrer"
          className="group relative block min-h-72 overflow-hidden"
          aria-label={`打开案例画布：${PROMO_CASE.title}`}
        >
          <img src={PROMO_CASE.cover} alt={PROMO_CASE.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/5 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
            <span className="rounded-md border border-white/12 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              点击封面打开 LibTV 画布
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-300 text-slate-950 shadow-lg shadow-black/30">
              <ExternalLink className="h-4 w-4" />
            </span>
          </div>
        </a>

        <div className="flex flex-col justify-center p-5 sm:p-7">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs font-medium text-amber-100">
            <Film className="h-3.5 w-3.5" />
            宣传片案例参考
          </div>
          <h3 className="font-serif text-2xl font-semibold text-slate-50">{PROMO_CASE.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">{PROMO_CASE.summary}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {["封面气氛", "画布链路", "成片参考"].map((item) => (
              <div key={item} className="rounded-lg border border-white/8 bg-[#0b0f19]/45 px-3 py-2 text-xs text-slate-400">
                <CheckCircle2 className="mb-1.5 h-3.5 w-3.5 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
          <a
            href={PROMO_CASE.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-amber-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            打开案例画布
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <TipBox type="tip">
        <p>学习时可以先看封面判断宣传片基调，再进入画布观察素材如何分层、节点如何连接、哪些画面适合作为关键帧或视频参考。</p>
      </TipBox>
    </section>
  );
}

function ToolsSection() {
  const [activeTool, setActiveTool] = useState(TOOL_GROUPS[0].id);
  const tool = TOOL_GROUPS.find((item) => item.id === activeTool) || TOOL_GROUPS[0];
  const ToolIcon = tool.icon;

  return (
    <section>
      <SectionHeader id="tools" icon={Wand2} eyebrow="MODULE 04" title="实用工具：让画面、分镜和视频更可控" />

      <div className="mb-6 flex flex-wrap gap-2">
        {TOOL_GROUPS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTool(item.id)}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
              activeTool === item.id ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200" : "border-white/8 bg-white/[0.03] text-slate-400 hover:bg-white/[0.05]"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className="grid gap-6 rounded-xl border border-white/8 bg-white/[0.03] p-5 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
                <ToolIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-100">{tool.title}</h3>
                <p className="text-xs text-slate-500">工具卡片</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-400">{tool.summary}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {tool.items.map((item) => (
                <div key={item} className="rounded-lg border border-white/8 bg-[#0b0f19]/50 px-3 py-2 text-xs leading-5 text-slate-400">
                  <span className="mr-2 text-cyan-300">•</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          {tool.cover ? (
            <div className="overflow-hidden rounded-lg border border-white/8 bg-[#0b0f19]">
              <img src={tool.cover} alt={tool.title} className="aspect-video h-full w-full object-cover" />
            </div>
          ) : (
            <div className="grid place-items-center rounded-lg border border-white/8 bg-[#0b0f19] p-8">
              <Grid3X3 className="mb-4 h-12 w-12 text-cyan-300/70" />
              <p className="max-w-sm text-center text-sm leading-7 text-slate-500">这个模块更适合用真实素材在画布中操作。课程里保留核心操作和注意事项，方便制作时对照。</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <InfoPanel icon={Maximize2} title="720 全景图" tone="cyan">
          <p>支持文本或参考图生成可实时预览的 720 全景图，并截取 4 大或 12 大视角。空旷户外场景可能全景特征不明显，通常再生成 1-2 次即可改善。</p>
        </InfoPanel>
        <InfoPanel icon={Camera} title="多角度" tone="violet">
          <p>基于当前图像生成不同拍摄视角，支持水平环绕、垂直俯仰和景别缩放。可用三维网格坐标球或数值滑块控制。</p>
        </InfoPanel>
        <InfoPanel icon={RotateCcw} title="标注与重绘" tone="amber">
          <p>用涂鸦笔或框选工具圈定区域并添加文字。删除或修改画面内容时，提示词里可加入「修后不可以留下任何标注痕迹」。</p>
        </InfoPanel>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SourceImage src={SOURCE_IMAGES.panorama720} title="全景 720°" caption="三种入口：图像节点顶部菜单、图像生成器全景模式、右键进入全景预览。" />
        <SourceImage src={SOURCE_IMAGES.lightingTool} title="打光面板" caption="可调光源角度、颜色、亮度、轮廓光，也可用智能模式输入氛围描述。" />
        <SourceImage src={SOURCE_IMAGES.gridStoryboard} title="九宫格/分镜" caption="剧情推演、25 宫格、角色三视图和画面前后推演都属于高频分镜能力。" />
      </div>

      <TipBox type="tip">
        <p>
          图像工具的学习顺序建议是：先掌握基础编辑和高清，再练多角度与打光，最后练全景和宫格切分。这样从「修单张图」过渡到「批量做分镜」会更顺。
        </p>
      </TipBox>
    </section>
  );
}

function ModelsSection() {
  const [filter, setFilter] = useState<ModelType>("全部");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODEL_CATALOG.filter((model) => {
      const typeMatch = filter === "全部" || model.type === filter;
      const text = `${model.name} ${model.bestFor} ${model.strengths.join(" ")}`.toLowerCase();
      return typeMatch && (!q || text.includes(q));
    });
  }, [filter, query]);

  return (
    <section>
      <SectionHeader id="models" icon={Layers} eyebrow="MODULE 05" title="模型清单：按任务选择，而不是按名字选择" />

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索模型、能力或场景，比如：中文、首尾帧、音画同步"
            className="h-11 w-full rounded-lg border border-white/8 bg-white/[0.03] pl-10 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-300/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["全部", "图像", "视频", "语言", "音频"] as ModelType[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                filter === item ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200" : "border-white/8 bg-white/[0.03] text-slate-400 hover:bg-white/[0.05]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((model) => (
          <article key={`${model.type}-${model.name}`} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-medium text-cyan-300">{model.type}</div>
                <h3 className="mt-1 text-base font-semibold text-slate-100">{model.name}</h3>
              </div>
              <span className="rounded bg-white/8 px-2 py-1 text-[10px] text-slate-400">{model.badge}</span>
            </div>
            <p className="min-h-12 text-xs leading-5 text-slate-500">{model.bestFor}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {model.strengths.map((strength) => (
                <span key={strength} className="rounded-md border border-white/8 bg-[#0b0f19]/60 px-2 py-1 text-[11px] text-slate-400">
                  {strength}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <TipBox type="key">
        <p>Seedance 2.0 的「图生视频-首帧」「图生视频-首尾帧」「多模态参考生视频」是三种互斥场景，不要混用。若必须严格保证首尾帧一致，优先使用首尾帧入口。</p>
      </TipBox>
    </section>
  );
}

function ComplianceSection() {
  return (
    <section>
      <SectionHeader id="compliance" icon={ShieldCheck} eyebrow="MODULE 06" title="合规与音色：真人素材和声音资产要先过关" />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <h3 className="text-lg font-semibold text-slate-100">Seedance 2.0 真人素材校验</h3>
          </div>
          <div className="space-y-3">
            {[
              ["审核标准", "个人原创、影视角色素材在通过合规校验后可使用；明星、公众人物和版权内容限制严格。"],
              ["单素材校验", "上传或生成文字、图片、视频、音频素材后，点击 Seedance 2.0 合规校验并等待审核。"],
              ["角色库批量添加", "在视频生成器选择 Seedance 2.0 后进入角色库，可批量上传素材核验。"],
              ["真人人像授权", "手机扫码完成真人识别检测后创建角色，再上传不同妆造图或三视图。"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-lg border border-white/8 bg-[#0b0f19]/50 p-3">
                <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
                <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-3">
            <Mic2 className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold text-slate-100">音色克隆流程</h3>
          </div>
          <Timeline
            items={[
              ["朗读音频", "在安静环境下清晰朗读，建议 115 秒以上。想要情绪风格，可以在朗读中体现。"],
              ["生成并试听", "用短文本试听，重点检查相似度、清晰度、稳定性、自然度和情绪表达。"],
              ["填写信息", "完成音色相关信息登记，创建专属音色。"],
              ["立刻使用", "创建后 7 天内未使用可能被清除，建议创建完成后立即生成一次语音。"],
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SourceImage src={SOURCE_IMAGES.subjectLibrary} title="视频主体库" caption="把角色/主体素材放入主体库，方便在视频生成器中复用。" />
        <SourceImage src={SOURCE_IMAGES.complianceCheck} title="Seedance 2.0 合规校验" caption="真人素材通过校验后会出现可用标识，再进入后续视频生成。" />
        <SourceImage src={SOURCE_IMAGES.styleLibrary} title="风格素材库" caption="风格库适合沉淀项目统一画风，减少每次重新描述风格的成本。" />
      </div>

      <TipBox type="warning">
        <p>如果上传图片和真人活体检测不一致，或图片中出现两个人，素材会审核不通过。创建多个真人资产文件夹时一定要命名清楚，否则后续很难找到。</p>
      </TipBox>
    </section>
  );
}

function PracticeSection({
  completedTasks,
  onToggleTask,
}: {
  completedTasks: string[];
  onToggleTask: (task: string) => void;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  return (
    <section>
      <SectionHeader id="practice" icon={ClipboardCheck} eyebrow="MODULE 07" title="练习与测验：把文档变成手感" />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold text-slate-100">实操检查清单</h3>
          </div>
          <div className="space-y-2">
            {PRACTICE_TASKS.map((task) => {
              const checked = completedTasks.includes(task);
              return (
                <button
                  key={task}
                  onClick={() => onToggleTask(task)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    checked ? "border-emerald-300/25 bg-emerald-300/8" : "border-white/8 bg-[#0b0f19]/45 hover:bg-white/[0.05]"
                  }`}
                >
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${checked ? "text-emerald-300" : "text-slate-600"}`} />
                  <span className="text-sm leading-6 text-slate-400">{task}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <SourceImage src={SOURCE_IMAGES.shortcutEntry} title="快捷键入口" caption="原文最后提供快捷键入口，适合作为熟练后提升效率的速查卡。" />
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-3">
            <Star className="h-5 w-5 text-amber-300" />
            <h3 className="text-lg font-semibold text-slate-100">快速测验</h3>
          </div>
          <div className="space-y-4">
            {QUIZ.map((item) => {
              const chosen = selectedAnswers[item.question];
              return (
                <div key={item.question} className="rounded-lg border border-white/8 bg-[#0b0f19]/45 p-3">
                  <p className="mb-3 text-sm font-medium leading-6 text-slate-200">{item.question}</p>
                  <div className="grid gap-2">
                    {item.options.map((option) => {
                      const selected = chosen === option;
                      const correct = option === item.answer;
                      return (
                        <button
                          key={option}
                          onClick={() => setSelectedAnswers((current) => ({ ...current, [item.question]: option }))}
                          className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                            selected && correct
                              ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-200"
                              : selected
                                ? "border-rose-300/35 bg-rose-300/10 text-rose-200"
                                : "border-white/8 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {chosen && (
                    <p className={`mt-3 text-xs ${chosen === item.answer ? "text-emerald-300" : "text-rose-300"}`}>
                      {chosen === item.answer ? "回答正确。" : `正确答案是：${item.answer}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShortcutSection() {
  return (
    <section>
      <SectionHeader id="shortcuts" icon={Keyboard} eyebrow="MODULE 08" title="快捷键速查：让画布操作更顺手" />

      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/8 p-5">
          <div className="mb-4 flex items-center gap-3">
            <Keyboard className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold text-slate-100">先记这 5 个高频动作</h3>
          </div>
          <div className="space-y-3">
            {[
              ["新建节点", "Tab", "想快速铺开画布时，先用它建立新的素材或提示词节点。"],
              ["生成", "⌘ + Enter", "提示词、参数和参考图确认后，直接提交生成。"],
              ["成组", "⌘ + G", "把同一段工作流收成一组，方便移动、复用和讲解。"],
              ["连线", "⌘ + L", "用于把文本、图片、视频节点串成一条生产链路。"],
              ["适应画布", "⌘ + 0", "画布变乱或缩放过深时，一键回到全局视角。"],
            ].map(([title, key, desc]) => (
              <div key={title} className="rounded-lg border border-white/8 bg-white/[0.45] p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-100">{title}</span>
                  <span className="rounded-md border border-white/12 bg-white/[0.7] px-2 py-1 font-mono text-xs font-semibold text-cyan-300">{key}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
          <TipBox type="key">
            <p>学生练习时不要一次记完整张表。先让他们用 Tab 新建节点、⌘+L 连线、⌘+Enter 生成，再逐步加入成组、复制和整理画布。</p>
          </TipBox>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SHORTCUT_GROUPS.map((group) => (
            <ShortcutCard key={group.title} group={group} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <SourceImage src={SOURCE_IMAGES.shortcutEntry} title="原文快捷键入口" caption="点击可放大查看飞书原文中的快捷键章节入口，完整操作以原链接说明为准。" />
      </div>
    </section>
  );
}

function ShortcutCard({ group }: { group: (typeof SHORTCUT_GROUPS)[number] }) {
  const Icon = group.icon;
  const tone = colorClasses[group.tone];

  return (
    <article className={`rounded-xl border p-4 ${tone.panel}`}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${tone.icon}`} />
        <h3 className="text-base font-semibold text-slate-100">{group.title}</h3>
      </div>
      <div className="space-y-2.5">
        {group.items.map((item) => (
          <div key={item.action} className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.5] px-3 py-2.5">
            <span className="text-sm leading-5 text-slate-400">{item.action}</span>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
              {item.keys.map((key, index) => (
                <span key={`${item.action}-${key}-${index}`} className="contents">
                  {index > 0 && <span className="text-xs text-slate-500">+</span>}
                  <ShortcutKey>{key}</ShortcutKey>
                </span>
              ))}
              {item.after && <span className="ml-0.5 text-xs font-medium text-slate-500">{item.after}</span>}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ShortcutKey({ children }: { children: ReactNode }) {
  return (
    <kbd className="min-w-8 rounded-md border border-white/12 bg-white/[0.75] px-2 py-1 text-center font-mono text-xs font-semibold leading-none text-slate-100 shadow-sm">
      {children}
    </kbd>
  );
}

function SourceGallerySection() {
  return (
    <section>
      <SectionHeader id="source" icon={ExternalLink} eyebrow="APPENDIX" title="原文配图导览：把截图变成速查索引" />

      <div className="mb-6 rounded-xl border border-white/8 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">本页使用的飞书原文截图</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              这些图片来自原始飞书链接，按学习路径重新排序。需要查看完整上下文时，可直接打开原文。
            </p>
          </div>
          <a
            href={ORIGINAL_DOC_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            查看完整原文
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SOURCE_GALLERY.map((item) => (
          <SourceImage key={item.title} src={item.src} title={item.title} caption={item.caption} />
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ id, icon: Icon, eyebrow, title }: { id: string; icon: typeof BookOpen; eyebrow: string; title: string }) {
  return (
    <div id={id} className="mb-8 pt-4 sm:pt-10">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-cyan-200">
          <Icon className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">{title}</h2>
      </motion.div>
    </div>
  );
}

function SourceImage({ src, title, caption }: { src: string; title: string; caption: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <figure className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.03]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden text-left"
          aria-label={`放大查看：${title}`}
        >
          <img src={src} alt={title} loading="lazy" className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/45 text-white opacity-90 shadow-lg shadow-black/30 backdrop-blur transition group-hover:bg-cyan-300 group-hover:text-slate-950">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>
        <figcaption className="border-t border-white/8 p-3">
          <div className="text-sm font-semibold text-slate-100">{title}</div>
          <p className="mt-1 text-xs leading-5 text-slate-500">{caption}</p>
        </figcaption>
      </figure>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/82 p-3 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/12 bg-[#0b0f19] shadow-2xl shadow-black/50"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/8 px-4 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 sm:text-base">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  aria-label="关闭大图"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-black/30 p-3 sm:p-5">
                <img src={src} alt={title} className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NodeCard({
  title,
  icon: Icon,
  color,
  body,
  tips,
}: {
  title: string;
  icon: typeof BookOpen;
  color: ToolTone;
  body: string;
  tips: string[];
}) {
  const tone = colorClasses[color];
  return (
    <article className={`rounded-xl border p-4 ${tone.panel}`}>
      <Icon className={`mb-3 h-5 w-5 ${tone.icon}`} />
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500">{body}</p>
      <div className="mt-4 space-y-1.5">
        {tips.map((tip) => (
          <div key={tip} className="flex items-start gap-2 text-[11px] leading-4 text-slate-400">
            <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
            {tip}
          </div>
        ))}
      </div>
    </article>
  );
}

function InfoPanel({ icon: Icon, title, tone, children }: { icon: typeof BookOpen; title: string; tone: ToolTone; children: ReactNode }) {
  const colors = colorClasses[tone];
  return (
    <div className={`rounded-xl border p-5 ${colors.panel}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colors.icon}`} />
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="text-sm leading-7 text-slate-400">{children}</div>
    </div>
  );
}

function TipBox({ type, children }: { type: "tip" | "warning" | "key"; children: ReactNode }) {
  const config = {
    tip: { icon: Lightbulb, label: "技巧", className: "border-emerald-300/15 bg-emerald-300/8 text-emerald-300" },
    warning: { icon: AlertTriangle, label: "注意", className: "border-amber-300/15 bg-amber-300/8 text-amber-300" },
    key: { icon: Zap, label: "重点", className: "border-cyan-300/15 bg-cyan-300/8 text-cyan-300" },
  }[type];
  const Icon = config.icon;

  return (
    <div className={`my-6 rounded-lg border p-4 ${config.className}`}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </div>
      <div className="text-sm leading-7 text-slate-400">{children}</div>
    </div>
  );
}

function Timeline({ items }: { items: [string, string][] }) {
  return (
    <div className="space-y-4">
      {items.map(([title, desc], index) => (
        <div key={title} className="relative flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/10 text-xs font-semibold text-cyan-200">{index + 1}</div>
            {index < items.length - 1 && <div className="mt-2 h-full w-px bg-white/10" />}
          </div>
          <div className="pb-2">
            <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
            <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const colorClasses: Record<ToolTone, { panel: string; icon: string; dot: string }> = {
  violet: { panel: "border-violet-300/15 bg-violet-300/8", icon: "text-violet-300", dot: "bg-violet-300" },
  cyan: { panel: "border-cyan-300/15 bg-cyan-300/8", icon: "text-cyan-300", dot: "bg-cyan-300" },
  rose: { panel: "border-rose-300/15 bg-rose-300/8", icon: "text-rose-300", dot: "bg-rose-300" },
  amber: { panel: "border-amber-300/15 bg-amber-300/8", icon: "text-amber-300", dot: "bg-amber-300" },
  emerald: { panel: "border-emerald-300/15 bg-emerald-300/8", icon: "text-emerald-300", dot: "bg-emerald-300" },
};
