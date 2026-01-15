"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<string>
  register: (name: string, email: string, password: string) => Promise<string>
  logout: () => void
  isAuthenticated: boolean
  setRedirectUrl: (url: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("koneex_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    const savedRedirect = localStorage.getItem("koneex_redirect")
    if (savedRedirect) {
      setRedirectAfterLogin(savedRedirect)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<string> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
    }

    setUser(mockUser)
    localStorage.setItem("koneex_user", JSON.stringify(mockUser))
    setIsLoading(false)

    const redirect = redirectAfterLogin || "/"
    localStorage.removeItem("koneex_redirect")
    setRedirectAfterLogin(null)
    return redirect
  }

  const register = async (name: string, email: string, password: string): Promise<string> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
    }

    setUser(mockUser)
    localStorage.setItem("koneex_user", JSON.stringify(mockUser))
    setIsLoading(false)

    const redirect = redirectAfterLogin || "/"
    localStorage.removeItem("koneex_redirect")
    setRedirectAfterLogin(null)
    return redirect
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("koneex_user")
  }

  const setRedirectUrl = (url: string) => {
    setRedirectAfterLogin(url)
    localStorage.setItem("koneex_redirect", url)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        setRedirectUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
