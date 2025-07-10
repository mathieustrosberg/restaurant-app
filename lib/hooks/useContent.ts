"use client"

import { useState, useEffect } from 'react'
import { PageContent } from '@/lib/content'
import { useNotifications } from './useNotifications'

export function useContent() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { success, error: notifyError, apiError } = useNotifications()

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/content')
      
      if (response.ok) {
        const data = await response.json()
        setContent(data)
        console.log('✅ Contenu chargé avec succès')
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Erreur ${response.status}`
        
        setError(errorMessage)
        apiError(
          'Erreur de chargement', 
          errorMessage,
          fetchContent // Retry function
        )
        console.error('❌ Erreur lors du chargement:', response.status, errorMessage)
      }
    } catch (err) {
      const errorMessage = 'Erreur de connexion au serveur'
      setError(errorMessage)
      apiError(
        'Connexion impossible',
        'Vérifiez votre connexion internet',
        fetchContent
      )
      console.error('❌ Erreur de connexion:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (newContent: Omit<PageContent, '_id' | 'updatedAt'>) => {
    try {
      console.log('📤 Envoi de la mise à jour...')
      
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContent)
      })
      
      if (response.ok) {
        const responseData = await response.json()
        await fetchContent() // Recharger le contenu
        
        success('Sauvegarde réussie', 'Vos modifications ont été enregistrées')
        console.log('✅ Mise à jour réussie:', responseData.message)
        return true
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Erreur ${response.status}`
        
        // Afficher les détails de validation si disponibles
        if (errorData.details && Array.isArray(errorData.details)) {
          const validationErrors = errorData.details
            .map((err: any) => `${err.field}: ${err.message}`)
            .join('\n')
          
          notifyError(
            'Données invalides',
            validationErrors,
            10000
          )
        } else {
          notifyError(
            'Erreur de sauvegarde',
            errorMessage,
            8000
          )
        }
        
        setError(errorMessage)
        console.error('❌ Erreur de mise à jour:', response.status, errorMessage)
        return false
      }
    } catch (err) {
      const errorMessage = 'Erreur de connexion lors de la sauvegarde'
      setError(errorMessage)
      notifyError(
        'Connexion impossible',
        'Impossible d\'enregistrer les modifications',
        8000
      )
      console.error('❌ Erreur de connexion lors de la mise à jour:', err)
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
    refresh: fetchContent,
    // Exposer les notifications pour le layout
    notifications: { success, error: notifyError, apiError }
  }
} 