import { 
  SigninFormData, 
  SignupFormData, 
  GoogleAuthData, 
  AuthResponse, 
  ApiError 
} from "./auth-types"
import { apiHelpers } from "./auth-utils"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/users` || "http://localhost:8000/api/users"

class ApiResponseError extends Error {
  status: number
  errors?: Array<{ field?: string, message?: string, msg?: string }>

  constructor(message: string, status: number, errors?: any[]) {
    super(message)
    this.status = status
    this.errors = errors
    this.name = "ApiResponseError"
  }
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...apiHelpers.getAuthHeader(),
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new ApiResponseError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data.errors
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiResponseError) {
        throw error
      }
      
      throw new ApiResponseError(
        "Network error occurred",
        0
      )
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

const apiClient = new ApiClient(API_BASE_URL)

export const authApi = {
  signup: async (data: SignupFormData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>("/signup", data)
      return response
    } catch (error) {
      if (error instanceof ApiResponseError) {
        const apiError: ApiError = {
          message: error.message,
          status: error.status,
          errors: error.errors?.map(e => ({
            field: e.field || "",
            message: e.message || e.msg || ""
          }))
        }
        throw apiError
      }
      throw error
    }
  },

  signin: async (data: SigninFormData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>("/signin", data)
      return response
    } catch (error) {
      if (error instanceof ApiResponseError) {
        const apiError: ApiError = {
          message: error.message,
          status: error.status,
          errors: error.errors?.map(e => ({
            field: e.field || "",
            message: e.message || e.msg || ""
          }))
        }
        throw apiError
      }
      throw error
    }
  },

  googleAuth: async (data: GoogleAuthData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>("/googlesignin", data)
      return response
    } catch (error) {
      if (error instanceof ApiResponseError) {
        const apiError: ApiError = {
          message: error.message,
          status: error.status,
          errors: error.errors?.map(e => ({
            field: e.field || "",
            message: e.message || e.msg || ""
          }))
        }
        throw apiError
      }
      throw error
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get("/getprofile")
      return response
    } catch (error) {
      if (error instanceof ApiResponseError) {
        const apiError: ApiError = {
          message: error.message,
          status: error.status
        }
        throw apiError
      }
      throw error
    }
  },

  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.put("/updateprofile", data)
      return response
    } catch (error) {
      if (error instanceof ApiResponseError) {
        const apiError: ApiError = {
          message: error.message,
          status: error.status,
          errors: error.errors?.map(e => ({
            field: e.field || "",
            message: e.message || e.msg || ""
          }))
        }
        throw apiError
      }
      throw error
    }
  }
}

export { apiClient }

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.status === "number" && typeof error.message === "string"
}

export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return "An unexpected error occurred"
}
