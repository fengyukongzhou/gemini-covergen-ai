export enum CoverStyle {
  // Generic Styles (3 Selected)
  CINEMATIC_REALISM = 'Cinematic Realism',
  MINIMALIST_TYPOGRAPHY = 'Bold Typography',
  MODERN_ILLUSTRATION = 'Modern Illustration',

  // Designer Inspired Styles (5 Kept)
  DESIGNER_CHIP_KIDD = 'Style of Chip Kidd',
  DESIGNER_ALVIN_LUSTIG = 'Style of Alvin Lustig',
  DESIGNER_PETER_MENDELSUND = 'Style of Peter Mendelsund',
  DESIGNER_PAULA_SCHER = 'Style of Paula Scher',
  DESIGNER_RODRIGO_CORRAL = 'Style of Rodrigo Corral'
}

export type Language = 'en' | 'zh';

export type AspectRatio = '2:3' | '3:4' | '1:1';

export interface BookDetails {
  title: string;
  author: string;
  style: CoverStyle;
  aspectRatio: AspectRatio;
}

export interface DesignOption {
  title: string; // Short English title
  title_zh: string; // Short Chinese title
  chinesePrompt: string;
  englishPrompt: string;
  rationale: string; // English rationale
  rationale_zh: string; // Chinese rationale
}

export interface PromptResult {
  options: DesignOption[];
}

export interface GenerationState {
  step: 'idle' | 'analyzing' | 'reviewing' | 'generating_image' | 'complete' | 'error';
  error?: string;
}

export interface GeneratedImage {
  url: string;
  promptUsed: string;
}