import React, { useState, useEffect } from 'react';
import { CoverStyle, BookDetails, PromptResult, GenerationState, Language } from './types';
import StyleSelector from './components/StyleSelector';
import RatioSelector from './components/RatioSelector';
import PromptDisplay from './components/PromptDisplay';
import CoverResult from './components/CoverResult';
import { generateCoverPrompt, generateCoverImage } from './services/geminiService';
import { translations } from './locales';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [details, setDetails] = useState<BookDetails>({
    title: '',
    author: '',
    style: CoverStyle.CINEMATIC_REALISM,
    aspectRatio: '2:3'
  });

  const [promptResult, setPromptResult] = useState<PromptResult | null>(null);
  
  // New State for selection
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | 'custom'>(0);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationState>({ step: 'idle' });

  const t = translations[lang];

  // Logic to determine if Step 3 (Visual Studio) should be shown
  const showResult = status.step === 'generating_image' || status.step === 'complete' || !!generatedImage;

  // STEP 1: Analyze Book
  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!details.title || !details.author) return;

    setPromptResult(null);
    setGeneratedImage(null);
    setStatus({ step: 'analyzing' });
    setSelectedOptionIndex(0); // Reset selection to first option by default
    setCustomPrompt('');

    try {
      const promptData = await generateCoverPrompt(details);
      setPromptResult(promptData);
      setStatus({ step: 'reviewing' }); 
    } catch (error: any) {
      console.error(error);
      setStatus({ 
        step: 'error', 
        error: error.message || t.form.defaultError
      });
    }
  };

  // STEP 2: Generate Image
  const handleGenerateImage = async () => {
    const finalPrompt = getActivePrompt();
    if (!finalPrompt) {
       alert("Please select an option or enter a custom prompt.");
       return;
    }
    
    setStatus({ step: 'generating_image' });
    try {
      const imageUrl = await generateCoverImage(finalPrompt, details.aspectRatio);
      setGeneratedImage(imageUrl);
      setStatus({ step: 'complete' });
      
      // Auto-scroll to result on mobile/desktop
      setTimeout(() => {
        const resultElement = document.getElementById('step-3-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error: any) {
      console.error(error);
      setStatus({ 
        step: 'error', 
        error: error.message || t.form.defaultError
      });
    }
  };

  const handleReset = () => {
     setPromptResult(null);
     setGeneratedImage(null);
     setStatus({ step: 'idle' });
     setDetails({ ...details, title: '', author: '' });
     setSelectedOptionIndex(0);
     setCustomPrompt('');
     
     // Scroll back to top
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActivePrompt = (): string => {
      if (selectedOptionIndex === 'custom') {
          return customPrompt;
      }
      if (promptResult && typeof selectedOptionIndex === 'number') {
          return promptResult.options[selectedOptionIndex].englishPrompt;
      }
      return '';
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const isAnalyzing = status.step === 'analyzing';
  const isGenerating = status.step === 'generating_image';
  const isReviewing = status.step === 'reviewing';
  const isComplete = status.step === 'complete';
  const isError = status.step === 'error';

  // Validation for "Generate" button visibility/disabled state
  const canGenerate = (isReviewing || isGenerating || isComplete) && (
    (selectedOptionIndex !== 'custom') || 
    (selectedOptionIndex === 'custom' && customPrompt.trim().length > 0)
  );

  return (
    <div className="min-h-screen bg-brand-50/30 text-gray-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-brand-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg cursor-pointer" onClick={handleReset}>
              C
            </div>
            <h1 className="font-serif text-xl font-bold text-gray-900 tracking-tight">
              {t.header.title} <span className="text-brand-600">{t.header.subtitle}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-gray-400 hidden sm:block">
              {t.header.poweredBy}
            </div>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-medium text-brand-600 border border-brand-200 rounded-full hover:bg-brand-50 transition-colors"
            >
              {t.header.switchLang}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 transition-all duration-500 ease-in-out">
        {/* Dynamic Grid Layout: 
            If no result, center the form (max-w-2xl).
            If result exists, split into columns (lg:grid-cols-12).
        */}
        <div className={`grid grid-cols-1 gap-10 transition-all duration-700 ease-in-out ${showResult ? 'lg:grid-cols-12' : 'max-w-2xl mx-auto'}`}>
          
          {/* Left Column: Controls & Prompt */}
          <div className={`space-y-8 transition-all duration-700 ease-in-out ${showResult ? 'lg:col-span-5' : 'w-full'}`}>
            
            {/* 1. Input Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative animate-fade-in-up">
              <h2 className="font-serif text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
                <span className="bg-brand-100 text-brand-800 text-sm font-sans font-bold px-2 py-0.5 rounded-full">1</span>
                {t.form.sectionTitle}
              </h2>
              
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {t.form.bookTitleLabel}
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder={t.form.bookTitlePlaceholder}
                    value={details.title}
                    onChange={(e) => setDetails({ ...details, title: e.target.value })}
                    disabled={isAnalyzing} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="author" className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {t.form.authorNameLabel}
                  </label>
                  <input
                    id="author"
                    type="text"
                    required
                    placeholder={t.form.authorNamePlaceholder}
                    value={details.author}
                    onChange={(e) => setDetails({ ...details, author: e.target.value })}
                    disabled={isAnalyzing}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                <RatioSelector
                   selectedRatio={details.aspectRatio}
                   onSelect={(ratio) => setDetails({...details, aspectRatio: ratio})}
                   disabled={isAnalyzing}
                   lang={lang}
                />

                <StyleSelector 
                  selectedStyle={details.style} 
                  onSelect={(style) => setDetails({ ...details, style })}
                  disabled={isAnalyzing}
                  lang={lang}
                />

                {/* Primary Action 1: Analyze */}
                <button
                  type="submit"
                  disabled={isAnalyzing || !details.title || !details.author}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg shadow-sm border transition-all transform flex items-center justify-center gap-3
                    ${isAnalyzing
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait' 
                      : 'bg-white text-brand-700 border-brand-200 hover:border-brand-500 hover:shadow-md hover:bg-brand-50 active:scale-[0.98]'
                    }
                  `}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.form.analyzing}
                    </>
                  ) : (
                    <>
                      <span>{promptResult ? "Re-Analyze Book" : t.form.analyzeBtn}</span>
                    </>
                  )}
                </button>
              </form>

              {isError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm animate-fade-in">
                  <strong>{t.form.errorPrefix}</strong> {status.error}
                </div>
              )}
            </section>
            
            {/* 2. Prompt Selection & Generation Section */}
            {promptResult && (
               <div className="animate-fade-in-up space-y-6" style={{ animationDelay: '100ms' }}>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-600 text-white text-sm font-sans font-bold px-2 py-0.5 rounded-full">2</span>
                    <h3 className="font-serif text-xl font-semibold text-gray-900">{t.promptDisplay.chooseOption}</h3>
                 </div>

                 <PromptDisplay 
                   result={promptResult} 
                   lang={lang}
                   selectedOptionIndex={selectedOptionIndex}
                   onSelectOption={setSelectedOptionIndex}
                   customPrompt={customPrompt}
                   onCustomPromptChange={setCustomPrompt}
                 />

                 {/* Primary Action 2: Generate */}
                 <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !canGenerate}
                    className={`
                      w-full py-5 rounded-xl font-bold text-xl shadow-lg transition-all transform flex items-center justify-center gap-3 sticky bottom-6 z-10
                      ${isGenerating || !canGenerate
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-brand-600 to-brand-800 text-white hover:shadow-xl hover:-translate-y-1 active:translate-y-0 ring-4 ring-white'
                      }
                    `}
                  >
                     {isGenerating ? (
                       <>
                         <svg className="animate-spin h-6 w-6 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         {t.form.painting}
                       </>
                     ) : (
                       <>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                         </svg>
                         {t.form.generateArtBtn}
                       </>
                     )}
                  </button>
               </div>
            )}
          </div>

          {/* Right Column: Visual Result - Step 3 - ONLY SHOWN AFTER GENERATE */}
          {showResult && (
            <div id="step-3-result" className="lg:col-span-7 flex flex-col h-full min-h-[500px] animate-fade-in-up">
               <div className="sticky top-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex-1 flex flex-col transition-all duration-500">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="font-serif text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <span className="bg-brand-100 text-brand-800 text-sm font-sans font-bold px-2 py-0.5 rounded-full">3</span>
                        {t.result.title}
                     </h2>
                     {generatedImage && (
                       <div className="flex gap-2">
                         <button onClick={handleReset} className="text-xs font-semibold text-gray-500 underline hover:text-brand-600">
                           {t.form.resetBtn}
                         </button>
                         <span className="text-xs font-mono text-brand-600 bg-brand-100 px-2 py-1 rounded animate-fade-in">
                           {t.result.modelTag}
                         </span>
                       </div>
                     )}
                  </div>
                  
                  <div className={`flex-1 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden transition-all ${isGenerating ? 'ring-2 ring-brand-200 ring-offset-2' : ''}`}>
                     <CoverResult imageUrl={generatedImage || ''} isLoading={isGenerating || isAnalyzing} lang={lang} aspectRatio={details.aspectRatio} />
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;