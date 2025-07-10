"use client"

import { useState, useCallback } from 'react'

/**
 * Types de notifications
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Hook pour gérer les notifications de l'application
 * Fournit un système centralisé pour afficher des messages à l'utilisateur
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  /**
   * Ajouter une nouvelle notification
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: 5000, // 5 secondes par défaut
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove après la durée spécifiée
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [])

  /**
   * Supprimer une notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  /**
   * Vider toutes les notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  /**
   * Méthodes de convenance pour les différents types
   */
  const success = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration
    })
  }, [addNotification])

  const error = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: duration || 8000 // Erreurs restent plus longtemps
    })
  }, [addNotification])

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration
    })
  }, [addNotification])

  const info = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration
    })
  }, [addNotification])

  /**
   * Notifications pour les erreurs d'API avec retry
   */
  const apiError = useCallback((
    title: string, 
    message: string, 
    retryAction?: () => void
  ) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 10000,
      action: retryAction ? {
        label: 'Réessayer',
        onClick: retryAction
      } : undefined
    })
  }, [addNotification])

  /**
   * Notification de sauvegarde avec feedback
   */
  const saveStatus = useCallback((success: boolean, itemName?: string) => {
    if (success) {
      return addNotification({
        type: 'success',
        title: 'Sauvegarde réussie',
        message: itemName ? `${itemName} a été sauvegardé avec succès` : undefined,
        duration: 3000
      })
    } else {
      return addNotification({
        type: 'error',
        title: 'Erreur de sauvegarde',
        message: itemName ? `Impossible de sauvegarder ${itemName}` : 'Une erreur est survenue lors de la sauvegarde',
        duration: 8000
      })
    }
  }, [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    apiError,
    saveStatus
  }
} 