import { User } from "./auth-types"

const TOKEN_KEY = "certify_token"
const REFRESH_TOKEN_KEY = "certify_refresh_token"
const USER_KEY = "certify_user"

export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(TOKEN_KEY)
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken: (refreshToken: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  removeRefreshToken: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

export const userManager = {
  getUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userString = localStorage.getItem(USER_KEY)
    if (!userString) return null
    
    try {
      return JSON.parse(userString) as User
    } catch {
      return null
    }
  },

  setUser: (user: User): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  removeUser: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(USER_KEY)
  }
}

export const jwtUtils = {
  decode: (token: string): any => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join('')
      )
      return JSON.parse(jsonPayload)
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
