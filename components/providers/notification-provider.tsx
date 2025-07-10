"use client"

import React, { createContext, useContext } from 'react'
import { useNotifications, Notification } from '@/lib/hooks/useNotifications'
import { NotificationContainer } from '@/components/ui/notification-container'

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  success: (title: string, message?: string, duration?: number) => string
  error: (title: string, message?: string, duration?: number) => string
  warning: (title: string, message?: string, duration?: number) => string
  info: (title: string, message?: string, duration?: number) => string
  apiError: (title: string, message: string, retryAction?: () => void) => string
  saveStatus: (success: boolean, itemName?: string) => string
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: React.ReactNode
}

/**
 * Provider global pour les notifications
 * Doit être placé au niveau du layout principal de l'application
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const notificationHook = useNotifications()

  return (
    <NotificationContext.Provider value={notificationHook}>
      {children}
      <NotificationContainer
        notifications={notificationHook.notifications}
        onRemove={notificationHook.removeNotification}
      />
    </NotificationContext.Provider>
  )
}

/**
 * Hook pour utiliser les notifications dans n'importe quel composant
 * Doit être utilisé à l'intérieur du NotificationProvider
 */
export function useNotificationContext() {
  const context = useContext(NotificationContext)
  
  if (context === undefined) {
    throw new Error('useNotificationContext doit être utilisé à l\'intérieur d\'un NotificationProvider')
  }
  
  return context
}

export default NotificationProvider 