"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        // Rediriger vers le dashboard après connexion réussie
        router.push('/dashboard')
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const demoAccounts = [
    { email: 'admin@fleetmanager.com', role: 'Administrateur', password: 'demo123' },
    { email: 'transport@fleetmanager.com', role: 'Responsable Transport', password: 'demo123' },
    { email: 'chauffeur1@fleetmanager.com', role: 'Chauffeur', password: 'demo123' },
    { email: 'tech@fleetmanager.com', role: 'Technicien', password: 'demo123' },
    { email: 'finance@fleetmanager.com', role: 'Finance', password: 'demo123' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md sm:max-w-lg space-y-6">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-full shadow-lg border-2 border-primary/20">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Fleet Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="text-center text-xl sm:text-2xl">Connexion</CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-primary/20"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 font-medium">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-6 py-3 text-base border-2 border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comptes de démonstration */}
        <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="text-sm sm:text-base">Comptes de démonstration</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3">
              {demoAccounts.map((account, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {account.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                      {account.email}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                    onClick={() => {
                      setEmail(account.email)
                      setPassword(account.password)
                    }}
                  >
                    Utiliser
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
              Mot de passe pour tous les comptes : <strong>demo123</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 