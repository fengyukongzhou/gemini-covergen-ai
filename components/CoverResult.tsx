import React, { useState } from 'react';
import { AspectRatio, Language } from '../types';
import { translations } from '../locales';

interface CoverResultProps {
  imageUrl: string;
  isLoading: boolean;
  lang: Language;
  aspectRatio: AspectRatio;
}

const CoverResult: React.FC<CoverResultProps> = ({ imageUrl, isLoading, lang, aspectRatio }) => {
  const t = translations[lang];
  const [isProcessingDownload, setIsProcessingDownload] = useState(false);

  // Map AspectRatio to Tailwind aspect classes for Display
  const getAspectClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case '2:3': return 'aspect-[2/3]';
      case '3:4': return 'aspect-[3/4]';
      case '1:1': return 'aspect-square';
      default: return 'aspect-[2/3]';
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!imageUrl || isProcessingDownload) return;

    // For non-2:3 ratios, download directly
    if (aspectRatio !== '2:3') {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `cover-${aspectRatio}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For 2:3 ratio, we must crop the 3:4 image
    setIsProcessingDownload(true);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Enable CORS if needed (though base64 usually doesn't need it)
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      
      // Logic: Source is 3:4 (e.g., 768x1024). Target is 2:3.
      // Target Width = Height * (2/3). 
      // Example: 1024 * 0.666 = ~682.
      // Offset X = (768 - 682) / 2 = 43.
      
      const targetWidth = img.height * (2/3);
      const targetHeight = img.height;
      const xOffset = (img.width - targetWidth) / 2;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(
          img,
          xOffset, 0, targetWidth, targetHeight, // Source Rect (Center Crop)
          0, 0, targetWidth, targetHeight        // Dest Rect
        );
        
        const croppedDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = croppedDataUrl;
        link.download = `cover-2-3-cropped-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Cropping failed, downloading original", error);
      // Fallback
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `cover-original-fallback-${Date.now()}.png`;
      link.click();
    } finally {
      setIsProcessingDownload(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-8">
       {imageUrl ? (
         <div className="relative group perspective-1000">
           {/* Book Spine/Shadow Effect */}
           <div className="absolute inset-0 bg-black opacity-20 blur-xl transform translate-y-4 rounded-lg"></div>
           
           <div className="relative rounded-sm overflow-hidden shadow-2xl transition-transform transform hover:scale-[1.02] duration-500 border-r-4 border-b-4 border-white/10">
             <img 
               src={imageUrl} 
               alt="Generated Book Cover" 
               className={`w-full max-w-lg h-auto object-cover ${getAspectClass(aspectRatio)}`}
               style={{ maxHeight: '650px' }}
             />
             {/* Gloss Sheen */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none"></div>
           </div>
           
           <button 
             onClick={handleDownload}
             disabled={isProcessingDownload}
             className="absolute bottom-4 right-4 bg-white/90 text-gray-900 hover:bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 backdrop-blur-sm cursor-pointer"
           >
             {isProcessingDownload ? (
               <svg className="animate-spin h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
             )}
             {t.result.download}
           </button>
         </div>
       ) : (
         <div className="flex flex-col items-center justify-center text-gray-400 p-12 border-2 border-dashed border-gray-200 rounded-xl w-full h-full bg-gray-50/50">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
           <p className="font-serif italic text-lg">{t.result.emptyState}</p>
           {isLoading && <p className="text-sm mt-2 text-brand-600 animate-pulse">{t.result.loadingState}</p>}
         </div>
       )}
    </div>
  );
};

export default CoverResult;