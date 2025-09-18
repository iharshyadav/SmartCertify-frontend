import { User } from "./auth-types"
import { clientCookies } from "./cookie-utils"

const TOKEN_KEY = "certify_token"
const REFRESH_TOKEN_KEY = "certify_refresh_token"
const USER_KEY = "certify_user"
export const tokenManager = {
  getToken: (): string | null => {
    return clientCookies.get(TOKEN_KEY)
  },

  setToken: (token: string): void => {
    // Set token to expire in 1 day (24 hours)
    clientCookies.set(TOKEN_KEY, token, {
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  },

  removeToken: (): void => {
    clientCookies.remove(TOKEN_KEY)
  },

  getRefreshToken: (): string | null => {
    return clientCookies.get(REFRESH_TOKEN_KEY)
  },

  setRefreshToken: (refreshToken: string): void => {
    // Set refresh token to expire in 7 days
    clientCookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  },

  removeRefreshToken: (): void => {
    clientCookies.remove(REFRESH_TOKEN_KEY)
  },

  clearTokens: (): void => {
    clientCookies.remove(TOKEN_KEY)
    clientCookies.remove(REFRESH_TOKEN_KEY)
  }
}

export const userManager = {
  getUser: (): User | null => {
    const userString = clientCookies.get(USER_KEY)
    if (!userString) return null
    
    try {
      return JSON.parse(userString) as User
    } catch {
      return null
    }
  },

  setUser: (user: User): void => {
    // Set user data to expire in 7 days
    clientCookies.set(USER_KEY, JSON.stringify(user), {
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  },

  removeUser: (): void => {
    clientCookies.remove(USER_KEY)
  }
}

export const jwtUtils = {
  decode: (token: string): any => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      
      // Use Buffer for server-side or atob for client-side
      let decoded: string
      if (typeof window === "undefined") {
        // Server-side (Node.js)
        decoded = Buffer.from(base64, 'base64').toString('utf-8')
      } else {
        // Client-side (browser)
        const jsonPayload = decodeURIComponent(
          window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          }).join('')
        )
        decoded = jsonPayload
      }
      
      return JSON.parse(decoded)
    } catch {
      return null
    }
  },

  isExpired: (token: string): boolean => {
    const decoded = jwtUtils.decode(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  },

  getExpirationTime: (token: string): number | null => {
    const decoded = jwtUtils.decode(token)
    return decoded?.exp || null
  },

  willExpireSoon: (token: string): boolean => {
    const decoded = jwtUtils.decode(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Date.now() / 1000
    const fiveMinutes = 5 * 60 
    return decoded.exp - currentTime < fiveMinutes
  }
}

export const sessionManager = {
  saveSession: (token: string, refreshToken: string, user: User): void => {
    tokenManager.setToken(token)
    tokenManager.setRefreshToken(refreshToken)
    userManager.setUser(user)
  },

  getSession: (): { token: string | null, refreshToken: string | null, user: User | null } => {
    return {
      token: tokenManager.getToken(),
      refreshToken: tokenManager.getRefreshToken(),
      user: userManager.getUser()
    }
  },

  clearSession: (): void => {
    tokenManager.clearTokens()
    userManager.removeUser()
  },

  isSessionValid: (): boolean => {
    const token = tokenManager.getToken()
    if (!token) return false
    return !jwtUtils.isExpired(token)
  },

  needsRefresh: (): boolean => {
    const token = tokenManager.getToken()
    if (!token) return false
    return jwtUtils.willExpireSoon(token)
  }
}

export const apiHelpers = {
  getAuthHeader: (): Record<string, string> => {
    const token = tokenManager.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  isAuthError: (status: number): boolean => {
    return status === 401 || status === 403
  }
}

export const formHelpers = {
  transformApiErrors: (errors?: Array<{ field?: string, msg?: string, message?: string }>): Record<string, string> => {
    if (!errors) return {}
    
    const formErrors: Record<string, string> = {}
    errors.forEach(error => {
      const field = error.field
      const message = error.msg || error.message || "Invalid value"
      if (field) {
        formErrors[field] = message
      }
    })
    
    return formErrors
  }
}
