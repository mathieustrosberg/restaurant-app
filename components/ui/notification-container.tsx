"use client"

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Notification, NotificationType } from '@/lib/hooks/useNotifications'

interface NotificationContainerProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

/**
 * Composant pour afficher les notifications dans l'interface
 * Affiche les notifications avec les bonnes couleurs et icônes
 */
export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  // Auto-remove les notifications après leur durée
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          onRemove(notification.id)
        }, notification.duration)
        
        return () => clearTimeout(timer)
      }
    })
  }, [notifications, onRemove])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const { type, title, message, action } = notification

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getColorClasses = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <Card className={`${getColorClasses(type)} shadow-lg animate-in slide-in-from-right-5 duration-300`}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getIcon(type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {title}
                </h4>
                {message && (
                  <p className="mt-1 text-sm text-gray-600">
                    {message}
                  </p>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={() => onRemove(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {action && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    action.onClick()
                    onRemove(notification.id)
                  }}
                  className="h-8 text-xs"
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Provider pour les notifications - à placer dans le layout principal
 */
interface NotificationProviderProps {
  children: React.ReactNode
  notifications: Notification[]
  onRemove: (id: string) => void
}

export function NotificationProvider({ 
  children, 
  notifications, 
  onRemove 
}: NotificationProviderProps) {
  return (
    <>
      {children}
      <NotificationContainer notifications={notifications} onRemove={onRemove} />
    </>
  )
}

export default NotificationContainer 