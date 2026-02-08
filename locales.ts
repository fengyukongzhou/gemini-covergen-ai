import { CoverStyle, Language } from './types';

export const translations = {
  en: {
    header: {
      title: "CoverGen",
      subtitle: "AI",
      poweredBy: "POWERED BY GEMINI 2.5 & 3.0",
      switchLang: "中文"
    },
    form: {
      sectionTitle: "Context Input",
      bookTitleLabel: "Book Title",
      bookTitlePlaceholder: "e.g. The Great Gatsby",
      authorNameLabel: "Author Name",
      authorNamePlaceholder: "e.g. F. Scott Fitzgerald",
      styleLabel: "Style Parameter",
      ratioLabel: "Output Ratio",
      
      // Buttons & States
      analyzeBtn: "Generate Prompts",
      generateArtBtn: "Generate Image",
      resetBtn: "New Session",
      
      analyzing: "Processing Context...",
      painting: "Generating Image...",
      errorPrefix: "Exception:",
      defaultError: "An unexpected error occurred during execution."
    },
    ratios: {
      '2:3': 'Book Cover (2:3)',
      '3:4': 'Portrait (3:4)',
      '1:1': 'Square (1:1)'
    },
    promptDisplay: {
      blueprintTitle: "Prompt Engineering",
      modelTag: "GEMINI 3 PRO PREVIEW",
      chooseOption: "Select Prompt Configuration",
      optionLabel: "Config",
      customLabel: "Custom Prompt",
      customPlaceholder: "Enter raw English prompt...",
      rationaleTitle: "Logic / Rationale",
      engPromptTitle: "Raw Prompt Preview",
      reviewNotice: "Review generated prompts and select a configuration."
    },
    result: {
      title: "Image Generation",
      modelTag: "GEMINI 2.5 FLASH IMAGE",
      download: "Download Asset",
      emptyState: "Ready to generate...",
      loadingState: "Calling Model..."
    },
    styles: {
      // Generic
      [CoverStyle.CINEMATIC_REALISM]: { 
        label: "Cinematic Realism", 
        desc: "High fidelity, ray-tracing style, dramatic lighting." 
      },
      [CoverStyle.MINIMALIST_TYPOGRAPHY]: { 
        label: "Bold Typography", 
        desc: "Type-driven, high contrast, negative space utilization." 
      },
      [CoverStyle.MODERN_ILLUSTRATION]: { 
        label: "Modern Illustration", 
        desc: "Vector style, flat design, vibrant RGB palette." 
      },

      // Designers
      [CoverStyle.DESIGNER_CHIP_KIDD]: { 
        label: "Chip Kidd Style", 
        desc: "Visual pun, isolated object, solid background, high contrast." 
      },
      [CoverStyle.DESIGNER_ALVIN_LUSTIG]: { 
        label: "Alvin Lustig Style", 
        desc: "Mid-century modern, abstract geometry, symbolic representation." 
      },
      [CoverStyle.DESIGNER_PETER_MENDELSUND]: { 
        label: "Peter Mendelsund Style", 
        desc: "Deconstruction, optical illusion, layered typography/image." 
      },
      [CoverStyle.DESIGNER_PAULA_SCHER]: { 
        label: "Paula Scher Style", 
        desc: "Large-scale typography, controlled chaos, map-like layout." 
      },
      [CoverStyle.DESIGNER_RODRIGO_CORRAL]: { 
        label: "Rodrigo Corral Style", 
        desc: "Mixed media, grit texture, neon accents, contemporary." 
      }
    }
  },
  zh: {
    header: {
      title: "封面生成",
      subtitle: "AI",
      poweredBy: "由 GEMINI 2.5 & 3.0 驱动",
      switchLang: "English"
    },
    form: {
      sectionTitle: "上下文输入 (Context)",
      bookTitleLabel: "书名",
      bookTitlePlaceholder: "例如：了不起的盖茨比",
      authorNameLabel: "作者",
      authorNamePlaceholder: "例如：弗朗西斯·斯科特·菲茨杰拉德",
      styleLabel: "风格参数 (Style)",
      ratioLabel: "输出比例 (Ratio)",

      // Buttons & States
      analyzeBtn: "生成提示词 (Generate Prompts)",
      generateArtBtn: "执行图像生成 (Generate Image)",
      resetBtn: "重置会话",

      analyzing: "正在处理上下文...",
      painting: "正在调用生图模型...",
      errorPrefix: "异常：",
      defaultError: "执行过程中发生意外错误。"
    },
    ratios: {
      '2:3': '标准书封 (2:3)',
      '3:4': '标准纵向 (3:4)',
      '1:1': '正方形 (1:1)'
    },
    promptDisplay: {
      blueprintTitle: "提示词工程 (Prompt Engineering)",
      modelTag: "GEMINI 3 PRO PREVIEW",
      chooseOption: "选择提示词配置",
      optionLabel: "配置",
      customLabel: "自定义 (Custom)",
      customPlaceholder: "在此输入原始英文提示词 (Raw Prompt)...",
      rationaleTitle: "生成逻辑",
      engPromptTitle: "提示词预览",
      reviewNotice: "审查生成的提示词方案，点击执行生成。"
    },
    result: {
      title: "图像生成 (Image Generation)",
      modelTag: "GEMINI 2.5 FLASH IMAGE",
      download: "下载资源",
      emptyState: "等待执行生成指令...",
      loadingState: "正在请求模型..."
    },
    styles: {
      // Generic
      [CoverStyle.CINEMATIC_REALISM]: { 
        label: "电影感写实", 
        desc: "高保真渲染，光线追踪风格，戏剧性布光。" 
      },
      [CoverStyle.MINIMALIST_TYPOGRAPHY]: { 
        label: "大字排版 / 极简主义", 
        desc: "字体驱动，高对比度，负空间利用。" 
      },
      [CoverStyle.MODERN_ILLUSTRATION]: { 
        label: "现代矢量插画", 
        desc: "矢量风格，扁平化设计，鲜艳 RGB 配色。" 
      },

      // Designers
      [CoverStyle.DESIGNER_CHIP_KIDD]: { 
        label: "奇普·基德风格 (Chip Kidd)", 
        desc: "视觉双关，孤立物体，纯色背景，高对比度。" 
      },
      [CoverStyle.DESIGNER_ALVIN_LUSTIG]: { 
        label: "阿尔文·拉斯蒂格风格 (Alvin Lustig)", 
        desc: "中世纪现代风格，抽象几何，符号化表达。" 
      },
      [CoverStyle.DESIGNER_PETER_MENDELSUND]: { 
        label: "彼得·门德尔桑德风格 (Peter Mendelsund)", 
        desc: "解构主义，视错觉，字体/图像分层叠加。" 
      },
      [CoverStyle.DESIGNER_PAULA_SCHER]: { 
        label: "宝拉·雪儿风格 (Paula Scher)", 
        desc: "超大尺度字体，受控的混乱，地图式布局。" 
      },
      [CoverStyle.DESIGNER_RODRIGO_CORRAL]: { 
        label: "罗德里戈·科拉尔风格 (Rodrigo Corral)", 
        desc: "混合媒介，颗粒纹理，霓虹点缀，当代风格。" 
      }
    }
  }
};