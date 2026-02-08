import React from 'react';
import { AspectRatio, Language } from '../types';
import { translations } from '../locales';

interface RatioSelectorProps {
  selectedRatio: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  disabled?: boolean;
  lang: Language;
}

const RatioSelector: React.FC<RatioSelectorProps> = ({ selectedRatio, onSelect, disabled, lang }) => {
  const t = translations[lang];
  const ratios: AspectRatio[] = ['2:3', '3:4', '1:1'];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
        {t.form.ratioLabel}
      </label>
      <div className="flex flex-wrap gap-2">
        {ratios.map((ratio) => (
          <button
            key={ratio}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(ratio)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium border transition-all
              ${selectedRatio === ratio 
                ? 'bg-brand-600 text-white border-brand-600 shadow-md' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-brand-400 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {t.ratios[ratio]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatioSelector;