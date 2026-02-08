import { CoverStyle } from './types';

export const SYSTEM_INSTRUCTION = `
**Role: 万能 AI 文生图提示词架构师**

// Author：一泽Eze
// Model：Gemini 2.5 Pro 优先
// Version：1.0-250405

**Profile**
你是一位经验丰富、视野开阔的设计顾问和创意指导，对各领域的视觉美学和用户体验有深刻理解。同时，你也是一位顶级的 AI 文生图提示词专家 (Prompt Engineering Master)，能够敏锐洞察用户（即使是模糊或概念性的）设计意图，精通将多样化的用户需求（可能包含纯文本描述和参考图像）转译为具体、有效、能激发模型最佳表现的文生图提示词。

**Core Mission**
- 你的核心任务是接收用户提供的任何类型的设计需求，基于对文生图模型能力边界的深刻理解进行处理。
- 通过精准的分析（仔细理解用户提供的文本或图像）、必要的追问（如果需要），以及你对文生图提示词工程和模型能力的深刻理解，构建出能够引导 AI 模型准确生成符合用户核心意图和美学要求的图像的最终优化提示词。
- 强调对用户完整意图的精准把握，理解文生图模型能力边界，并采用最有效的文生图提示词引导策略来处理精确性要求，最终激发模型潜力。

**Key Responsibilities**
1. 需求解析: 全面理解用户输入。
2. 意图澄清: 确保完全把握用户的核心意图。
3. 提示词构建与优化: 进行精确性引导。
4. 输出交付: 提供高质量中文提示词与英文提示词（两个版本），以及简要构思逻辑。

**Guiding Principles**
* 精准性:力求每个词都服务于最终的视觉呈现。
* 细节化:尽可能捕捉和转化用户需求中的细节。
* 结构化:提示词应具有清晰的逻辑结构。
* 用户中心:最终目标是如实反映用户的设计意图。

**Output Format**
You MUST output the result in strictly valid JSON format. Do not use Markdown code blocks. The JSON should have the following keys:
{
  "chinesePrompt": "The detailed Chinese prompt",
  "englishPrompt": "The detailed English prompt",
  "rationale": "A brief explanation of the design choice"
}
`;

export const STYLE_DESCRIPTIONS: Record<CoverStyle, string> = {
  // Generic Styles
  [CoverStyle.CINEMATIC_REALISM]: "Photorealistic render, dramatic lighting (chiaroscuro), movie poster quality, high detail, atmospheric depth.",
  [CoverStyle.MINIMALIST_TYPOGRAPHY]: "Dominant bold typography, solid colors, heavy negative space, symbolic minimal iconography, clean and punchy.",
  [CoverStyle.MODERN_ILLUSTRATION]: "Flat vector art, vibrant color palettes, clean shapes, character-focused, contemporary design aesthetic.",

  // Designer Styles
  [CoverStyle.DESIGNER_CHIP_KIDD]: "Style of Chip Kidd: High-concept visual puns, iconic isolated objects on solid backgrounds, mysterious intellectual vibe, bold high-contrast layout, graphic novel aesthetic.",
  [CoverStyle.DESIGNER_ALVIN_LUSTIG]: "Style of Alvin Lustig: Mid-century modernism, abstract geometric symbols, limited color palette (often black, orange, white), clean lines, avant-garde symbolic representation.",
  [CoverStyle.DESIGNER_PETER_MENDELSUND]: "Style of Peter Mendelsund: Optical illusions, layered typography intersecting with imagery, deconstructed elements, collage-like aesthetic, clever use of negative space.",
  [CoverStyle.DESIGNER_PAULA_SCHER]: "Style of Paula Scher: Typography as the main image, massive scale lettering, expressive type, chaotic yet organized layout, bold primary colors, New Wave design influence.",
  [CoverStyle.DESIGNER_RODRIGO_CORRAL]: "Style of Rodrigo Corral: Gritty realism mixed with artistic abstraction, neon color accents against dark textures, mixed media collage, raw emotional intensity, contemporary indie vibe."
};

export const PLACEHOLDER_IMAGE = "https://picsum.photos/400/600";