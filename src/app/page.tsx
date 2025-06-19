'use client'

import { motion } from 'framer-motion'
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
  TrendingUp
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
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

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">
                FleetPro
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-foreground hover:bg-accent">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/register">
                <motion.div {...scaleOnHover}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Commencer
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-accent text-accent-foreground border-border">
                🚀 Solution de gestion de flotte nouvelle génération
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-foreground mb-6"
            >
              Gérez votre flotte
              <br />
              <span className="text-primary">
                intelligemment
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Une plateforme complète pour optimiser la gestion de votre flotte de véhicules, 
              suivre vos missions en temps réel et maximiser votre efficacité opérationnelle.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth/register">
                <motion.div {...scaleOnHover}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                    Démarrer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="#demo">
                <motion.div {...scaleOnHover}>
                  <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2 border-border">
                    Voir la démo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fonctionnalités puissantes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour une gestion de flotte moderne et efficace
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: MapPin,
                title: "Suivi GPS en temps réel",
                description: "Localisez vos véhicules instantanément et optimisez vos itinéraires",
                color: "text-green-600"
              },
              {
                icon: BarChart3,
                title: "Analytics avancées",
                description: "Tableaux de bord intelligents pour des décisions éclairées",
                color: "text-blue-600"
              },
              {
                icon: Shield,
                title: "Sécurité renforcée",
                description: "Contrôle d'accès granulaire et chiffrement des données",
                color: "text-purple-600"
              },
              {
                icon: Clock,
                title: "Gestion des missions",
                description: "Planifiez et suivez vos missions avec précision",
                color: "text-orange-600"
              },
              {
                icon: Users,
                title: "Gestion d'équipe",
                description: "Organisez vos chauffeurs et personnels efficacement",
                color: "text-indigo-600"
              },
              {
                icon: TrendingUp,
                title: "Optimisation des coûts",
                description: "Réduisez vos dépenses carburant et maintenance",
                color: "text-teal-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="card-hover p-6"
              >
                <div className={`w-12 h-12 rounded-lg ${feature.color} bg-accent flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { number: "500+", label: "Entreprises clientes" },
              { number: "10K+", label: "Véhicules gérés" },
              { number: "99.9%", label: "Disponibilité" },
              { number: "24/7", label: "Support client" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Prêt à transformer votre gestion de flotte ?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Rejoignez des centaines d'entreprises qui font confiance à FleetPro
            </p>
            <Link href="/auth/register">
              <motion.div {...scaleOnHover}>
                <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">FleetPro</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                La solution complète pour la gestion moderne de votre flotte de véhicules.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Produit</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Fonctionnalités</Link></li>
                <li><Link href="#" className="hover:text-foreground">Tarifs</Link></li>
                <li><Link href="#" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 FleetPro. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
