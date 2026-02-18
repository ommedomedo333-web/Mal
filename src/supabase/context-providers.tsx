import React, { createContext, useContext, ReactNode } from 'react'
import {
  useAuth as useAuthHook,
  useUser as useUserHook,
  useWallet as useWalletHook,
  useCart as useCartHook,
  User,
  Wallet,
  WalletTransaction,
  CartItemWithProduct,
} from './supabase-hooks'
import { User as SupabaseUser } from '@supabase/supabase-js'

// ==========================================
// AUTH CONTEXT
// ==========================================

interface AuthContextType {
  user: SupabaseUser | null
  setUser: (user: SupabaseUser | null) => void
  userData: User | null
  loading: boolean
  signUp: (email: string, password: string, userData: { full_name: string; phone_number?: string }) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  resetPassword: (email: string) => Promise<any>
  updateUser: (updates: Partial<User>) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook()
  const { userData, updateUser } = useUserHook()

  const value: AuthContextType = {
    user: auth.user,
    setUser: auth.setUser,
    userData,
    loading: auth.loading,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

// ==========================================
// WALLET CONTEXT
// ==========================================

interface WalletContextType {
  wallet: Wallet | null
  transactions: WalletTransaction[]
  loading: boolean
  chargeWallet: (amount: number, description?: string) => Promise<any>
  processPayment: (orderId: string, amount: number, description?: string) => Promise<any>
  refetch: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useWalletHook()

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWalletContext must be used within WalletProvider')
  }
  return context
}

// ==========================================
// CART CONTEXT
// ==========================================

interface CartContextType {
  cartItems: CartItemWithProduct[]
  loading: boolean
  cartTotal: number
  cartCount: number
  addToCart: (productId: string, quantity: number) => Promise<any>
  updateCartItem: (itemId: string, quantity: number) => Promise<any>
  removeFromCart: (itemId: string) => Promise<any>
  clearCart: () => Promise<any>
  refetch: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCartHook()

  const cartCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const value: CartContextType = {
    ...cart,
    cartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within CartProvider')
  }
  return context
}

// ==========================================
// APP PROVIDER (Combines All Providers)
// ==========================================

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WalletProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </WalletProvider>
    </AuthProvider>
  )
}

// ==========================================
// PROTECTED ROUTE COMPONENT
// ==========================================

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h2>
              <p className="text-gray-600">
                الرجاء تسجيل الدخول للوصول إلى هذه الصفحة
              </p>
            </div>
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}

// ==========================================
// ADMIN ROUTE COMPONENT (Optional)
// ==========================================

interface AdminRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminRoute({ children, fallback }: AdminRouteProps) {
  const { userData, loading } = useAuthContext()

  if (loading) {
    return <div>Loading...</div>
  }

  const isAdmin = (userData as any)?.is_admin === true

  if (!isAdmin) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">غير مصرح</h2>
              <p className="text-gray-600">
                ليس لديك صلاحية للوصول إلى هذه الصفحة
              </p>
            </div>
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}

// ==========================================
// LOADING COMPONENT
// ==========================================

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-b-2 border-green-500 ${sizeClasses[size]}`}
      ></div>
    </div>
  )
}

// ==========================================
// ERROR BOUNDARY COMPONENT
// ==========================================

export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-red-600">
                حدث خطأ غير متوقع
              </h2>
              <p className="text-gray-600 mb-4">
                {this.state.error?.message || 'حدث خطأ في التطبيق'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                إعادة تحميل الصفحة
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// ==========================================
// TOAST NOTIFICATION SYSTEM (Optional)
// ==========================================

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[]
  onRemove: (id: string) => void
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-6 py-3 rounded-lg shadow-lg text-white min-w-[300px]
            ${toast.type === 'success' ? 'bg-green-500' : ''}
            ${toast.type === 'error' ? 'bg-red-500' : ''}
            ${toast.type === 'info' ? 'bg-blue-500' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <p>{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// ==========================================
// COMPLETE APP PROVIDER
// ==========================================

export function CompleteAppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WalletProvider>
          <CartProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </WalletProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}