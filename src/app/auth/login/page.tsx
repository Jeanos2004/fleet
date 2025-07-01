'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDemoAuth } from '@/components/providers/demo-auth-provider'
import { 
  Truck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useDemoAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const demoAccounts = [
    { email: 'admin@fleetmanager.com', role: 'Administrateur', password: 'demo123' },
    { email: 'transport@fleetmanager.com', role: 'Responsable Transport', password: 'demo123' },
    { email: 'chauffeur1@fleetmanager.com', role: 'Chauffeur', password: 'demo123' },
    { email: 'tech@fleetmanager.com', role: 'Technicien', password: 'demo123' },
    { email: 'finance@fleetmanager.com', role: 'Finance', password: 'demo123' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Email ou mot de passe incorrect')
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FleetPro
          </h1>
          <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            Premium
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="w-4 h-4 mr-2" />
            Connexion sécurisée
          </Badge>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Bon retour !
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Connectez-vous à votre tableau de bord
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Se connecter
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        {/* Demo Accounts */}
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-center mb-3">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Comptes de démonstration
            </Badge>
          </div>
          
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => handleDemoLogin(account.email, account.password)}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {account.role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {account.email}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Utiliser
                </Button>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
            Mot de passe : <strong>demo123</strong>
          </p>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600 dark:text-slate-300">
            Pas de compte ?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
} 