export interface CookieOptions {
  maxAge?: number // in seconds
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

// Client-side cookie utilities
export const clientCookies = {
  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null
    
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      }
    }
    return null
  },

  set: (name: string, value: string, options: CookieOptions = {}): void => {
    if (typeof document === 'undefined') return
    
    const defaultOptions: CookieOptions = {
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      ...options
    }

    let cookieString = `${name}=${encodeURIComponent(value)}`
    
    if (defaultOptions.maxAge) {
      const expires = new Date()
      expires.setTime(expires.getTime() + defaultOptions.maxAge * 1000)
      cookieString += `; expires=${expires.toUTCString()}`
    } else if (defaultOptions.expires) {
      cookieString += `; expires=${defaultOptions.expires.toUTCString()}`
    }
    
    if (defaultOptions.path) {
      cookieString += `; path=${defaultOptions.path}`
    }
    
    if (defaultOptions.domain) {
      cookieString += `; domain=${defaultOptions.domain}`
    }
    
    if (defaultOptions.secure) {
      cookieString += '; secure'
    }
    
    if (defaultOptions.sameSite) {
      cookieString += `; samesite=${defaultOptions.sameSite}`
    }
    
    document.cookie = cookieString
  },

  remove: (name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void => {
    if (typeof document === 'undefined') return
    
    const defaultOptions = {
      path: '/',
      ...options
    }
    
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`
    
    if (defaultOptions.path) {
      cookieString += `; path=${defaultOptions.path}`
    }
    
    if (defaultOptions.domain) {
      cookieString += `; domain=${defaultOptions.domain}`
    }
    
    document.cookie = cookieString
  }
}

