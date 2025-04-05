import { Metadata } from 'next'
import InstagramAnalyzer from '@/components/InstagramAnalyzer'

export const metadata: Metadata = {
  title: 'Instagram Content Analyzer',
  description: 'Analyze and get recommendations for your Instagram content strategy',
}

export default function InstagramAnalyzerPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Instagram Content Analyzer</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <InstagramAnalyzer />
        </div>
      </div>
    </main>
  )
} 