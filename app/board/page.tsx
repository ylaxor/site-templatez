'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/LoginForm'
import { ContentEditor } from '@/components/ContentEditor'
import { isUserAuthenticated } from '@/lib/firebase'

export default function BoardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const authenticated = await isUserAuthenticated()
    setIsAuthenticated(authenticated)
    setLoading(false)
  }

  function handleLoginSuccess() {
    setIsAuthenticated(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Content Management Board</h1>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>

          {!isAuthenticated ? (
            <div className="max-w-md mx-auto">
              <LoginForm onSuccess={handleLoginSuccess} />
            </div>
          ) : (
            <ContentEditor />
          )}
        </div>
      </div>
    </main>
  )
}
