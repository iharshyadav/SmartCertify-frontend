"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { authApi, getErrorMessage } from "./auth-api"
import { sessionManager, userManager } from "./auth-utils"
import { 
  AuthState, 
  User, 
  SigninFormData, 
  SignupFormData, 
  GoogleAuthData, 
  AuthResponse 
} from "./auth-types"

interface AuthContextType extends AuthState {
  signin: (data: SigninFormData) => Promise<AuthResponse>
  signup: (data: SignupFormData) => Promise<AuthResponse>
  googleAuth: (data: GoogleAuthData) => Promise<AuthResponse>
  signout: () => Promise<void>
  refreshSession: () => Promise<boolean>
  clearError: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if user data exists in client-accessible cookie
        const user = userManager.getUser()
        
        // Note: We can't check token validity client-side anymore since tokens are HttpOnly
        // The server will validate the HttpOnly cookie on API requests
        if (user) {
          setState({
            user,
            token: null, // Token is in HttpOnly cookie
            refreshToken: null, // Refresh token is in HttpOnly cookie
            isLoading: false,
            isAuthenticated: true
          })
        } else {
          setState({
            user: null,
            token: null,
            refreshToken: null,
            isLoading: false,
            isAuthenticated: false
          })
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        userManager.removeUser()
        setState({
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    }

    initializeAuth()
  }, [])

  const signin = async (data: SigninFormData): Promise<AuthResponse> => {
    setError(null)
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await authApi.signin(data)
      
      // Note: Cookies are automatically set by the server via Set-Cookie header
      // We only need to update the client state with user info
      // The tokens are now in HttpOnly cookies and not accessible to JavaScript
      
      setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username
        },
        token: null, // Token is now in HttpOnly cookie
        refreshToken: null, // Refresh token is now in HttpOnly cookie
        isLoading: false,
        isAuthenticated: true
      })

      // Still save user data to client-accessible cookie for UI purposes
      userManager.setUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.username
      })

      return response
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signup = async (data: SignupFormData): Promise<AuthResponse> => {
    setError(null)
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await authApi.signup(data)
      
      // Note: Cookies are automatically set by the server via Set-Cookie header
      // We only need to update the client state with user info
      
      setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username
        },
        token: null, // Token is now in HttpOnly cookie
        refreshToken: null, // Refresh token is now in HttpOnly cookie
        isLoading: false,
        isAuthenticated: true
      })

      // Still save user data to client-accessible cookie for UI purposes
      userManager.setUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.username
      })

      return response
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const googleAuth = async (data: GoogleAuthData): Promise<AuthResponse> => {
    setError(null)
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await authApi.googleAuth(data)
      
      // Note: Cookies are automatically set by the server via Set-Cookie header
      // We only need to update the client state with user info
      
      setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username
        },
        token: null, // Token is now in HttpOnly cookie
        refreshToken: null, // Refresh token is now in HttpOnly cookie
        isLoading: false,
        isAuthenticated: true
      })

      // Still save user data to client-accessible cookie for UI purposes
      userManager.setUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.username
      })

      return response
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signout = async () => {
    try {
      // Call logout endpoint to clear HttpOnly cookies on server
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout` || "http://localhost:8000/api/users/logout", {
        method: 'POST',
        credentials: 'include' // Include cookies in request
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with client-side cleanup even if server call fails
    }
    
    // Clear client-side user data
    userManager.removeUser()
    setState({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false
    })
    setError(null)
  }

  const refreshSession = async (): Promise<boolean> => {
    try {
      // With HttpOnly cookies, we can't validate tokens client-side
      // We need to make a request to the server to check if the session is still valid
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getprofile` || "http://localhost:8000/api/users/getprofile", {
        method: 'GET',
        credentials: 'include' // Include cookies in request
      })
      
      if (response.ok) {
        return true
      } else if (response.status === 401) {
        // Token expired or invalid
        await signout()
        return false
      } else {
        return false
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      await signout()
      return false
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    ...state,
    signin,
    signup,
    googleAuth,
    signout,
    refreshSession,
    clearError,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const useAuthForm = () => {
  const { signin, signup, googleAuth, isLoading, error, clearError } = useAuth()
  
  return {
    signin,
    signup,
    googleAuth,
    isLoading,
    error,
    clearError
  }
}

export const useAuthState = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth()
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading
  }
}

export const useAuthActions = () => {
  const { signout, refreshSession, clearError } = useAuth()
  
  return {
    signout,
    refreshSession,
    clearError
  }
}
