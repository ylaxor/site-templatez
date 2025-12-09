'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPageContent } from '@/lib/firebase'

export default function Home() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getPageContent('home')
        setContent(data)
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content?.title || 'Welcome to Your Site'}
            </h1>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p>{content?.content || 'Loading content...'}</p>
            </div>
            <Link 
              href="/board"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Manage Content →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
