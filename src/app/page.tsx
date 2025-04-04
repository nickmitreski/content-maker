'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { ElegantShape } from '@/components/ui/shape-landing-hero';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentUrl, setContentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [contentType, setContentType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    // Check API connection on component mount
    const checkApiConnection = async () => {
      try {
        // Set API status to connected by default to enable the button
        setApiStatus('connected');
      } catch (err) {
        setApiStatus('error');
        console.error('API Connection Error:', err);
      }
    };

    checkApiConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setContentUrl(null);
    setGenerationProgress(`Initializing ${contentType} generation...`);

    try {
      console.log('Sending prompt:', prompt);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type: contentType }),
      });

      const data = await response.json();
      console.log('Received response:', data);

      if (!response.ok) {
        throw new Error(data.error || `Failed to generate ${contentType}`);
      }

      if (!data.output) {
        throw new Error(`No ${contentType} URL received from the API`);
      }

      setGenerationProgress(`${contentType} generated successfully!`);
      console.log('Setting content URL:', data.output);
      setContentUrl(data.output);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {!showForm ? (
        <div className="relative">
          <HeroGeometric />
          <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/20"
            >
              Start Creating Content
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

          <div className="absolute inset-0 overflow-hidden">
            <ElegantShape
              delay={0.3}
              width={600}
              height={140}
              rotate={12}
              gradient="from-indigo-500/[0.15]"
              className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
            />

            <ElegantShape
              delay={0.5}
              width={500}
              height={120}
              rotate={-15}
              gradient="from-rose-500/[0.15]"
              className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
            />

            <ElegantShape
              delay={0.4}
              width={300}
              height={80}
              rotate={-8}
              gradient="from-violet-500/[0.15]"
              className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
            />

            <ElegantShape
              delay={0.6}
              width={200}
              height={60}
              rotate={20}
              gradient="from-amber-500/[0.15]"
              className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
            />

            <ElegantShape
              delay={0.7}
              width={150}
              height={40}
              rotate={-25}
              gradient="from-cyan-500/[0.15]"
              className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
            />
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                  Nick's Content Maker
                </h1>
                <p className="text-white/60 text-lg">
                  Transform your ideas into stunning content using AI
                </p>
                <p className="text-white/40 text-sm mt-2">
                  It will run slow because I'm running on a cheap server.
                </p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="flex justify-center mb-4">
                  <div className="inline-flex rounded-lg bg-white/[0.03] p-1 border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setContentType('image')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        contentType === 'image'
                          ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Image Generation
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentType('video')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        contentType === 'video'
                          ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Video Generation
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Describe your ${contentType}... (e.g., 'a dog riding a skateboard down a hill')`}
                    className="w-full h-32 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-white placeholder-white/40 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className={`absolute right-4 bottom-4 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      loading || !prompt.trim()
                        ? 'bg-white/[0.05] cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <SparklesIcon className="w-5 h-5" />
                        <span>Generate {contentType === 'image' ? 'Image' : 'Video'}</span>
                      </div>
                    )}
                  </button>
                </div>
              </motion.form>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>{generationProgress}</span>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              {contentUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  {contentType === 'video' ? (
                    <div className="aspect-video rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                      <video
                        src={contentUrl}
                        controls
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                      <img
                        src={contentUrl}
                        alt="Generated content"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <a
                      href={contentUrl}
                      download={`generated-${contentType}.${contentType === 'video' ? 'mp4' : 'webp'}`}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 hover:bg-indigo-500/20 transition-colors backdrop-blur-sm"
                    >
                      <span>Download {contentType === 'image' ? 'Image' : 'Video'}</span>
                    </a>
                  </div>
                </motion.div>
              )}
              
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
        </div>
      )}
    </main>
  );
}
