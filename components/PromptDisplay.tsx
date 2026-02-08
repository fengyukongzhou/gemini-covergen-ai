import React from 'react';
import { PromptResult, Language } from '../types';
import { translations } from '../locales';

interface PromptDisplayProps {
  result: PromptResult;
  lang: Language;
  selectedOptionIndex: number | 'custom';
  onSelectOption: (index: number | 'custom') => void;
  customPrompt: string;
  onCustomPromptChange: (val: string) => void;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ 
  result, 
  lang, 
  selectedOptionIndex, 
  onSelectOption,
  customPrompt,
  onCustomPromptChange
}) => {
  const t = translations[lang];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div className="bg-brand-50 px-6 py-4 border-b border-brand-100 flex items-center justify-between">
        <h3 className="font-serif text-lg text-brand-900 font-semibold">
          {t.promptDisplay.blueprintTitle}
        </h3>
        <span className="text-xs font-mono text-brand-600 bg-brand-100 px-2 py-1 rounded">
          {t.promptDisplay.modelTag}
        </span>
      </div>
      
      <div className="p-6">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
          {t.promptDisplay.chooseOption}
        </h4>
        
        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {result.options.map((option, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectOption(idx)}
              className={`
                cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative
                ${selectedOptionIndex === idx 
                  ? 'border-brand-600 bg-brand-50/50 shadow-md' 
                  : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${selectedOptionIndex === idx ? 'text-brand-600' : 'text-gray-500'}`}>
                  {t.promptDisplay.optionLabel} 0{idx + 1}
                </span>
                {selectedOptionIndex === idx && (
                  <span className="h-4 w-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">✓</span>
                )}
              </div>
              
              <h5 className="font-serif text-lg font-semibold text-gray-900 mb-1">
                {lang === 'zh' ? option.title_zh : option.title}
              </h5>
              
              <p className="text-sm text-gray-600 italic mb-3">
                "{lang === 'zh' ? option.rationale_zh : option.rationale}"
              </p>

              {/* Show full prompt only if selected */}
              {selectedOptionIndex === idx && (
                <div className="mt-3 pt-3 border-t border-brand-200 animate-fade-in">
                  <h6 className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t.promptDisplay.engPromptTitle}</h6>
                  <p className="text-xs font-mono text-gray-700 bg-white/50 p-2 rounded border border-brand-100">
                    {option.englishPrompt}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Custom Option */}
          <div 
            onClick={() => onSelectOption('custom')}
            className={`
              cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative
              ${selectedOptionIndex === 'custom'
                ? 'border-brand-600 bg-brand-50/50 shadow-md' 
                : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
              }
            `}
          >
             <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${selectedOptionIndex === 'custom' ? 'text-brand-600' : 'text-gray-500'}`}>
                  {t.promptDisplay.customLabel}
                </span>
                {selectedOptionIndex === 'custom' && (
                  <span className="h-4 w-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">✓</span>
                )}
              </div>

              {selectedOptionIndex === 'custom' ? (
                <textarea
                  value={customPrompt}
                  onChange={(e) => onCustomPromptChange(e.target.value)}
                  placeholder={t.promptDisplay.customPlaceholder}
                  className="w-full mt-2 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white font-mono h-32"
                  onClick={(e) => e.stopPropagation()} // Prevent card click logic from interfering with typing
                />
              ) : (
                 <p className="text-sm text-gray-500 italic">
                   {t.promptDisplay.customPlaceholder}
                 </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDisplay;