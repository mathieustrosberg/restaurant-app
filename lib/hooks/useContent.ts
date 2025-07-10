"use client"

import { useState, useEffect } from 'react'
import { PageContent } from '@/lib/content'

export function useContent() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
        setError(null)
      } else {
        setError('Erreur lors du chargement du contenu')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (newContent: Omit<PageContent, '_id' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContent)
      })
      
      if (response.ok) {
        await fetchContent() // Recharger le contenu
        return true
      } else {
        setError('Erreur lors de la mise à jour')
        return false
      }
    } catch (err) {
      setError('Erreur de connexion')
      return false
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return {
    content,
    loading,
    error,
    updateContent,
    refresh: fetchContent
  }
} 