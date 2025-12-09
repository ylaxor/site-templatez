'use client'

import { useState, useEffect } from 'react'
import { getPageContent, updatePageContent } from '@/lib/firebase'

export function ContentEditor() {
  const [pages, setPages] = useState<any>({
    home: { title: '', content: '' },
    board: { title: '', content: '' },
  })
  const [activeTab, setActiveTab] = useState('home')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAllContent()
  }, [])

  async function loadAllContent() {
    const homeContent = await getPageContent('home')
    const boardContent = await getPageContent('board')
    setPages({ home: homeContent, board: boardContent })
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')
    try {
      await updatePageContent(activeTab, pages[activeTab])
      setMessage('Content saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error saving content')
    } finally {
      setSaving(false)
    }
  }

  function updateField(field: string, value: string) {
    setPages({
      ...pages,
      [activeTab]: {
        ...pages[activeTab],
        [field]: value,
      },
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex space-x-4 mb-6 border-b">
        {['home', 'board'].map((page) => (
          <button
            key={page}
            onClick={() => setActiveTab(page)}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === page
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)} Page
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={pages[activeTab]?.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Content
          </label>
          <textarea
            value={pages[activeTab]?.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && (
            <span className="text-green-600 font-medium">{message}</span>
          )}
        </div>
      </div>
    </div>
  )
}
