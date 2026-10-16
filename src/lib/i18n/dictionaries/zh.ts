import type { Dictionary } from "./en";

export const zh: Dictionary = {
  meta: {
    titleDefault: "UangCounsel — 带实证的 AI 合同审查",
    titleHome: "带实证的 AI 合同审查",
    titleQa: "问答 — 关于本项目",
    description:
      "上传合同，看着大模型逐条阅读，获得风险标记，并在文档上精确高亮触发文本。不是意见——是实证。",
    descriptionHome:
      "上传合同，看着大模型逐条阅读，获得直接指向触发文本的风险标记。",
    descriptionQa:
      "关于 UangCounsel 的直白问答：哪些是真实的、哪些是预计算的、流水线如何工作、隐私，以及它与 uang.ai 的关系。",
    ogTitle: "UangCounsel — 带实证的 AI 合同审查",
    ogDescription:
      "AI 合同审查：每一条风险标记都指向触发它的确切条款文本。Rico 的作品集项目。",
  },
  common: {
    chooseLanguage: "选择语言",
    toLight: "切换到浅色模式",
    toDark: "切换到深色模式",
    toggleTheme: "切换主题",
  },
  nav: {
    review: "审查",
    samples: "样例",
    how: "工作原理",
    qa: "问答",
  },
  home: {
    badge: "AI 审查，但附实证",
    heroTitleA: "合同逐条审查 ——",
    heroTitleB: " 精确高亮原文。",
    heroBodyA:
      "大多数 AI 审查只是在聊天窗口里给你意见。UangCounsel ",
    heroBodyEm: "直接在文档本身上",
    heroBodyB:
      "标记风险条款，用一句话解释商业影响，并起草谈判要点。你来读合同；机器告诉你该看哪里。",
    step1: "① 打开样例或上传 PDF",
    step2: "② 大模型阅读",
    step3: "③ 每个标记都链接到其原文",
    samplesTitle: "样例文件",
    samplesBody:
      "三份刻意埋入单边条款的仿真合同——正是公司法务团队每周都会遇到的那些陷阱。",
    howTitle: "没有黑箱",
    howBody: "这条流水线刻意保持透明——与我们其他作品相同的诚实标记。",
    howSteps: [
      {
        n: "01",
        t: "文本 + 几何",
        d: "PDF 由 pdf.js 解析：每个字符连同其在页面上的精确位置一起被提取，构建可检索的坐标索引。",
      },
      {
        n: "02",
        t: "结构化 LLM 处理",
        d: "模型必须以严格的 JSON 结构作答：标题、类别、风险、逐字引文、商业影响和谈判要点。无效输出先修复一次，然后拒绝。",
      },
      {
        n: "03",
        t: "引文定位",
        d: "每条逐字引文都会在坐标索引中逐行定位。如果模型截断了引文，片段匹配会将其找回。找不到的引文会被标注，绝不造假。",
      },
      {
        n: "04",
        t: "可审计的高亮",
        d: "结果不是聊天答案。而是页面上你可以亲眼验证的高亮，外加一个无需任何 AI 基础设施的预计算模式。",
      },
    ],
    disclaimer:
      "AI 辅助且仅供参考——不构成法律意见。上传的 PDF 仅在内存中分析，绝不会被存储。",
  },
  samples: {
    "vendor-msa": {
      title: "Vendor Master Services Agreement",
      type: "MSA · 咨询",
      blurb:
        "经典供应商文本：附带 180 天通知陷阱的自动续约、单方赔偿、3 个月责任上限——以及单方修改条款。",
      traps: ["自动续约", "单方赔偿", "低责任上限", "单方修改"],
    },
    "saas-subscription": {
      title: "SaaS Subscription Agreement",
      type: "SaaS · 订阅",
      blurb:
        "层层叠加的自动续约涨价、无 SLA 救济、退出时数据锁定，以及“继续使用即视为接受”的条款变更。",
      traps: ["价格上涨", "无 SLA 救济", "数据取回费", "悄悄改条款"],
    },
    "employment-offer": {
      title: "Senior Consultant Employment Agreement",
      type: "雇佣",
      blurb:
        "宽泛的竞业禁止、永久保密义务、未提前通知的追回条款，以及越界伸向个人项目的知识产权归属。",
      traps: ["竞业禁止", "永久保密", "追回条款", "宽泛 IP 归属"],
    },
  },
  reviewer: {
    trySample: "试用样例合同",
    upload: "上传你的 PDF",
    samplesNote:
      "样例：由同一流水线分析的真实 PDF，已预计算，打开即现。上传文件则实时通过 LLM 流水线处理。仅支持文本型 PDF（最大 8 MB）。",
    stages: [
      "正在读取文档…",
      "正在提取条款…",
      "正在评估风险…",
      "正在页面上定位引文…",
    ],
    analysisFailed: "分析失败。",
    noLlmTip: "提示：下方三份样例合同无需任何 API 密钥即可使用——其分析已预计算。",
    networkError: "网络错误——无法连接分析端点。",
    choosePdf: "请选择 PDF 文件。",
    tooLarge: "PDF 过大（最大 8 MB）。",
    copied: "已复制 ✓",
    copySummary: "复制摘要",
    pages: "{n} 页",
    precomputed: "预计算分析",
    live: "实时分析",
    liveAnalysis: "实时分析，用时 {s} 秒",
    flagsNote: "每个标记都指向其原文",
    notFound: "未找到引文",
    noClauses: "找到 {n} 条值得注意的条款。",
    riskLabel: { high: "高风险", medium: "需审查", low: "无碍" },
    risk: { high: "高", medium: "中", low: "低" },
    copyTitle: "合同审查 — {doc}",
    copyExcerpt: "摘录",
    copyWhy: "为何重要",
    copyAsk: "谈判要点",
    copyDisclaimer: "AI 辅助审查——仅供参考，不构成法律意见。",
  },
  footer: {
    disclaimer:
      "Rico 的作品集项目。分析由 AI 辅助且仅供参考——不构成法律意见。与 uang.ai 无关联亦未获其认可。",
  },
  notFound: {
    text: "此页面不在合同里。",
    back: "返回审查",
  },
  qa: {
    heading: "问答",
    intro:
      "关于 UangCounsel 本身的直白回答：哪些是真实的、哪些是预计算的、流水线如何工作，以及你的数据会发生什么。",
    cover: "问答没有覆盖到的问题？试试",
    coverLink: "审查器",
    coverTail: "，亲眼看看。",
    categories: {
      project: {
        label: "关于项目",
        items: [
          {
            q: "UangCounsel 是什么？",
            a: "一个作为作品集构建的 AI 合同审查工具：上传文本型 PDF 合同，获得条款级风险标记，每个标记都指向触发它的确切高亮文本，并为每条条款附上一句话商业解释和谈判要点。",
          },
          {
            q: "为什么要构建它？",
            a: "作为 uang.ai（\"The AI Factory\"）展示的第三件作品：UangLite 证明智能体可以安全地操作业务应用，UangFactory 证明一个网站可以证明而非空谈，UangCounsel 则证明同一设计语言在非结构化文档上同样有效——这正是 uang.ai 自家案例研究的垂直领域之一（法律）。",
          },
          {
            q: "它与 uang.ai 有关联吗？",
            a: "没有。Rico 的独立作品集项目——与 uang.ai 无关联亦未获其认可。灵感来自其定位：商业理解 + 工程能力 + AI 专长。",
          },
          {
            q: "这是法律意见吗？",
            a: "不是。分析由 AI 辅助且仅供参考。它的设计目的是告诉你去哪里看、该问什么，而不是取代律师。每份输出都如此声明。",
          },
        ],
      },
      real: {
        label: "真实 vs. 预计算",
        items: [
          {
            q: "分析是真实的 AI 吗？",
            a: "是的。上传的 PDF 实时通过 LLM 流水线处理（任何兼容 OpenAI 的端点）。三份样例合同附带预计算分析——由完全相同的流水线生成后冻结，让演示即点即开且零成本。",
          },
          {
            q: "我怎么知道高亮不是造假的？",
            a: "每个高亮都是几何数据，不是截图：服务器把模型的逐字引文定位回 PDF 的字符级坐标索引中。如果引文找不到——比如模型截断了它——条款卡片会写“未找到引文”，而不是装作找到。",
          },
          {
            q: "没有 API 密钥会怎样？",
            a: "样例依然完全可用（预计算），上传则返回明确的“LLM 端点未配置”消息而不是崩溃的页面。优雅降级是这里的设计原则，不是事后补救。",
          },
          {
            q: "模型会产生幻觉吗？",
            a: "模型可能编造引文——这正是定位步骤存在的理由。流水线只显示能在文档中逐字找到的引文；其余的要么被修复（重试一次），要么标注为未找到。“为何重要”和“建议”字段属于模型判断，已标记为仅供参考。",
          },
        ],
      },
      pipeline: {
        label: "工作原理",
        items: [
          {
            q: "高亮在技术上如何实现？",
            a: "pdf.js 提取每个字符及其页面位置，由此构建坐标索引；模型引文与之匹配（不区分大小写、容忍空白差异、支持省略号片段回退），并按可视行合并为一个矩形。查看器在 canvas 上渲染 PDF，并在这些坐标上绝对定位彩色覆盖层。",
          },
          {
            q: "什么保证 LLM 输出有效？",
            a: "提示词中写明了严格的 JSON 结构（兼容 OpenAI 的端点通常没有硬性 schema 强制），输出用 zod 校验并做宽松归一化（如 'High' → 'high'），失败的一次尝试恰好获得一轮修复往返，之后回退为清晰的错误提示。",
          },
          {
            q: "有哪些限制？",
            a: "仅支持文本型 PDF——扫描文档没有可提取的文本，会被拒绝并附说明。最大 8 MB、40 页。多栏排版可能给行合并启发式带来压力。每个 IP 每分钟限 10 次分析。",
          },
        ],
      },
      privacy: {
        label: "隐私与数据",
        items: [
          {
            q: "你们会存储我上传的合同吗？",
            a: "不会。上传内容在内存中分析后即丢弃。本项目没有数据库——响应发送之后，你的文档不留任何痕迹。",
          },
          {
            q: "LLM 提供商能看到什么？",
            a: "你上传文档的提取文本会被发送到所配置的 LLM 端点进行分析。这是一切 LLM 审查的固有属性。对于敏感合同，请运行你自己的实例——整条流水线支持自托管，可使用本地模型端点。",
          },
        ],
      },
      stack: {
        label: "技术栈与杂项",
        items: [
          {
            q: "它是用什么构建的？",
            a: "Next.js 16（App Router）· React 19 · Tailwind CSS 4 · TypeScript · AI SDK（任何兼容 OpenAI 的端点）· pdf.js（解析与渲染）· Vitest（单元测试）· Playwright（端到端测试）。设计上无数据库。",
          },
          {
            q: "它是如何测试的？",
            a: "单元测试覆盖几何层（引文定位、片段回退）和输出校验。Playwright 端到端测试覆盖完整用户流程：打开样例、观看高亮渲染、点击条款跳转到原文、切换主题，以及问答页面。",
          },
          {
            q: "深色/浅色模式是怎么来的？",
            a: "一套手写的令牌系统（CSS 自定义属性 + Tailwind 4），按浏览器持久化，首次访问跟随 prefers-color-scheme。无需任何 UI 库。",
          },
          {
            q: "我可以运行自己的实例吗？",
            a: "可以——它是开源的。克隆仓库，视需要将 LLM_BASE_URL / LLM_API_KEY / LLM_MODEL 设为环境变量（任何兼容 OpenAI 的端点都可以，包括本地端点），然后部署。其余一切零配置即可工作。",
          },
        ],
      },
    },
  },
};
