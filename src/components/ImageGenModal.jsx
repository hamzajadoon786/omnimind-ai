import React, { useState } from 'react';
import { Sparkles, LoaderCircle, Download, X } from 'lucide-react';

export default function ImageGenModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed. Try a different prompt.');
      }

      const data = await response.json();
      setImage(data.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `omnimind_gen_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-semibold text-slate-100">OmniMind Image Generator</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition text-slate-100 placeholder-slate-600"
              disabled={isLoading}
            />
            <button
              onClick={generateImage}
              disabled={isLoading || !prompt.trim()}
              className="bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium text-sm transition flex items-center gap-2"
            >
              {isLoading ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Image Display Area */}
          <div className="aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center overflow-hidden relative group">
            {isLoading && (
              <div className="text-center text-slate-600">
                <LoaderCircle className="w-10 h-10 animate-spin mx-auto mb-2 text-teal-500" />
                <span>Thinking... this takes a minute...</span>
              </div>
            )}
            
            {error && (
              <div className="text-center text-red-400 p-4 bg-red-950/20 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {image && !isLoading && (
              <>
                <img src={image} alt="Generated" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    onClick={downloadImage}
                    className="p-3 bg-slate-800/80 rounded-full text-white hover:bg-slate-700 transition"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </>
            )}

            {!isLoading && !image && !error && (
              <div className="text-center text-slate-600 px-10">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Your generated masterpiece will appear here.</p>
                <p className="text-xs mt-1">Images are not stored, please download if you like them.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
    }
