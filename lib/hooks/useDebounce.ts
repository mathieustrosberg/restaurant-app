"use client"

import { useCallback, useRef } from 'react'

/**
 * Hook de débounce pour optimiser les performances
 * Utile pour retarder l'exécution d'une fonction jusqu'à ce qu'un délai se soit écoulé
 * 
 * @param callback - Fonction à débouncer
 * @param delay - Délai en millisecondes
 * @returns Fonction débouncée
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      // Annuler le timeout précédent s'il existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Créer un nouveau timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}

/**
 * Hook de débounce avec état de chargement
 * Utile pour les sauvegardes avec feedback visuel
 * 
 * @param callback - Fonction async à débouncer
 * @param delay - Délai en millisecondes
 * @returns Objet avec fonction débouncée et état de chargement
 */
export function useDebounceWithLoading<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const loadingRef = useRef(false)
  const pendingRef = useRef(false)

  const debouncedCallback = useCallback(
    async (...args: Parameters<T>) => {
      // Annuler le timeout précédent
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Marquer comme en attente
      pendingRef.current = true

      // Créer un nouveau timeout
      timeoutRef.current = setTimeout(async () => {
        if (pendingRef.current) {
          loadingRef.current = true
          try {
            await callback(...args)
          } finally {
            loadingRef.current = false
            pendingRef.current = false
          }
        }
      }, delay)
    },
    [callback, delay]
  )

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    pendingRef.current = false
  }, [])

  const isLoading = () => loadingRef.current
  const isPending = () => pendingRef.current

  return {
    debouncedCallback,
    cancel,
    isLoading,
    isPending
  }
}

/**
 * Hook de throttle pour limiter la fréquence d'exécution
 * Utile pour les événements qui se déclenchent fréquemment (scroll, resize)
 * 
 * @param callback - Fonction à throttler
 * @param limit - Délai minimum entre les exécutions en ms
 * @returns Fonction throttlée
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): (...args: Parameters<T>) => void {
  const inThrottleRef = useRef(false)

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottleRef.current) {
        callback(...args)
        inThrottleRef.current = true
        setTimeout(() => {
          inThrottleRef.current = false
        }, limit)
      }
    },
    [callback, limit]
  )
}

export default useDebounce 