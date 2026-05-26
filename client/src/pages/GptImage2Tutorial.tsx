import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Eye,
  FileImage,
  Images,
  Layers,
  Paintbrush,
  RefreshCw,
  ScanEye,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Wand2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import CourseSwitcher from "@/components/CourseSwitcher";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

type Tone = "teal" | "amber" | "rose" | "cyan";
type CaseTab = "raw" | "student" | "prompt";

const toneStyles: Record<Tone, { border: string; soft: string; text: string; bg: string }> = {
  teal: {
    border: "border-teal-200/18",
    soft: "bg-teal-300/10",
    text: "text-teal-200",
    bg: "from-teal-300/14 to-slate-950",
  },
  amber: {
    border: "border-amber-200/18",
    soft: "bg-amber-300/10",
    text: "text-amber-200",
    bg: "from-amber-300/14 to-slate-950",
  },
  rose: {
    border: "border-rose-200/18",
    soft: "bg-rose-300/10",
    text: "text-rose-200",
    bg: "from-rose-300/14 to-slate-950",
  },
  cyan: {
    border: "border-cyan-200/18",
    soft: "bg-cyan-300/10",
    text: "text-cyan-200",
    bg: "from-cyan-300/14 to-slate-950",
  },
};

const navItems = [
  { id: "observe", label: "看案例", icon: Eye },
  { id: "methods", label: "拆方法", icon: ClipboardCheck },
  { id: "builder", label: "改提示词", icon: SlidersHorizontal },
  { id: "practice", label: "做练习", icon: CheckCircle2 },
];

const sourceCards = [
  {
    title: "这次为什么值得学",
    tag: "模型观察",
    body: "GPT Image 2 的强项不是单纯高清，而是能读懂参考图里的风格特征、空间关系和融图约束。",
    focus: ["图像特征理解", "推理转化", "审美判断"],
  },
  {
    title: "风格参考迁移",
    tag: "P2-P5",
    body: "给多张同作者、同风格参考图，让模型归纳笔触、材质、线条、配色和渲染方式，再迁移到新主体。",
    focus: ["多图参考", "非大众画风", "小小 LoRA 感"],
  },
  {
    title: "机位参考迁移",
    tag: "P6-P10",
    body: "用粗糙 3D 或图转 3D 模型锁定机位、透视、遮挡和比例，再结合原始场景图推理成品。",
    focus: ["粗模锚点", "精准角度", "空间重构"],
  },
  {
    title: "跨风格融图",
    tag: "P11-P12",
    body: "把不同画风的角色和场景放在一起，同时要求角色保持自身风格、场景保持场景风格，观察模型是否会错误同化。",
    focus: ["角色风格独立", "场景风格独立", "融图自检"],
  },
];

const caseTabs: Array<{ key: CaseTab; label: string; icon: LucideIcon }> = [
  { key: "raw", label: "原始分享话术", icon: FileImage },
  { key: "student", label: "学生理解版", icon: BookOpen },
  { key: "prompt", label: "可复制提示词", icon: Copy },
];

const cases = [
  {
    id: "style",
    title: "风格参考迁移",
    kicker: "只用几张代表图，让模型理解自己的画风",
    icon: Paintbrush,
    visual: asset("image2/style-transfer-lab.svg"),
    tone: "teal" as Tone,
    raw: "参考图建议多图，关键特征覆盖全面。稳定后可以持续复用，让 GPT Image 2 模仿笔触、材质、线条和渲染。",
    student: "把参考图当成风格样本，而不是内容拼贴。学生需要先说出参考图共同特征，再要求模型只迁移风格语言，不复制参考图角色、姿势和背景。",
    prompt:
      "请参考我上传的多张参考图，提取共同的美术风格：线条粗细、笔触节奏、材质颗粒、配色倾向、光影方式和人物比例。不要复制参考图中的具体人物、场景和构图。请用这种风格生成一个新的半身角色设定图，白底，主体清晰，边缘干净。",
    checks: ["参考图来自同一风格体系", "提示词明确只迁移风格", "新主体和原参考内容不重复"],
  },
  {
    id: "camera",
    title: "机位参考迁移",
    kicker: "让粗糙 3D 负责角度，让模型负责成品审美",
    icon: Camera,
    visual: asset("image2/camera-anchor-flow.svg"),
    tone: "amber" as Tone,
    raw: "用粗糙模型在三维软件里摆关键锚点、角色比例和摄像机角度，再让模型根据粗糙图像和原始场景图推理成品。",
    student: "粗模图的价值不是好看，而是锁住空间关系。提示词要逐项说明：谁在前、谁被遮挡、镜头高度、画面左右关系、远景位置变化。",
    prompt:
      "图 1 是粗糙 3D 机位参考，只用于说明摄像机角度、透视关系、遮挡关系和角色比例。图 2 是场景风格参考。请生成一张新图：保持图 1 的机位、透视、人物站位和遮挡关系，同时采用图 2 的光线、材质、色彩和场景氛围。不要保留图 1 的灰模材质和低清贴图。",
    checks: ["先锁透视再谈风格", "灰模只做空间锚点", "复杂元素越多越要逐项列保留关系"],
  },
  {
    id: "fusion",
    title: "跨风格融图",
    kicker: "角色别被场景同化，场景也别被角色污染",
    icon: Layers,
    visual: asset("image2/style-transfer-lab.svg"),
    tone: "rose" as Tone,
    raw: "把不同画风的角色和场景融合时，GPT Image 2 往往能更好保持角色原本风格，不会轻易把角色完全改成场景风格。",
    student: "跨风格融图的关键是分区约束。角色、场景、构图、光线分别写清楚，最后加一条自检：角色风格不能被场景重绘。",
    prompt:
      "请将角色参考图中的角色放入场景参考图。角色需要保持原本的画风、毛发、服装、五官特征和比例；场景保持原本的 3D 场景风格、光照和色彩。允许调整角色姿势以适应构图，但不要把角色重绘成场景的皮克斯式 3D 毛绒风，也不要让场景变成角色的绘画风格。",
    checks: ["角色风格单独约束", "场景风格单独约束", "写清楚允许改变和禁止改变"],
  },
];

const taskOptions = {
  style: { label: "风格迁移", lead: "只迁移美术语言，不复制参考图内容。", ask: "提取共同风格特征并生成新主体" },
  camera: { label: "机位迁移", lead: "粗糙模型锁空间，原场景图给审美。", ask: "保持机位、透视、遮挡和比例，重建成品图" },
  fusion: { label: "跨风格融图", lead: "角色和场景分别保持自己的风格。", ask: "融合角色与场景，但不互相同化" },
  cleanup: { label: "去纹理清洗", lead: "保留结构，减少脏细节和贴图污染。", ask: "降低噪点、碎边和过度纹理，保留构图" },
};

type TaskKey = keyof typeof taskOptions;

const preserveOptions = ["角色身份", "构图关系", "服装道具", "场景光线", "镜头角度"];
const riskOptions = ["避免直接复制参考图内容", "避免过度纹理", "逐项检查缺失元素", "粗模贴图不参与渲染"];

const textureSteps = [
  { title: "少纹理化提示词", body: "减少复杂细节、丰富纹理、强颗粒等词，改成干净表面、克制纸纹、统一材质。", icon: XCircle },
  { title: "材质简化", body: "把材质限制为 2-3 种，不让皮肤、服装、背景同时堆满纹理。", icon: Layers },
  { title: "降噪/超分前置判断", body: "先判断脏细节是不是结构错误。结构错了先重生，结构对了再清洗和超分。", icon: ScanEye },
  { title: "二次清洗提示词", body: "用第二轮要求保留构图和角色，减少杂散纹理、噪点和碎边。", icon: RefreshCw },
  { title: "避免贴图污染", body: "粗糙 3D 图不要当成材质参考，只当机位参考，明确禁止复制灰模贴图。", icon: ShieldAlert },
];

const radarRows = [
  { label: "图像特征理解", image2: 9, banana: 6, note: "Image 2 更会抓风格特征" },
  { label: "审美推理", image2: 8, banana: 6, note: "适合做非大众画风转化" },
  { label: "元素一致性", image2: 5, banana: 8, note: "复杂主体容易丢或改元素" },
  { label: "画质干净度", image2: 5, banana: 7, note: "Image 2 目前常有脏纹理" },
  { label: "复杂机位", image2: 8, banana: 4, note: "粗模机位玩法更吃推理能力" },
];

export default function GptImage2Tutorial() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <CourseSwitcher current="image2" />
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#07111f]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-300/12 text-rose-200 ring-1 ring-rose-200/20">
              <Images className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-200/70">Lesson 03</p>
              <h1 className="text-sm font-semibold text-slate-100">GPT Image 2 图像迁移魔法课</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/8 hover:text-slate-100"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <HeroSection onStart={() => scrollTo("observe")} />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <LearningPath />
        <SourceDeck />
        <MethodSection />
        <PromptBuilder />
        <TextureCleanup />
        <RiskRadar />
        <PracticeSection />
      </div>
      <footer className="border-t border-white/8 py-8 text-center text-xs text-slate-600">
        GPT Image 2 图像迁移魔法课 · 用案例、提示词和风险判断训练学生理解上传内容
      </footer>
    </main>
  );
}

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-white/8">
      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200/20 bg-rose-300/10 px-3 py-1 text-xs font-medium text-rose-100">
            <BadgeCheck className="h-3.5 w-3.5" />
            从上传案例到可执行工作流
          </div>
          <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            把 Image 2 的好玩，
            <span className="block text-rose-100">变成学生会用的方法</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            这节课把分享里的风格迁移、机位迁移和跨风格融图拆成四段交互：先观察上传内容，再拆出方法，接着改提示词，最后判断模型限制。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-rose-100"
            >
              开始看案例
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={asset("manga")}
              className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/14"
            >
              返回第一课
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40">
            <img src={asset("image2/style-transfer-lab.svg")} alt="风格参考迁移实验台" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 left-5 right-5 grid gap-2 rounded-lg border border-white/10 bg-[#08111f]/92 p-3 backdrop-blur sm:grid-cols-3">
            {["风格迁移", "机位迁移", "跨风格融图"].map((item) => (
              <div key={item} className="rounded-md bg-white/7 px-3 py-2 text-center text-xs font-semibold text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LearningPath() {
  return (
    <section className="py-10">
      <div className="grid gap-3 md:grid-cols-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const copy = ["先把上传内容拆成学习问题。", "把三种玩法变成可复用步骤。", "用选择器生成结构化提示词。", "用风险清单判断是否可交付。"][index];
          return (
            <div key={item.id} className="rounded-lg border border-white/8 bg-white/[0.035] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs text-slate-600">0{index + 1}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SourceDeck() {
  const [active, setActive] = useState(0);
  const card = sourceCards[active];

  return (
    <SectionShell id="observe" eyebrow="Observe" title="观察上传内容：先抓住它在讲什么" icon={Eye}>
      <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-2">
          {sourceCards.map((item, index) => (
            <button
              key={item.title}
              onClick={() => setActive(index)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                active === index ? "border-rose-200/35 bg-rose-300/10 text-rose-100" : "border-white/8 bg-white/[0.035] text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{item.title}</span>
                <span className="rounded-md bg-white/8 px-2 py-1 text-[10px] font-medium text-slate-400">{item.tag}</span>
              </div>
            </button>
          ))}
        </div>

        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-lg border border-white/8 bg-white/[0.04] p-5"
        >
          <div className="mb-4 flex items-center gap-2 text-rose-200">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">{card.tag}</span>
          </div>
          <h3 className="font-serif text-2xl font-semibold text-white">{card.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">{card.body}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {card.focus.map((item) => (
              <span key={item} className="rounded-md border border-cyan-200/14 bg-cyan-300/8 px-2.5 py-1 text-xs text-cyan-100">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

function MethodSection() {
  return (
    <SectionShell id="methods" eyebrow="Methods" title="拆方法：三种迁移玩法怎么教" icon={ClipboardCheck}>
      <div className="grid gap-5">
        {cases.map((item) => (
          <CaseCard key={item.id} item={item} />
        ))}
      </div>
    </SectionShell>
  );
}

function CaseCard({ item }: { item: (typeof cases)[number] }) {
  const [tab, setTab] = useState<CaseTab>("student");
  const Icon = item.icon;
  const tone = toneStyles[item.tone];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className={`overflow-hidden rounded-lg border bg-gradient-to-br ${tone.bg} ${tone.border}`}
    >
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="min-h-72 bg-black/20">
          <img src={item.visual} alt={item.title} className="h-full w-full object-cover" />
        </div>
        <div className="p-5 sm:p-6">
          <div className={`mb-3 inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-semibold ${tone.soft} ${tone.text}`}>
            <Icon className="h-3.5 w-3.5" />
            {item.kicker}
          </div>
          <h3 className="font-serif text-2xl font-semibold text-white">{item.title}</h3>

          <div className="my-4 flex flex-wrap gap-2">
            {caseTabs.map((option) => {
              const TabIcon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => setTab(option.key)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition ${
                    tab === option.key ? "bg-white text-slate-950" : "bg-white/8 text-slate-300 hover:bg-white/12"
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-lg border border-white/8 bg-black/18 p-4">
            <p className="text-sm leading-7 text-slate-300">{item[tab]}</p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {item.checks.map((check) => (
              <div key={check} className="rounded-md border border-white/8 bg-white/[0.04] p-3 text-xs leading-5 text-slate-400">
                <CheckCircle2 className={`mb-2 h-3.5 w-3.5 ${tone.text}`} />
                {check}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PromptBuilder() {
  const [task, setTask] = useState<TaskKey>("style");
  const [refs, setRefs] = useState("4-6 张参考图");
  const [preserve, setPreserve] = useState(["角色身份", "构图关系", "场景光线"]);
  const [risks, setRisks] = useState(["避免过度纹理", "逐项检查缺失元素"]);

  const generatedPrompt = useMemo(() => {
    const option = taskOptions[task];
    return [
      `任务：${option.ask}。`,
      `参考资料：我会上传 ${refs}，请先理解参考图之间的关系，再生成新图。`,
      `必须保留：${preserve.length ? preserve.join("、") : "主体关系和画面意图"}。`,
      "质量约束：画面干净、边缘清晰、材质统一、不要出现多余噪点和碎纹理。",
      `风险自检：${risks.length ? risks.join("；") : "输出前检查元素是否缺失、风格是否被错误同化"}。`,
      "补充：如果参考图中有粗糙 3D 或低清截图，它们只作为机位、遮挡和比例参考，不作为最终材质参考。",
    ].join("\n");
  }, [preserve, refs, risks, task]);

  const toggle = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast.success("提示词已复制");
    } catch {
      toast.error("复制失败，请手动选择文本");
    }
  };

  return (
    <SectionShell id="builder" eyebrow="Prompt Builder" title="改提示词：从模糊想法变成结构化指令" icon={SlidersHorizontal}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-lg border border-white/8 bg-white/[0.04] p-5">
          <ControlGroup title="任务类型" icon={Wand2}>
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(taskOptions) as TaskKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTask(key)}
                  className={`rounded-md border p-3 text-left transition ${
                    task === key ? "border-rose-200/35 bg-rose-300/12" : "border-white/8 bg-black/16 hover:bg-white/7"
                  }`}
                >
                  <span className="block text-sm font-semibold text-slate-100">{taskOptions[key].label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{taskOptions[key].lead}</span>
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title="参考数量" icon={Images}>
            <div className="flex flex-wrap gap-2">
              {["2-3 张参考图", "4-6 张参考图", "粗糙 3D + 场景图", "角色图 + 场景图"].map((value) => (
                <button
                  key={value}
                  onClick={() => setRefs(value)}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                    refs === value ? "bg-cyan-200 text-slate-950" : "bg-white/8 text-slate-300 hover:bg-white/12"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title="保留元素" icon={CheckCircle2}>
            <TokenGrid values={preserveOptions} selected={preserve} onToggle={(value) => toggle(value, preserve, setPreserve)} />
          </ControlGroup>

          <ControlGroup title="风险提醒" icon={ShieldAlert}>
            <TokenGrid values={riskOptions} selected={risks} onToggle={(value) => toggle(value, risks, setRisks)} />
          </ControlGroup>
        </div>

        <div className="flex flex-col rounded-lg border border-rose-200/16 bg-[#0b1220] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200/70">Generated Prompt</p>
              <h3 className="mt-1 text-lg font-semibold text-white">{taskOptions[task].label}提示词</h3>
            </div>
            <button
              onClick={copyPrompt}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-rose-100"
            >
              <Copy className="h-3.5 w-3.5" />
              复制
            </button>
          </div>
          <pre className="min-h-80 flex-1 whitespace-pre-wrap rounded-lg border border-white/8 bg-black/28 p-4 font-mono text-xs leading-6 text-slate-300">
            {generatedPrompt}
          </pre>
        </div>
      </div>
    </SectionShell>
  );
}

function TextureCleanup() {
  return (
    <SectionShell id="cleanup" eyebrow="Texture Cleanup" title="去除 Image 2 纹理：把脏细节变成可控清单" icon={RefreshCw}>
      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="overflow-hidden rounded-lg border border-white/8 bg-white/[0.035]">
          <img src={asset("image2/texture-cleanup.svg")} alt="去除 Image 2 纹理的五步检查" className="h-full w-full object-cover" />
        </div>
        <div className="grid gap-3">
          {textureSteps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-white/8 bg-white/[0.04] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-amber-200" />
                  <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-500">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

function RiskRadar() {
  return (
    <SectionShell id="radar" eyebrow="Risk Radar" title="判断模型限制：Image 2 强在哪里，弱在哪里" icon={ShieldAlert}>
      <div className="rounded-lg border border-white/8 bg-white/[0.04] p-5">
        <div className="grid gap-4">
          {radarRows.map((row) => (
            <div key={row.label} className="grid gap-3 lg:grid-cols-[160px_1fr_1fr_220px] lg:items-center">
              <div className="text-sm font-semibold text-slate-200">{row.label}</div>
              <ScoreBar label="GPT Image 2" score={row.image2} tone="rose" />
              <ScoreBar label="Nano Banana Pro" score={row.banana} tone="teal" />
              <div className="text-xs leading-5 text-slate-500">{row.note}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function PracticeSection() {
  const tasks = [
    { title: "练习 1：拆风格", body: "给三张同风格参考图，写出 5 个共同视觉特征，再用 Prompt Builder 生成一条风格迁移提示词。", icon: Paintbrush, tone: "teal" as Tone },
    { title: "练习 2：锁机位", body: "用任意粗糙 3D 或分镜截图标出镜头高度、遮挡和左右关系，再写成机位迁移提示词。", icon: Camera, tone: "amber" as Tone },
    { title: "练习 3：做复盘", body: "对一张生成图打分：风格像不像、元素有没有丢、纹理是否过脏、是否需要二次清洗。", icon: ClipboardCheck, tone: "rose" as Tone },
  ];

  return (
    <SectionShell id="practice" eyebrow="Practice" title="做练习：让学生真正理解上传内容" icon={ClipboardCheck}>
      <div className="grid gap-4 lg:grid-cols-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          const tone = toneStyles[task.tone];
          return (
            <div key={task.title} className={`rounded-lg border bg-white/[0.04] p-5 ${tone.border}`}>
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${tone.soft} ${tone.text}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-white">{task.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{task.body}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

function ScoreBar({ label, score, tone }: { label: string; score: number; tone: "rose" | "teal" }) {
  const color = tone === "rose" ? "bg-rose-300" : "bg-teal-300";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{score}/10</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  );
}

function TokenGrid({ values, selected, onToggle }: { values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => {
        const active = selected.includes(value);
        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
              active ? "border-emerald-200/40 bg-emerald-300/14 text-emerald-100" : "border-white/8 bg-white/6 text-slate-400 hover:bg-white/10"
            }`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

function ControlGroup({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-cyan-200" />
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SectionShell({ id, eyebrow, title, icon: Icon, children }: {
  id: string;
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-12">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          <Icon className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
