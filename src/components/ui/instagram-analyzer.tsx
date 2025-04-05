'use client'

import { useState } from 'react'

interface AnalysisResult {
  bestPostingTimes: string[]
  recommendedHashtags: string[]
  contentSuggestions: string[]
  engagementTips: string[]
}

export function InstagramAnalyzer() {
  const [username, setUsername] = useState('')
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulated analysis - we'll replace this with real logic later
    const mockResults: AnalysisResult = {
      bestPostingTimes: [
        '9:00 AM - 11:00 AM',
        '3:00 PM - 5:00 PM',
        '7:00 PM - 9:00 PM'
      ],
      recommendedHashtags: [
        '#contentcreator',
        '#socialmedia',
        '#digitalmarketing',
        '#instagramstrategy'
      ],
      contentSuggestions: [
        'Share behind-the-scenes content',
        'Post user-generated content',
        'Create educational carousel posts',
        'Share success stories and testimonials'
      ],
      engagementTips: [
        'Respond to comments within 2 hours',
        'Use Instagram Stories for daily engagement',
        'Host Instagram Live sessions weekly',
        'Create interactive polls and quizzes'
      ]
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setResults(mockResults)
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <form onSubmit={analyzeProfile} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white/60 mb-2">
            Instagram Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white/40"
            placeholder="Enter your Instagram username"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Profile'}
        </button>
      </form>

      {results && (
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3 text-white/90">Best Posting Times</h3>
            <ul className="list-disc list-inside space-y-2 text-white/60">
              {results.bestPostingTimes.map((time, index) => (
                <li key={index}>{time}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-white/90">Recommended Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {results.recommendedHashtags.map((tag, index) => (
                <span key={index} className="bg-white/[0.03] px-3 py-1 rounded-full text-sm text-white/60 border border-white/[0.08]">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-white/90">Content Suggestions</h3>
            <ul className="list-disc list-inside space-y-2 text-white/60">
              {results.contentSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-white/90">Engagement Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-white/60">
              {results.engagementTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
} 