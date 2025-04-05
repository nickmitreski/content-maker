'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export function CharacterGenerator() {
  const [subject, setSubject] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [numberOfOutputs, setNumberOfOutputs] = useState<number>(3)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large. Please upload an image under 5MB.')
      return
    }

    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    setSubject(imageUrl) // Use the local URL as the subject
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults([])

    try {
      // If we have an uploaded image, we need to convert it to base64
      let finalSubject = subject
      if (uploadedImage && uploadedImage.startsWith('blob:')) {
        // Convert the blob URL to base64
        const response = await fetch(uploadedImage)
        const blob = await response.blob()
        const reader = new FileReader()
        
        finalSubject = await new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(blob)
        })
      }

      const response = await fetch('/api/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: finalSubject,
          prompt,
          numberOfOutputs,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate characters')
      }

      if (!data.output || !Array.isArray(data.output)) {
        throw new Error('Invalid response format')
      }

      setResults(data.output)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate characters. Please try again.'
      setError(errorMessage)
      console.error('Character generation error:', err)
      
      // Check for specific error types
      if (errorMessage.includes('API configuration error') || errorMessage.includes('authentication')) {
        setError('API configuration error. Please check your Replicate API token in the .env.local file.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-white">Character Generator</h2>
        <p className="text-white/60 mb-6">
          Generate consistent character images based on a reference photo and description.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-white/60 mb-2">
              Reference Image
            </label>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter URL of a reference image"
                  className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-white/40"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-colors"
                >
                  Upload
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              {uploadedImage && (
                <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded reference"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-white/60 mb-2">
              Character Description
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the character you want to generate (e.g., 'A closeup headshot photo of a young woman in a grey sweater')"
              className="w-full h-32 p-4 rounded-xl bg-black/50 border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-white placeholder-white/40"
              required
            />
          </div>
          
          <div>
            <label htmlFor="numberOfOutputs" className="block text-sm font-medium text-white/60 mb-2">
              Number of Outputs
            </label>
            <select
              id="numberOfOutputs"
              value={numberOfOutputs}
              onChange={(e) => setNumberOfOutputs(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'image' : 'images'}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading || !subject.trim() || !prompt.trim()}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              loading || !subject.trim() || !prompt.trim()
                ? 'bg-white/[0.05] cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <span>Generate Characters</span>
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
            {error.includes('API configuration error') && (
              <p className="mt-2 text-sm">
                Make sure you have set the REPLICATE_API_TOKEN in your .env.local file.
              </p>
            )}
          </div>
        )}
        
        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-white/90">Generated Characters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((url, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.08]">
                  <div className="relative w-full h-full">
                    <Image
                      src={url}
                      alt={`Generated character ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 