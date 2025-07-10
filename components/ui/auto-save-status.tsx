"use client"

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error'

interface AutoSaveStatusProps {
  status: SaveStatus
  lastSaved?: Date
  errorMessage?: string
  className?: string
}

/**
 * Composant d'affichage de l'état de sauvegarde automatique
 * Affiche un indicateur visuel clair de l'état de sauvegarde
 * 
 * @param status - État actuel de la sauvegarde
 * @param lastSaved - Date de la dernière sauvegarde réussie
 * @param errorMessage - Message d'erreur si applicable
 * @param className - Classes CSS additionnelles
 */
export function AutoSaveStatus({ 
  status, 
  lastSaved, 
  errorMessage, 
  className = "" 
}: AutoSaveStatusProps) {
  const [timeAgo, setTimeAgo] = useState<string>("")

  // Mettre à jour l'affichage du temps écoulé
  useEffect(() => {
    if (!lastSaved || status !== 'saved') return

    const updateTimeAgo = () => {
      const now = new Date()
      const diffMs = now.getTime() - lastSaved.getTime()
      const diffMinutes = Math.floor(diffMs / 60000)
      const diffSeconds = Math.floor((diffMs % 60000) / 1000)

      if (diffMinutes > 0) {
        setTimeAgo(`il y a ${diffMinutes}min`)
      } else if (diffSeconds > 0) {
        setTimeAgo(`il y a ${diffSeconds}s`)
      } else {
        setTimeAgo('à l\'instant')
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 1000)

    return () => clearInterval(interval)
  }, [lastSaved, status])

  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return {
          icon: null,
          text: 'Prêt',
          variant: 'secondary' as const,
          className: 'text-gray-600'
        }
      case 'pending':
        return {
          icon: <Clock className="h-3 w-3" />,
          text: 'En attente...',
          variant: 'secondary' as const,
          className: 'text-yellow-600'
        }
      case 'saving':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: 'Sauvegarde...',
          variant: 'secondary' as const,
          className: 'text-blue-600'
        }
      case 'saved':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: `Sauvegardé ${timeAgo}`,
          variant: 'default' as const,
          className: 'text-green-600'
        }
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Erreur de sauvegarde',
          variant: 'destructive' as const,
          className: 'text-red-600'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={config.variant}
        className={`flex items-center gap-1 text-xs ${config.className}`}
      >
        {config.icon}
        {config.text}
      </Badge>
      
      {status === 'error' && errorMessage && (
        <span 
          className="text-xs text-red-600 max-w-xs truncate"
          title={errorMessage}
        >
          {errorMessage}
        </span>
      )}
    </div>
  )
}

/**
 * Hook pour gérer l'état de sauvegarde automatique
 * Simplifie la gestion de l'état dans les composants parents
 */
export function useAutoSaveStatus(initialStatus: SaveStatus = 'idle') {
  const [status, setStatus] = useState<SaveStatus>(initialStatus)
  const [lastSaved, setLastSaved] = useState<Date | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const updateStatus = (newStatus: SaveStatus, error?: string) => {
    setStatus(newStatus)
    setErrorMessage(error)
    
    if (newStatus === 'saved') {
      setLastSaved(new Date())
    }
  }

  const reset = () => {
    setStatus('idle')
    setErrorMessage(undefined)
  }

  return {
    status,
    lastSaved,
    errorMessage,
    updateStatus,
    reset,
    // Méthodes de convenance
    setPending: () => updateStatus('pending'),
    setSaving: () => updateStatus('saving'),
    setSaved: () => updateStatus('saved'),
    setError: (error: string) => updateStatus('error', error)
  }
}

export default AutoSaveStatus 