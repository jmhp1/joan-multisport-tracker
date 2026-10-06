import { useCallback } from 'react'
import { apiFetch } from './client.js'
import { useAuth } from '../context/AuthContext.jsx'

// Returns a fetch function pre-bound with the current user's auth token.
export function useApi() {
  const { token } = useAuth()
  return useCallback(
    (path, options) => apiFetch(path, { ...options, token }),
    [token],
  )
}
