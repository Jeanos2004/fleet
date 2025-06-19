'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Truck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulation d'authentification
    setTimeout(() => {
      setIsLoading(false)
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="border-[var(--color-border)]min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 ">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side - Branding */}
        <motion.div 
          className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold">FleetPro</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Bienvenue sur FleetPro
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              La solution de gestion de flotte qui transforme votre business
            </p>
          </div>

          <motion.div 
            className="space-y-6"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {[
              {
                icon: Shield,
                title: "Sécurité garantie",
                description: "Vos données sont protégées avec un chiffrement de niveau bancaire"
              },
              {
                icon: Zap,
                title: "Performance optimale",
                description: "Interface ultra-rapide et temps de réponse minimal"
              },
              {
                icon: CheckCircle,
                title: "Support 24/7",
                description: "Notre équipe est là pour vous accompagner à tout moment"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-start space-x-4"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          className="flex flex-col justify-center p-8 lg:p-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-md mx-auto">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  FleetPro
                </span>
              </div>
            </div>

            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                🔐 Connexion sécurisée
              </Badge>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Bon retour !
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                Connectez-vous à votre compte pour accéder à votre tableau de bord
              </p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
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
                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">
                    Se souvenir de moi
                  </span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Mot de passe oublié ?
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
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
              </motion.div>
            </motion.form>

            <motion.div 
              variants={fadeInUp}
              initial="initial" 
              animate="animate"
              className="mt-8 text-center"
            >
              <p className="text-slate-600 dark:text-slate-300">
                Pas encore de compte ?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Créer un compte
                </Link>
              </p>
            </motion.div>

            {/* Demo Credentials */}
            <motion.div 
              variants={fadeInUp}
              initial="initial" 
              animate="animate"
              className="mt-6 p-4 bg-blue-50 dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-600"
            >
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                🎯 Compte de démonstration
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Email: demo@fleetpro.com<br />
                Mot de passe: demo123
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 