'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { ElegantShape } from '@/components/ui/shape-landing-hero';
import Image from 'next/image';
import { ImageUpscaler } from "@/components/ui/image-upscaler";
import { CharacterGenerator } from "@/components/ui/character-generator";

export default function Home() {
  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageProgress, setImageProgress] = useState<string>('');

  // Video Generation State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<string>('');

  // Navigation State
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'upscale' | 'instagram' | 'character'>('image');

  useEffect(() => {
    // Check API connection on component mount
    const checkApiConnection = async () => {
      try {
        // API connection check is now handled automatically
        console.log('API connection check completed');
      } catch (err) {
        console.error('API Connection Error:', err);
      }
    };

    checkApiConnection();
  }, []);

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageLoading(true);
    setImageError(null);
    setImageUrl(null);
    setImageProgress('Initializing image generation...');

    try {
      console.log('Sending image prompt:', imagePrompt);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: imagePrompt, type: 'image' }),
      });

      const data = await response.json();
      console.log('Received image response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.output) {
        throw new Error('No image URL received from the API');
      }

      setImageProgress('Image generated successfully!');
      console.log('Setting image URL:', data.output);
      setImageUrl(data.output);
    } catch (err) {
      console.error('Error in handleImageSubmit:', err);
      setImageError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setImageLoading(false);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoLoading(true);
    setVideoError(null);
    setVideoUrl(null);
    setVideoProgress('Initializing video generation...');

    try {
      console.log('Sending video prompt:', videoPrompt);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: videoPrompt, type: 'video' }),
      });

      const data = await response.json();
      console.log('Received video response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      if (!data.output) {
        throw new Error('No video URL received from the API');
      }

      setVideoProgress('Video generated successfully!');
      console.log('Setting video URL:', data.output);
      setVideoUrl(data.output);
    } catch (err) {
      console.error('Error in handleVideoSubmit:', err);
      setVideoError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030303]">
      {!showForm ? (
        <div className="relative">
          <HeroGeometric />
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
            <motion.button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue to Content Creation
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
                  Nick&apos;s Content Maker
                </h1>
                <p className="text-white/60 text-lg">
                  Transform your ideas into stunning content using AI
                </p>
                <p className="text-white/40 text-sm mt-2">
                  It will run slow because I&apos;m running on a cheap server.
                </p>
              </motion.div>

              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-lg bg-white/[0.03] p-1 border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('image')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'image'
                        ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Image Generation
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'video'
                        ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Video Generation
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upscale')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'upscale'
                        ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Image Upscaling
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('instagram')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'instagram'
                        ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Instagram Analyzer
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('character')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'character'
                        ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Character Generator
                  </button>
                </div>
              </div>

              {/* Image Generation Tab */}
              {activeTab === 'image' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <h2 className="text-2xl font-bold mb-6 text-white">Image Generation</h2>
                    <form onSubmit={handleImageSubmit} className="space-y-6">
                      <div className="relative">
                        <textarea
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          placeholder="Describe the image you want to create... (e.g., 'a dog riding a skateboard down a hill')"
                          className="w-full h-32 p-4 rounded-xl bg-black/50 border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-white placeholder-white/40 backdrop-blur-sm"
                        />
                        <button
                          type="submit"
                          disabled={imageLoading || !imagePrompt.trim()}
                          className={`absolute right-4 bottom-4 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                            imageLoading || !imagePrompt.trim()
                              ? 'bg-white/[0.05] cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600'
                          }`}
                        >
                          {imageLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Generating...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <SparklesIcon className="w-5 h-5" />
                              <span>Generate Image</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </form>

                    {imageLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                          <span>{imageProgress}</span>
                        </div>
                      </motion.div>
                    )}

                    {imageError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 backdrop-blur-sm"
                      >
                        {imageError}
                      </motion.div>
                    )}

                    {imageUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                          <div className="relative w-full h-full">
                            <Image
                              src={imageUrl}
                              alt="Generated image"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <a
                            href={imageUrl}
                            download="generated-image.webp"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 hover:bg-indigo-500/20 transition-colors backdrop-blur-sm"
                          >
                            <span>Download Image</span>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Video Generation Tab */}
              {activeTab === 'video' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/[0.03] rounded-lg p-6 border border-white/[0.08] text-center"
                >
                  <h2 className="text-2xl font-bold mb-4 text-white/90">Video Generation</h2>
                  <p className="text-white/60 mb-4">This feature is currently under construction.</p>
                  <p className="text-white/40 text-sm">We're working on implementing video generation capabilities. Check back soon!</p>
                </motion.div>
              )}

              {/* Image Upscaling Tab */}
              {activeTab === 'upscale' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <h2 className="text-2xl font-bold mb-6 text-white">Image Upscaling</h2>
                    <ImageUpscaler />
                  </div>
                </motion.div>
              )}

              {/* Instagram Analyzer Tab */}
              {activeTab === 'instagram' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/[0.03] rounded-lg p-6 border border-white/[0.08] text-center"
                >
                  <h2 className="text-2xl font-bold mb-4 text-white/90">Instagram Analyzer</h2>
                  <p className="text-white/60 mb-4">This feature is currently under construction.</p>
                  <p className="text-white/40 text-sm">We're working on implementing real Instagram data analysis. Check back soon!</p>
                </motion.div>
              )}

              {/* Character Generator Tab */}
              {activeTab === 'character' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CharacterGenerator />
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
