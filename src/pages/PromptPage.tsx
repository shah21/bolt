import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Add cookie utility functions
const setCookie = (name: string, value: string, days = 7, path = '/') => {
  const domain = window.location.hostname;
  // Support subdomains by using the main domain
  const cookieDomain = domain === 'localhost' ? domain : '.' + domain.split('.').slice(-2).join('.');
  
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; domain=${cookieDomain}`;
};

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  widgets: string[];
  sources: Array<{ name: string; id: string; }>;
}

function PromptPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const navigate = useNavigate();

  const examplePrompts = [
    "Create a landing page for a coffee shop",
    "Design a todo list application",
    "Build a weather dashboard",
    "Make a portfolio website"
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const response = await fetch('http://localhost:3000/api/library_apps', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch templates');
        
        const data = await response.json();
        setTemplates(data.template_app_manifests);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    const setAICookies = async () => {
      try {
        await fetch('http://localhost:3000/api/ai/onboarding/set-ai-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            tj_ai_prompt: 'create an expense tracker app',
            tj_template_id: 'expense-tracker-template'
          })
        });
      } catch (error) {
        console.error('Error setting AI cookies:', error);
      }
    };

    // setAICookies();
  }, []); // Run once when component mounts

  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/session', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        window.location.href = 'http://localhost:8082';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setCookie('tj_ai_prompt', prompt);
    
    const hasSession = await checkSession();
    if (!hasSession) {
      navigate('/signup');
    }
    
    setIsLoading(false);
    setPrompt('');
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleTemplateClick = async (templateId: string) => {
    setIsLoading(true);
    setCookie('tj_template_id', templateId);
    
    const hasSession = await checkSession();
    if (!hasSession) {
      navigate('/signup');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400" />
            AI Prompt Assistant
          </h1>
          <p className="text-gray-300">Transform your ideas into reality with AI-powered assistance</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={`absolute right-3 bottom-3 px-4 py-2 rounded-md flex items-center gap-2 ${
                prompt.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-700 cursor-not-allowed'
              } transition-colors`}
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  Submit <Send size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={20} />
              Example Prompts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Layout className="text-blue-400" size={20} />
              Templates
            </h2>
            {isLoadingTemplates ? (
              <div className="text-center text-gray-400">Loading templates...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template.id)}
                    className="text-left p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                    disabled={isLoading}
                  >
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.widgets.map((widget, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300"
                        >
                          {widget}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptPage;
