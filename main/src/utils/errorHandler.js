/** check if error is an authentication error */
export function isAuthenticationError(error) {
  if (!error) return false
  
  if (error.code === 'unauthenticated') {
    return true
  }
  
  if (error.details) {
    const details = error.details.toString().toLowerCase()
    if (details.includes('unauthenticated') || details.includes('user must be authenticated')) {
      return true
    }
  }
  
  const message = error.message?.toLowerCase() || ''
  if (message.includes('unauthenticated') || message.includes('user must be authenticated')) {
    return true
  }
  
  if (error.errorInfo) {
    const errorInfo = error.errorInfo
    if (errorInfo.code === 'unauthenticated' || errorInfo.status === 'UNAUTHENTICATED') {
      return true
    }
  }
  
  return false
}

/** return a user-facing error message */
export function getErrorMessage(error, defaultMessage = 'An error occurred. Please try again.') {
  if (isAuthenticationError(error)) {
    return 'Please sign in to continue'
  }
  return defaultMessage
}

