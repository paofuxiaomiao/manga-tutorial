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
  { id: "archive", label: "读原文", icon: FileImage },
  { id: "methods", label: "拆方法", icon: ClipboardCheck },
  { id: "builder", label: "改提示词", icon: SlidersHorizontal },
  { id: "practice", label: "做练习", icon: CheckCircle2 },
];

const sourceCards = [
  {
    title: "这次为什么值得学",
    tag: "模型观察",
    body: "GPT 2 代图像模型，好玩诶！我觉得奥特曼这次有点东西的。我怀疑它的「图像特征理解 + 模仿能力」可能目前断档强。",
    focus: ["图像特征理解", "推理转化", "审美判断"],
    details: [
      "玩了几天，火速分享感觉最“未来可期”的用法。",
      "它的聪明 + 优于香蕉的审美，也许会让 MJ 有点小慌。",
      "但目前版本仍然不可撼动香蕉的地位，因为一致性和画质还有明显短板。",
    ],
  },
  {
    title: "风格参考迁移",
    tag: "P2-P5",
    body: "小小 LoRA 的思路：不是每个人都能让大模型单独训练画风，自己训练 LoRA 又麻烦；原创创作者也不希望作品风格太泛化，所以可以只搓几张代表图，让 GPT 理解自己的风格，再批量迁移生图。",
    focus: ["多图参考", "非大众画风", "小小 LoRA 感"],
    details: [
      "亲测很多种非大众风格，从笔触、材质、线条到渲染，都能模仿个 7 成相近。",
      "它不是直接拼接原图内容，而是懂推理转化。",
      "TIPS：给参考时建议多图，关键特征涵盖比较全面；太特殊的风格可能要对话几轮去调教，稳定后可以持续复用。",
    ],
  },
  {
    title: "机位参考迁移",
    tag: "P6-P10",
    body: "用很粗糙的模型，在三维软件里搭建关键锚点，摆放调好比例的角色，调整摄像机获得满意角度；再让 AI 根据粗糙图像 + 原始场景图推理，得到精准角度的成品图。",
    focus: ["粗模锚点", "精准角度", "空间重构"],
    details: [
      "传统三维建模可以做到 360 度无死角机位，但建模难；图转 3D / 高斯泼溅目前效果还得加油。",
      "Image 2 基本能比较准确理解粗糙模型的机位角度，并合理调整原图。",
      "TIPS：现在图像质量偏低，1K 且有很多脏脏花花的过度细节，出图可能要超分、要洗；迁移时一致性问题多，常有丢元素、改元素情况。",
    ],
  },
  {
    title: "跨风格融图",
    tag: "P11-P12",
    body: "跨风格合成过去很容易翻车，香蕉的一致性在这类任务上基本是战五渣水平；现在 GPT Image 2 似乎有转机。",
    focus: ["角色风格独立", "场景风格独立", "融图自检"],
    details: [
      "如果看模型的思维链，会发现没有额外指令时，它默认有风格约束和自检流程来保障。",
      "大胆试，但要观察：角色有没有被场景风格同化，场景有没有被角色画风污染。",
      "原分享里特别强调：GPT 仍存在一致性问题，但基础风格特征保持上比香蕉问题更少。",
    ],
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
    raw:
      "【风格参考迁移：P2-P5，小小 LoRA～】\n\n场景&思路：毕竟不是每个人都能让大模型去给咱的画风单独训练，自己训练 LoRA 又很烦，而很多原创创作者又不希望自己的作品风格太泛化。那就可以试试这个：只搓几张代表性的，然后让 GPT 去理解自己的风格，再批量迁移生图！\n\n亲测了很多种非大众的风格，从笔触 / 材质 / 线条 / 渲染，都能模仿个 7 成相近，而且它并不是直接拼接原图内容，它是懂推理转化的。\n\nTIPS：给参考时，建议多图，关键特征涵盖比较全面。个别太特殊的可能要对话几轮去调教它，稳定后就可以持续复用。",
    student:
      "先别急着让学生写“某某风格”。要让学生从参考图里逐项读出：线条粗细、边缘松紧、笔触方向、材质颗粒、用色倾向、人物比例、背景留白、光影方式。\n\n然后再判断：这些是“可迁移的风格语言”，还是“不能复制的原图内容”。这一步是风格迁移课的核心。",
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
    raw:
      "【机位参考迁移：P6-P10，用渣渣模型 360 度下机位～】\n\n场景&思路：传统三维建模可以做到 360 度无死角的下机位，但建模好难。现在的图片转 3D / 高斯泼溅模型效果还得加油。\n\n所以可以用很粗糙的模型，在三维软件中只搭建关键粗略锚点 + 摆放自己调好比例的角色，然后调整摄像机获得满意角度，再让 AI 模型根据这个粗糙图像 + 原始场景图推理，从而得到精准角度的成品图。\n\nTIPS 1：GPT 现在图像质量其实蛮低的，1K，且超多脏脏花花的过度细节，出图可能要超分、要洗，目前可用度还不高。\nTIPS 2：GPT 在迁移时，一致性问题比较多，常有丢 / 改元素的情况，这方面没有香蕉稳；但是香蕉等模型，这个玩法基本已读乱回。",
    student:
      "这组不要让学生评价粗模好不好看。粗模唯一任务是锁住空间：摄像机高度、镜头朝向、主体比例、前后遮挡、左右位置、远景关系。\n\n学生写提示词时，必须把空间关系逐项转成文字。元素越多，越不能只写“参考图 1 的机位”，要写清楚哪个色块代表哪个角色，哪个几何体代表遮挡物。",
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
    raw:
      "【跨风格融图：P11-P12】\n\n香蕉的一致性，在跨风格合成上，基本是个战五渣水平，谁用谁知道。也因为这个原因，过往尽量避免不好搞的画风，不给自己挖坑。但现在好像有转机了。\n\n场景&思路：这个很简单，大胆试就好了。如果你去看 GPT 的思维链，会发现只要没有额外指令，它默认有风格约束和自检流程来保障。\n\n小总结：GPT2 长板极其突出，也很好玩，但目前版本仍然不可撼动香蕉的地位。它的聪明 + 优于香蕉的审美，也许 MJ 有点小慌。",
    student:
      "跨风格融图不能只写“把 A 放进 B”。要拆成四个互不污染的层：角色保持什么、场景保持什么、构图允许改什么、光线如何统一。\n\n学生复盘时要问：角色有没有被改成场景的材质？场景有没有变成角色的画风？主体动作是否为了融入场景而丢了身份特征？",
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

const originalArchive = [
  {
    title: "风格参考迁移（1）",
    tag: "P2",
    subtitle: "多图风格参考：Alberto Mielgo 人物美术风格（白底设定图）",
    original:
      "原 5 张参考图作为同一作者的风格样本。截图里对比 GPT Image 2 与 Nano Banana Pro：GPT Image 2 更像是在理解参考图的线条、五官比例、色块边缘和人物设定图气质；香蕉更容易变成常见赛博 / 朋克插画风。",
    prompt:
      "发送给你的所有参考图都出于同一个作者，请你参考这种美术风格，然后生成一个亚洲年轻女性的半身白底正视图。",
    note: "课堂重点：不要只看“像不像”，还要让学生圈出参考图共同点：脸部比例、嘴唇形状、眼部色块、线条松紧、发丝处理、白底设定图的干净感。",
  },
  {
    title: "风格参考迁移（2）",
    tag: "P3",
    subtitle: "《怪化猫》的浮世绘二维场景风格",
    original:
      "原 6 张参考图来自《怪化猫》场景：高饱和配色、装饰性线条、纸面纹理、烟雾形曲线、平面化空间、强图案感。截图里要求生成自由女神雕像中景和摩洛哥街道场景，且场景中没有人物。",
    prompt:
      "参考我发给你的参考图的美术风格，包括配色的风格，生成一张自由女神雕像的中景画面 / 摩洛哥的街道场景图，场景中没有人物。",
    note: "课堂重点：让学生观察“参考的是场景美术风格”，不是参考具体鸟居、桥、灯笼等物件。生成纽约或摩洛哥时，应该保留配色和纸纹，不应该把原场景元素硬搬过去。",
  },
  {
    title: "风格参考迁移（3）",
    tag: "P4",
    subtitle: "材质迁移：参考风格 + 形象设计图",
    original:
      "截图例子使用《荒野机器人》一类带有手绘笔触的风格化 3D 作为前 6 张参考图，再把第 7 张灰白色小狐狸形象设定图转成同类美术风格。结果强调：角色虽然是 3D，但要有明显绘画笔触感。",
    prompt:
      "发送给你的前 6 张参考图都出于同一个作者，请你参考这种美术风格中角色的绘制方法，然后将第 7 张的灰白色小狐狸形象设定图转化为与参考图中角色一样的美术风格，中性灰底，柔和的侧面暖光打光。必须注意角色虽然是 3D 的，但是有明显的绘画笔触感。",
    note: "课堂重点：这是“材质与渲染方式迁移”，不是重画角色设定。要保留小狐狸的耳朵、机械部件、衣服比例、侧面姿态，再把毛发边缘、暖光和笔触迁移过去。",
  },
  {
    title: "风格参考迁移（4）",
    tag: "P5",
    subtitle: "《以窗为马》的角色 + 场景混合风格模仿",
    original:
      "原 3 张参考图提供同一作者的美术风格，包含人物造型、上色特点、配色方法和场景气质。截图里的目标是生成一个年老日本女性和年轻英国男警官，场景是飞机场大厅。",
    prompt:
      "发送给你的所有参考图都出于同一个作者，请你参考这种美术风格的绘制方法、人物造型和上色特点，包括配色的方法，然后生成一个年老的日本女性和一个年轻的英国男警官的形象，场景是飞机场的大厅。",
    note: "课堂重点：这是“角色 + 场景一起模仿”。要提醒学生检查：人物脸型是否保持参考风格，机场大厅是否也使用同一套线条和配色，而不是变成普通写实插画。",
  },
  {
    title: "机位参考迁移（1）",
    tag: "P6",
    subtitle: "空场景：用粗糙场景 3D 模型作为参考",
    original:
      "测试方式：将场景图放入 Tripo / Meshy 等图像转 3D 模型，生成粗糙模型后在平台内部调整到需要的角度，然后截图作为机位参考。示例是沙漠工业废墟：左边是粗糙模型俯视角，右边是原始水平视角场景图，要求调整为一致机位。",
    prompt:
      "按照图 1 俯拍模型图中的拍摄机位和构图，将图 2 的水平视角的场景图调整到一样的拍摄机位和构图。图 1 模型图中左侧的圆柱高塔是图 2 场景图中画面右侧的圆柱高塔。",
    note: "原备注：基本可以比较精准地理解粗糙模型的机位角度，并将原图合理调整；但图像质量低，以及较多噪点和过度渲染带来繁复细节。",
  },
  {
    title: "机位参考迁移（2-3）",
    tag: "P7",
    subtitle: "更多空场景：桥梁与魔法教室",
    original:
      "截图用两组例子继续测试空场景改机位。桥梁例子是灰模桥 + 悬崖桥原图，GPT Image 2 试图按灰模角度重构桥体；魔法教室例子是灰模室内长桌 + 原场景，GPT Image 2 尝试重构桌子、窗户、货架和透视。",
    prompt:
      "按照粗糙 3D 模型的镜头角度、透视关系和构图，将原始场景图调整到相同机位；模型只作为空间关系参考，不作为材质和细节参考。",
    note: "课堂重点：让学生比较 GPT Image 2 与 Nano Banana Pro 的差异。前者更愿意理解机位并重构，后者可能更稳但容易按字面贴合或乱回。",
  },
  {
    title: "机位参考迁移（2）",
    tag: "P8",
    subtitle: "带多角色粗糙模型：融图 + 改变机位",
    original:
      "例 1 是 2 个角色 + 改变机位。粗模里粉色人物代表白发女孩，蓝色熊猫代表熊猫；场景是沙漠荒漠篝火正面全景图。粗模里的白色立方体代表篝火堆左侧石头，并作为前景遮挡女孩脚部；远景中右侧桥梁在新图里要变到中间偏左，两侧是山脉。",
    prompt:
      "按照图 1 模型的构图、透视关系、遮挡关系、拍摄角度以及比例关系生成一张新的图。图 1 中的粉色人物代表图 3 的白发女孩，图 1 中的蓝色熊猫代表图 4 中的熊猫，场景为图 2 的沙漠荒漠篝火正面全景图。图 1 的白色立方体代表图 2 中的篝火堆左侧的石头并作为前景部分遮挡女孩的脚部，确保图 2 场景中景物相对关系与原图一致。",
    note: "课堂重点：这类提示词必须写得像“空间说明书”。角色、遮挡物、远景桥梁、山脉、火堆位置都要逐项映射。",
  },
  {
    title: "机位参考迁移（3）",
    tag: "P9-P10",
    subtitle: "3 个角色 + 改变机位，以及分镜转粗糙模型",
    original:
      "例 3 是 3 个角色 + 改变机位。原备注说：场景角度、透视关系、人物站位及比例确实有偏差，但相较其他模型已经最接近正确；角色 / 元素越多，错误概率越高，各类细节一致性越差。另一张分镜测试强调：最好不带模型贴图，否则第二步污染严重、细节错误较多。",
    prompt:
      "先把原始分镜图直接转为粗糙模型，改角度截图；再让 GPT2 利用新机位粗糙模型重构场景；最后可用 Banana 修复细节。粗糙模型只给机位，不要把模型贴图作为最终材质参考。",
    note: "课堂重点：让学生区分“机位准”和“元素准”。机位可能进步明显，但多角色一致性仍然是风险。",
  },
  {
    title: "跨风格融图（1）",
    tag: "P11",
    subtitle: "Painterly 3D 角色 + 类皮克斯 3D 场景",
    original:
      "截图标题：不同画风的角色与场景融图，并保持各自的风格独立。例 1 是 Painterly 3D 角色 + 类皮克斯 3D 场景。原备注写到：香蕉已经完全把角色改成了更接近场景风格的皮克斯 3D 毛绒，而 GPT 仍然较好保持了角色原本风格。",
    prompt:
      "将角色放入场景中：角色保持原本的 painterly 3D 风格、毛发质感、服装和五官比例；场景保持类皮克斯 3D 场景的光照、材质和水面反射。允许调整角色动作以适应船和水面，但不要把角色改成场景的毛绒风。",
    note: "课堂重点：跨风格不是简单融合，而是“分区保持”。角色区、场景区、光线区分别约束。",
  },
  {
    title: "跨风格融图（2）",
    tag: "P12",
    subtitle: "特殊简笔平涂 2D 人物 + 三渲二场景",
    original:
      "截图例 2 是特殊简笔平涂 2D 人物 + 三渲二场景。原备注：看香蕉融后，角色风格和特征已有明显变化，原场景中的细节缺失较多；GPT 也存在一致性问题，但基础风格特征保持上比香蕉问题更少。",
    prompt:
      "将简笔平涂 2D 人物放入三渲二厨房场景中。人物需要保持原本的平面线条、脸型、五官和校服特征；场景保持三渲二的光照、体块和透视。允许调整人物姿势和光线方向，但不要把人物改成普通日系三渲二角色。",
    note: "课堂重点：这里要让学生看“保留失败的边界”。不是只夸 GPT，而是比较哪些细节丢了、哪些基础风格保住了。",
  },
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
        <OriginalArchive />
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
            这节课先尽量保留原分享的例子、提示词和备注，再把风格迁移、机位迁移和跨风格融图拆成可练习的方法。
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
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const copy = ["先知道原分享在兴奋什么。", "保留 P2-P12 的例子、提示词和备注。", "把三种玩法变成可复用步骤。", "用选择器生成结构化提示词。", "用风险清单判断是否可交付。"][index];
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
          <div className="mt-4 space-y-2">
            {card.details.map((detail) => (
              <div key={detail} className="rounded-md border border-white/8 bg-black/18 p-3 text-sm leading-6 text-slate-400">
                {detail}
              </div>
            ))}
          </div>
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

function OriginalArchive() {
  const [active, setActive] = useState(0);
  const item = originalArchive[active];
  const teaching = getTeachingMaterial(item);

  return (
    <SectionShell id="archive" eyebrow="Screenshot To Lesson" title="截图教学材料：原内容 + 任务单" icon={FileImage}>
      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-2 rounded-lg border border-white/8 bg-white/[0.025] p-2 lg:max-h-[680px] lg:overflow-y-auto">
          {originalArchive.map((entry, index) => (
            <button
              key={entry.title}
              onClick={() => setActive(index)}
              className={`w-full rounded-md border p-3 text-left transition ${
                active === index ? "border-cyan-200/35 bg-cyan-300/12" : "border-white/8 bg-black/16 hover:bg-white/7"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-100">{entry.title}</span>
                <span className="rounded bg-white/8 px-2 py-0.5 text-[10px] font-semibold text-slate-400">{entry.tag}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{entry.subtitle}</p>
            </button>
          ))}
        </div>

        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="rounded-lg border border-white/8 bg-white/[0.04] p-5"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-rose-300/12 px-2.5 py-1 text-xs font-semibold text-rose-100">{item.tag}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">上传截图内容转写 + 教学化处理</span>
          </div>
          <h3 className="font-serif text-2xl font-semibold text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-cyan-100/80">{item.subtitle}</p>

          <div className="mt-5 grid gap-3">
            <ArchiveBlock title="原图 / 原分享信息" body={item.original} tone="teal" />
            <ArchiveBlock title="截图中的提示词 / 可复用提示词" body={item.prompt} tone="amber" />
            <ArchiveBlock title="备注与课堂观察" body={item.note} tone="rose" />
          </div>

          <div className="mt-5 rounded-lg border border-cyan-200/16 bg-cyan-300/8 p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">本页教学目标</h4>
            <p className="text-sm leading-7 text-slate-300">{teaching.objective}</p>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ArchiveList title="教师引导怎么问" items={teaching.teacherMoves} tone="cyan" />
            <ArchiveList title="学生要标注什么" items={teaching.studentTasks} tone="teal" />
            <ArchiveList title="学生最后交什么" items={teaching.deliverables} tone="amber" />
            <ArchiveList title="容易误判的地方" items={teaching.pitfalls} tone="rose" />
          </div>
        </motion.article>
      </div>
    </SectionShell>
  );
}

function getTeachingMaterial(item: (typeof originalArchive)[number]) {
  if (item.title.includes("风格参考迁移")) {
    return {
      objective: "让学生从截图中读出“参考图到底提供了什么”：不是复制人物或场景，而是抽取可迁移的画风特征，再把这些特征写成清楚的提示词约束。",
      teacherMoves: [
        "先让学生只看参考图区域，圈出 5 个共同视觉特征，再看生成结果是否真的保留这些特征。",
        "追问：这条提示词里哪些词在控制风格，哪些词在控制主体，哪些词在防止复制原图内容？",
        "对比 GPT Image 2 和 Nano Banana Pro：不要说哪个好看，必须说出哪一项风格特征被保留或丢失。",
      ],
      studentTasks: [
        "标注线条、配色、材质、人物比例、背景处理这 5 类信息。",
        "把原提示词拆成“参考来源 / 生成目标 / 风格约束 / 禁止事项”。",
        "写一句复盘：模型是理解了风格，还是只做了表面模仿？",
      ],
      deliverables: [
        "一张风格特征表：至少 5 个特征，每个特征配一句证据。",
        "一条改写后的提示词：必须包含“只迁移风格，不复制内容”。",
        "一份对比判断：GPT Image 2 与 Banana 各保留了什么、丢了什么。",
      ],
      pitfalls: [
        "把“像某作者”写成空泛标签，不说具体笔触和材质。",
        "把参考图里的角色、姿势或背景误当成必须复制的内容。",
        "只凭审美投票，不做证据化分析。",
      ],
    };
  }

  if (item.title.includes("机位参考迁移")) {
    return {
      objective: "让学生把截图里的粗糙模型当作空间锚点，而不是美术参考；训练他们把机位、透视、遮挡、比例和元素映射写成可执行提示词。",
      teacherMoves: [
        "先遮住成品图，只看粗模和原场景，让学生说出镜头高度、视角方向、前景遮挡和远景位置。",
        "要求学生解释每个色块或几何体代表什么，不允许只说“参考图 1”。",
        "用备注引导风险判断：机位接近不等于元素一致，角色越多错误概率越高。",
      ],
      studentTasks: [
        "标注粗模里的主体、遮挡物、前景、中景、远景。",
        "把“左 / 右 / 前 / 后 / 被遮挡 / 远景移动”写成明确文字。",
        "判断输出错误属于机位错误、元素丢失、材质污染还是画质噪点。",
      ],
      deliverables: [
        "一张空间映射表：粗模元素 -> 原图元素 -> 新图位置。",
        "一条机位迁移提示词：必须说明粗模只作机位和比例参考。",
        "一份风险复盘：至少列出 3 个可能出错点。",
      ],
      pitfalls: [
        "把粗糙 3D 的灰模材质带进最终图。",
        "只说“换角度”，没有说清楚哪个元素移动到哪里。",
        "忽略多角色场景里比例和遮挡最容易崩。",
      ],
    };
  }

  return {
    objective: "让学生理解跨风格融图不是简单把 A 放进 B，而是分区保持角色、场景、构图和光线，避免角色被场景同化或场景被角色风格污染。",
    teacherMoves: [
      "先让学生分别描述角色风格和场景风格，再看生成图有没有互相污染。",
      "追问：哪些地方允许为了融入场景而调整？哪些身份特征绝对不能改？",
      "让学生用截图里的 Banana 对照结果理解“风格同化”这个风险。",
    ],
    studentTasks: [
      "标注角色必须保留的 4 个特征：画风、材质、五官 / 造型、服装或身份。",
      "标注场景必须保留的 3 个特征：光线、空间、材质 / 渲染方式。",
      "写出一条禁止项：不要把角色改成场景风格，也不要把场景改成角色画风。",
    ],
    deliverables: [
      "一张分区约束卡：角色区、场景区、构图区、光线区分别写清楚。",
      "一条跨风格融图提示词：必须包含允许改变和禁止改变。",
      "一份同化判断：指出生成图中哪里保持住了，哪里被同化了。",
    ],
    pitfalls: [
      "只写“融合两张图”，没有区分角色和场景的风格边界。",
      "为了画面统一，把角色身份特征改没了。",
      "只看角色，不检查原场景细节是否缺失。",
    ],
  };
}

function ArchiveBlock({ title, body, tone }: { title: string; body: string; tone: Tone }) {
  const style = toneStyles[tone];

  return (
    <div className={`rounded-lg border ${style.border} bg-black/18 p-4`}>
      <h4 className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${style.text}`}>{title}</h4>
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{body}</p>
    </div>
  );
}

function ArchiveList({ title, items, tone }: { title: string; items: string[]; tone: Tone }) {
  const style = toneStyles[tone];

  return (
    <div className={`rounded-lg border ${style.border} bg-white/[0.035] p-4`}>
      <h4 className={`mb-3 text-xs font-semibold uppercase tracking-[0.16em] ${style.text}`}>{title}</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-sm leading-6 text-slate-400">
            <CheckCircle2 className={`mt-1 h-3.5 w-3.5 shrink-0 ${style.text}`} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
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
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{item[tab]}</p>
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
