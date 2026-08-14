// === src/context/AuthContext.jsx — SUPABASE PHONE OTP AUTH (DEMO MODE) ===
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      // Silently fail if Supabase is unreachable (demo mode)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [])

  /**
   * Send SMS OTP — DEMO MODE: simulates sending without actual Supabase call.
   * Accepts any phone number and resolves after a short delay.
   */
  const sendPhoneOTP = async (phoneNumber) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800))
    // In demo mode, we don't actually call Supabase.
    // Any phone number is accepted.
    return { success: true }
  }

  /**
   * Verify OTP — DEMO MODE: accepts any 4-digit code.
   * Sets a mock user so the app flows as if authenticated.
   */
  const verifyPhoneOTP = async (phoneNumber, token) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 600))

    // Accept any 4-digit code in demo mode
    if (!token || token.length < 4) {
      throw new Error('Invalid code. Please enter the full 4-digit code.')
    }

    // Create a mock user for the demo
    const mockUser = {
      id: 'demo-user-123',
      phone: phoneNumber,
      email: null,
      app_metadata: {},
      user_metadata: { phone: phoneNumber },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    }

    setUser(mockUser)
    return { user: mockUser, session: { user: mockUser } }
  }

  const logOut = async () => {
    setUser(null)
    try {
      await supabase.auth.signOut()
    } catch {
      // Silently fail in demo mode
    }
  }

  const value = {
    user,
    loading,
    sendPhoneOTP,
    verifyPhoneOTP,
    logOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
