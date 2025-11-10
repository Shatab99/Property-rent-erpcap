/**
 * Get authentication token from browser cookies
 * This function dynamically retrieves the token each time it's called
 * ensuring you always get the current user's token
 * 
 * Usage:
 * const token = getToken()
 * if (token) {
 *   const response = await api.get('/endpoint', {
 *     headers: { "Authorization": `Bearer ${token}` }
 *   })
 * }
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null
  }
  return null
}

/**
 * Check if user is authenticated by verifying token exists
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null
}

/**
 * Clear token from cookies (for logout)
 */
export const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}
