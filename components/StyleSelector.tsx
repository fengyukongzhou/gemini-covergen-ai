import React from 'react';
import { CoverStyle, Language } from '../types';
import { translations } from '../locales';

interface StyleSelectorProps {
  selectedStyle: CoverStyle;
  onSelect: (style: CoverStyle) => void;
  disabled?: boolean;
  lang: Language;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect, disabled, lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
        {t.form.styleLabel}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(CoverStyle).map((style) => {
          const styleInfo = t.styles[style];
          return (
            <button
              key={style}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(style)}
              className={`
                relative p-4 rounded-xl text-left border-2 transition-all duration-200 group flex flex-col gap-1
                ${
                  selectedStyle === style
                    ? 'border-brand-600 bg-brand-50 shadow-md ring-1 ring-brand-200'
                    : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className={`block font-bold text-sm ${selectedStyle === style ? 'text-brand-900' : 'text-gray-900'}`}>
                {styleInfo.label}
              </span>
              <span className="text-xs text-gray-500 leading-snug">
                {styleInfo.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;