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
  User,
  Building,
  Phone,
  MapPin,
  Sparkles,
  Users,
  TrendingUp
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

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    city: '',
    fleetSize: '',
    acceptTerms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }
    
    setIsLoading(true)
    
    // Simulation d'inscription
    setTimeout(() => {
      setIsLoading(false)
      router.push('/dashboard')
    }, 2000)
  }

  const handleBack = () => {
    setStep(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side - Branding */}
        <motion.div 
          className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white"
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
              Rejoignez FleetPro
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Transformez la gestion de votre flotte dès aujourd'hui
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
                icon: Sparkles,
                title: "Configuration rapide",
                description: "Mise en route en moins de 5 minutes avec notre assistant intelligent"
              },
              {
                icon: Users,
                title: "Équipe dédiée",
                description: "Un conseiller personnel pour vous accompagner dans vos premiers pas"
              },
              {
                icon: TrendingUp,
                title: "ROI immédiat",
                description: "Réduisez vos coûts de 20% dès le premier mois d'utilisation"
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
                  <p className="text-indigo-100 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Indicator */}
          <div className="mt-12">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
            </div>
            <p className="text-sm text-indigo-100">
              Étape {step} sur 2
            </p>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
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
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FleetPro
                </span>
              </div>
            </div>

            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Badge className="mb-4 bg-indigo-100 text-indigo-800 border-indigo-200">
                ✨ Inscription gratuite
              </Badge>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {step === 1 ? 'Créer votre compte' : 'Informations entreprise'}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                {step === 1 
                  ? 'Commencez votre essai gratuit de 30 jours'
                  : 'Quelques détails pour personnaliser votre expérience'
                }
              </p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Prénom
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="Jean"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        placeholder="Dupont"
                      />
                    </motion.div>
                  </div>

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
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        placeholder="jean.dupont@entreprise.com"
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
                        className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
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

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nom de l'entreprise
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        placeholder="Transport Dupont SARL"
                      />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="01 23 45 67 89"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Ville
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="Paris"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Taille de votre flotte
                    </label>
                    <select
                      value={formData.fleetSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, fleetSize: e.target.value }))}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="1-5">1-5 véhicules</option>
                      <option value="6-20">6-20 véhicules</option>
                      <option value="21-50">21-50 véhicules</option>
                      <option value="51-100">51-100 véhicules</option>
                      <option value="100+">Plus de 100 véhicules</option>
                    </select>
                  </motion.div>
                </>
              )}

              {step === 1 && (
                <motion.div variants={fadeInUp} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500 focus:ring-2 mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-300">
                    J'accepte les{' '}
                    <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      politique de confidentialité
                    </Link>
                  </label>
                </motion.div>
              )}

              <motion.div variants={fadeInUp} className="flex items-center space-x-4">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 py-3 px-4 rounded-xl font-medium"
                  >
                    Retour
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isLoading || (step === 1 && !formData.acceptTerms)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {step === 1 ? 'Continuer' : 'Créer mon compte'}
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
                Déjà un compte ?{' '}
                <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Se connecter
                </Link>
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div 
              variants={fadeInUp}
              initial="initial" 
              animate="animate"
              className="mt-6 p-4 bg-indigo-50 dark:bg-slate-800 rounded-xl border border-indigo-200 dark:border-slate-600"
            >
              <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium mb-2">
                🎁 Offre de lancement
              </p>
              <ul className="text-xs text-indigo-600 dark:text-indigo-400 space-y-1">
                <li>• 30 jours d'essai gratuit</li>
                <li>• Configuration personnalisée incluse</li>
                <li>• Support prioritaire pendant 3 mois</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 