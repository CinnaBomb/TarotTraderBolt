import React, { useState } from 'react';
import { X, Wand } from 'lucide-react';
import { useCardCreation } from '../contexts/CardCreationContext';

const CardCreationModal: React.FC = () => {
  const { isCreatingCard, setIsCreatingCard, createCard, isLoading } = useCardCreation();
  const [prompt, setPrompt] = useState('');

  if (!isCreatingCard) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    await createCard(prompt);
    setPrompt('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl w-full max-w-lg">
        <div className="border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-yellow-400">Create Your Card</h2>
              <p className="text-gray-400 text-sm">Describe the card you want to create</p>
            </div>
            <button 
              onClick={() => setIsCreatingCard(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
              Card Description
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your card's theme, meaning, and symbolism..."
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
              isLoading || !prompt.trim()
                ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            <Wand className="w-5 h-5" />
            {isLoading ? 'Creating...' : 'Create Card'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardCreationModal;