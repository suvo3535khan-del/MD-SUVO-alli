/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRightLeft, 
  Copy, 
  Trash2, 
  Sun, 
  Moon, 
  CheckCircle2, 
  HelpCircle,
  Github,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Mode = 'binToText' | 'textToBin';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('binToText');
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true); // Default to true for "Sophisticated Dark"
  const [copied, setCopied] = useState(false);

  // Conversion logic
  const convert = useCallback((val: string, currentMode: Mode) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (currentMode === 'binToText') {
        const cleanBin = val.replace(/\s/g, '');
        if (!/^[01]+$/.test(cleanBin)) {
          throw new Error('Invalid binary format. Use 0s and 1s only.');
        }

        let parts: string[];
        if (val.includes(' ')) {
          parts = val.split(/\s+/).filter(p => p.length > 0);
        } else {
          parts = cleanBin.match(/.{1,8}/g) || [];
        }

        const result = parts.map(bin => {
          const charCode = parseInt(bin, 2);
          return String.fromCharCode(charCode);
        }).join('');
        
        setOutput(result);
        setError(null);
      } else {
        const result = val.split('').map(char => {
          return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
        
        setOutput(result);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setOutput('');
    }
  }, []);

  useEffect(() => {
    convert(input, mode);
  }, [input, mode, convert]);

  const handleToggleMode = () => {
    setMode(prev => prev === 'binToText' ? 'textToBin' : 'binToText');
    setInput(output);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Theme constants based on "Sophisticated Dark"
  const bgColor = darkMode ? 'bg-[#0f172a]' : 'bg-slate-50';
  const textColor = darkMode ? 'text-[#f8fafc]' : 'text-slate-900';
  const cardBg = darkMode ? 'bg-[#1e293b]/80 border-white/10 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl';
  const inputBg = darkMode ? 'bg-[#0f172a]/60 border-white/10' : 'bg-slate-50 border-slate-200';
  const labelColor = darkMode ? 'text-[#64748b]' : 'text-slate-500';
  const buttonPrimary = 'bg-[#38bdf8] text-[#0f172a] hover:bg-[#7dd3fc] active:scale-95 transition-all';
  const buttonSecondary = darkMode ? 'bg-white/5 border-white/10 text-[#f1f5f9] hover:bg-white/10 transition-all' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-all';

  return (
    <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center p-4 md:p-8 font-sans ${bgColor} ${textColor}`}>
      {/* Immersive background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`} />
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100'}`} />
      </div>

      <main className="relative z-10 w-full max-w-[850px]">
        {/* App Container */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className={`rounded-[24px] border p-6 md:p-10 shadow-2xl ${cardBg}`}
        >
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="title-group">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                Binary to Text Converter
              </h1>
              <p className={`text-sm mt-1.5 font-medium ${labelColor}`}>
                Professional utility for encoding and decoding binary data.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleMode}
                className={`px-5 py-2.5 rounded-full text-[12px] font-bold transition-all border flex items-center gap-2 ${
                  darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <ArrowRightLeft size={14} className="text-[#38bdf8]" />
                {mode === 'binToText' ? 'Binary → Text' : 'Text → Binary'}
              </button>
              
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-full border transition-all ${
                  darkMode ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>

          {/* Grid Layout for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 grid-layout">
            {/* Input Box */}
            <div className="flex flex-col gap-2.5 io-box">
               <label className={`text-[11px] uppercase tracking-[0.1em] font-bold io-label ${labelColor} flex justify-between items-center px-1`}>
                 {mode === 'binToText' ? 'Binary Input' : 'Text Input'}
                 {input && (
                   <button onClick={handleClear} className="hover:text-red-400 transition-colors flex items-center gap-1 normal-case tracking-normal">
                     <Trash2 size={12} /> Clear
                   </button>
                 )}
               </label>
               <textarea
                 id="inputArea"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 spellCheck={false}
                 placeholder={mode === 'binToText' ? '01001000 01101001 00100001' : 'Type or paste text here...'}
                 className={`w-full h-[220px] md:h-[260px] p-5 rounded-xl resize-none outline-none border transition-all text-sm font-mono leading-relaxed ${inputBg} focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/10`}
               />
            </div>

            {/* Output Box */}
            <div className="flex flex-col gap-2.5 io-box">
               <label className={`text-[11px] uppercase tracking-[0.1em] font-bold io-label ${labelColor} flex justify-between items-center px-1`}>
                 {mode === 'binToText' ? 'Text Output' : 'Binary Output'}
                 {output && (
                  <button 
                    onClick={handleCopy} 
                    className={`flex items-center gap-1.5 transition-all text-[11px] uppercase ${copied ? 'text-green-500' : 'text-[#38bdf8] hover:text-sky-300'}`}
                  >
                    {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy Result'}
                  </button>
                 )}
               </label>
               <div className="relative group">
                 <textarea
                   id="outputArea"
                   readOnly
                   value={output}
                   placeholder="Output will appear here..."
                   className={`w-full h-[220px] md:h-[260px] p-5 rounded-xl border transition-all text-sm font-mono leading-relaxed resize-none outline-none ${
                     darkMode ? 'bg-[#0f172a]/40 border-white/5 text-[#94a3b8]' : 'bg-slate-100 border-slate-100 text-slate-500'
                   }`}
                 />
                 {output && (
                   <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                     <Zap size={16} className="text-[#38bdf8]/30" />
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-8 border-t border-white/5 action-bar">
            <div className="status-bar flex items-center gap-3">
              <div className={`dot w-2 h-2 rounded-full ${error ? 'bg-red-500 animate-pulse' : 'bg-[#22c55e]'}`} />
              <div className="flex flex-col">
                <span className={`text-[12px] font-medium leading-none ${error ? 'text-red-400' : darkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                  {error || (output ? 'Conversion successful' : 'Ready to convert')}
                </span>
              </div>
            </div>

            <div className="main-actions flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleClear}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs btn-secondary ${buttonSecondary}`}
              >
                Clear
              </button>
              <button
                onClick={handleCopy}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs btn-secondary ${buttonSecondary}`}
              >
                Copy Output
              </button>
              <button
                disabled={!output}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-xs shadow-lg btn-primary ${buttonPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Convert Now
              </button>
            </div>
          </div>
        </motion.div>

        {/* Minimal Footer */}
        <footer className="mt-8 flex flex-col md:flex-row justify-between items-center px-4 gap-4">
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-[#64748b]">
            <a href="#" className="hover:text-[#38bdf8] transition-colors">Documentation</a>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <a href="#" className="hover:text-[#38bdf8] transition-colors">Privacy</a>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
              <Github size={14} className="text-slate-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">v1.2.0</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Helper Context (Conditional) */}
      <AnimatePresence>
        {!input && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-8 right-8 max-w-[220px] p-5 rounded-2xl border hidden lg:block ${
              darkMode ? 'bg-[#1e293b]/60 border-white/5 text-slate-400 backdrop-blur-md shadow-xl' : 'bg-white border-slate-200 text-slate-400 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-2 mb-2.5 text-[#38bdf8]">
              <HelpCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Usage Tip</span>
            </div>
            <p className="text-[10.5px] leading-relaxed">
              {mode === 'binToText' 
                ? 'Binary input can be continuous or separated by spaces/lines. Every 8 bits will be converted to its ASCII character.' 
                : 'Each text character will be converted to an 8-bit binary string (e.g. A → 01000001).'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
