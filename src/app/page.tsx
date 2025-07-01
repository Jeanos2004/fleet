'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Truck, 
  MapPin, 
  BarChart3, 
  Shield, 
  Clock, 
  Users,
  ArrowRight,
  TrendingUp,
  Zap,
  CheckCircle,
  Star,
  Play,
  ChevronDown,
  Globe,
  Award,
  Target
} from 'lucide-react'

// Animations variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const scaleOnHover = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  whileTap: { scale: 0.95 }
}

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

// Gradient text component
const GradientText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
)

export default function HomePage() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  
  const heroInView = useInView(heroRef, { once: true })
  const featuresInView = useInView(featuresRef, { once: true })
  const statsInView = useInView(statsRef, { once: true })

  const stats = [
    { number: "10K+", label: "Véhicules gérés", icon: Truck },
    { number: "500+", label: "Entreprises clientes", icon: Users },
    { number: "99.9%", label: "Temps de disponibilité", icon: CheckCircle },
    { number: "24/7", label: "Support technique", icon: Clock }
  ]

  const features = [
    {
      icon: MapPin,
      title: "Suivi GPS Temps Réel",
      description: "Localisez instantanément vos véhicules avec une précision au mètre près. Optimisez vos itinéraires et réduisez vos coûts de carburant.",
      color: "from-green-500 to-emerald-600",
      delay: 0
    },
    {
      icon: BarChart3,
      title: "Analytics Intelligentes",
      description: "Tableaux de bord avancés avec IA prédictive pour anticiper les pannes et optimiser les performances de votre flotte.",
      color: "from-blue-500 to-cyan-600",
      delay: 0.1
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Chiffrement bancaire, authentification multi-facteurs et conformité RGPD pour protéger vos données critiques.",
      color: "from-purple-500 to-violet-600",
      delay: 0.2
    },
    {
      icon: Clock,
      title: "Gestion des Missions",
      description: "Planification automatisée, attribution intelligente et suivi en temps réel de toutes vos missions et livraisons.",
      color: "from-orange-500 to-red-600",
      delay: 0.3
    },
    {
      icon: Users,
      title: "Management d&apos;Équipe",
      description: "Gestion complète des chauffeurs, formation, évaluations de performance et système de récompenses intégré.",
      color: "from-indigo-500 to-blue-600",
      delay: 0.4
    },
    {
      icon: TrendingUp,
      title: "ROI Optimisé",
      description: "Réduction moyenne de 30% des coûts opérationnels grâce à l&apos;optimisation automatique et l&apos;analyse prédictive.",
      color: "from-teal-500 to-green-600",
      delay: 0.5
    }
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold">
                  <GradientText>FleetPro</GradientText>
                </span>
                <div className="flex items-center space-x-1">
                  <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    Premium
                  </Badge>
                </div>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-foreground hover:bg-accent/50 transition-all duration-300">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/register">
                <motion.div {...scaleOnHover}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Commencer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={floatingAnimation}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{...floatingAnimation, transition: {...floatingAnimation.transition, delay: 3}}}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center"
            variants={staggerChildren}
            initial="initial"
            animate={heroInView ? "animate" : "initial"}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 dark:from-blue-950 dark:to-purple-950 dark:text-blue-300 dark:border-blue-800 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Solution IA nouvelle génération
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight"
            >
              Révolutionnez votre
              <br />
              <GradientText className="text-5xl md:text-7xl font-bold">
                gestion de flotte
              </GradientText>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              La plateforme tout-en-un propulsée par l&apos;IA pour optimiser, sécuriser et transformer 
              votre flotte de véhicules. Rejoignez plus de 500 entreprises qui nous font confiance.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <Link href="/auth/register">
                <motion.div {...scaleOnHover}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                    <Play className="mr-3 h-5 w-5" />
                    Démarrer gratuitement
                  </Button>
                </motion.div>
              </Link>
              <Link href="#demo">
                <motion.div {...scaleOnHover}>
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-border hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 transition-all duration-300">
                    <Globe className="mr-3 h-5 w-5" />
                    Voir la démo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              ref={statsRef}
              variants={staggerChildren}
              initial="initial"
              animate={statsInView ? "animate" : "initial"}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 dark:from-purple-950 dark:to-pink-950 dark:text-purple-300 dark:border-purple-800">
              <Award className="w-4 h-4 mr-2" />
              Fonctionnalités premium
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Technologie de <GradientText>pointe</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Des outils sophistiqués conçus pour transformer votre gestion de flotte 
              et maximiser votre rentabilité
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, y: 60 },
                  animate: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.8, 
                      delay: feature.delay,
                      ease: [0.6, -0.05, 0.01, 0.99]
                    }
                  }
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="h-full p-8 bg-card rounded-2xl border border-border shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:text-green-300 dark:border-green-800">
              <Target className="w-4 h-4 mr-2" />
              Prêt à commencer ?
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Transformez votre flotte 
              <GradientText className="block">dès aujourd&apos;hui</GradientText>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Rejoignez les entreprises leaders qui optimisent leurs opérations 
              avec FleetPro. Essai gratuit, sans engagement.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/auth/register">
                <motion.div {...scaleOnHover}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                    Commencer maintenant
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-background flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  ))}
                </div>
                <span className="text-sm">
                  Noté 4.9/5 par nos clients
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
