"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageUpscaler() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [creativity, setCreativity] = useState(0.4);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/upscale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          prompt,
          creativity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upscale image");
      }

      setResult(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-white">Image Upscaler</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Upload Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="max-h-48 object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-4 text-white/60" />
                      <p className="mb-2 text-sm text-white/60">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-white/40">
                        PNG, JPG or WEBP (MAX. 800x800px)
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Enhancement Prompt (Optional)
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., enhance details, 4k, high quality"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Creativity Level: {creativity}
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={creativity}
              onChange={(e) => setCreativity(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={!image || loading}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-medium text-white transition-colors",
              !image || loading
                ? "bg-white/10 cursor-not-allowed"
                : "bg-white/20 hover:bg-white/30"
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </div>
            ) : (
              "Upscale Image"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            <h3 className="text-lg font-medium text-white">Result</h3>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={result}
                alt="Upscaled result"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 