"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { authApi, getErrorMessage } from "./auth-api"
import { sessionManager } from "./auth-utils"
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
  signout: () => void
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
        const session = sessionManager.getSession()
        
        if (session.token && session.user && sessionManager.isSessionValid()) {
          setState({
            user: session.user,
            token: session.token,
            refreshToken: session.refreshToken,
            isLoading: false,
            isAuthenticated: true
          })
        } else {
          sessionManager.clearSession()
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
        sessionManager.clearSession()
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
      
      sessionManager.saveSession(response.token, response.refreshToken, {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username
      })

      setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username
        },
        token: response.token,
        refreshToken: response.refreshToken,
        isLoading: false,
        isAuthenticated: true
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
      
      sessionManager.saveSession(response.token, response.refreshToken, {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username
      })

      setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username
        },
        token: response.token,
        refreshToken: response.refreshToken,
        isLoading: false,
        isAuthenticated: true
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
      
      sessionManager.saveSession(response.token, response.refreshToken, {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username
      })

      setState({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username
        },
        token: response.token,
        refreshToken: response.refreshToken,
        isLoading: false,
        isAuthenticated: true
      })

      return response
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signout = () => {
    sessionManager.clearSession()
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
      const isValid = sessionManager.isSessionValid()
      
      if (!isValid) {
        signout()
        return false
      }
      
      return true
    } catch (error) {
      signout()
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
