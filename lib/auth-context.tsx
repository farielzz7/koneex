"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "AGENT" | "CUSTOMER"
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
    const checkSession = async () => {
      const storedUser = localStorage.getItem("koneex_user")
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser)
          // Validate existing session against DB to ensure role/status is up to date
          const { data: dbUser, error } = await supabase
            .from('users')
            .select('id, name, email, role, status')
            .eq('id', Number(parsedUser.id))
            .single()

          if (dbUser && dbUser.status === 'ACTIVE' && !error) {
            setUser({
              id: dbUser.id.toString(),
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role as "ADMIN" | "AGENT" | "CUSTOMER",
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${dbUser.email}`
            })
          } else {
            // Invalid session or blocked user
            localStorage.removeItem("koneex_user")
            setUser(null)
          }
        } catch (e) {
          localStorage.removeItem("koneex_user")
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkSession()

    const savedRedirect = localStorage.getItem("koneex_redirect")
    if (savedRedirect) {
      setRedirectAfterLogin(savedRedirect)
    }
  }, [])

  const login = async (email: string, password: string): Promise<string> => {
    setIsLoading(true)

    try {
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !dbUser) {
        throw new Error("Usuario no encontrado")
      }

      if (dbUser.status !== 'ACTIVE') {
        throw new Error("Tu cuenta está desactivada")
      }

      if (!dbUser.password) {
        throw new Error("Credenciales inválidas")
      }

      const isValid = await bcrypt.compare(password, dbUser.password)

      if (!isValid) {
        throw new Error("Contraseña incorrecta")
      }

      const userSession: User = {
        id: dbUser.id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role as "ADMIN" | "AGENT" | "CUSTOMER",
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`
      }

      setUser(userSession)
      localStorage.setItem("koneex_user", JSON.stringify(userSession))

      const redirect = redirectAfterLogin || (userSession.role === "ADMIN" ? "/admin" : "/")
      localStorage.removeItem("koneex_redirect")
      setRedirectAfterLogin(null)

      return redirect

    } catch (error: any) {
      console.error("Login error:", error)
      throw error.message || error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<string> => {
    setIsLoading(true)

    try {
      // 1. Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // 2. Insert user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            name,
            email,
            password: hashedPassword,
            role: 'CUSTOMER',
            status: 'ACTIVE'
          }
        ])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') throw new Error("El correo ya está registrado")
        throw error
      }

      // 3. Auto-login
      const userSession: User = {
        id: newUser.id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as "ADMIN" | "AGENT" | "CUSTOMER",
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${newUser.email}`
      }

      setUser(userSession)
      localStorage.setItem("koneex_user", JSON.stringify(userSession))

      return "/"

    } catch (error) {
      console.error("Register error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
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
