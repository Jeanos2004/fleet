export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Test Tailwind CSS</h1>
        
        {/* Test des couleurs de base */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Couleurs Standard</h2>
            <div className="space-y-2">
              <div className="bg-red-500 text-white p-2 rounded">Rouge</div>
              <div className="bg-green-500 text-white p-2 rounded">Vert</div>
              <div className="bg-blue-500 text-white p-2 rounded">Bleu</div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md border-border border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Couleurs Personnalisées</h2>
            <div className="space-y-2">
              <div className="bg-primary text-primary-foreground p-2 rounded">Primary</div>
              <div className="bg-secondary text-secondary-foreground p-2 rounded">Secondary</div>
              <div className="bg-muted text-muted-foreground p-2 rounded">Muted</div>
            </div>
          </div>

          <div className="bg-accent p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-accent-foreground mb-4">Layout Test</h2>
            <div className="space-y-2">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded transition-colors">
                Bouton Primary
              </button>
              <button className="w-full border border-border bg-background hover:bg-accent text-foreground p-2 rounded transition-colors">
                Bouton Secondary
              </button>
            </div>
          </div>
        </div>

        {/* Test responsive */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Responsive</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 rounded-lg text-center font-semibold">
                Item {i}
              </div>
            ))}
          </div>
        </div>

        {/* Test des utilitaires */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Utilitaires Tailwind</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Texte petit et gris</p>
            <p className="text-lg font-medium text-blue-600">Texte moyen et bleu</p>
            <p className="text-xl font-bold text-green-600">Texte grand et vert</p>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              <div className="w-8 h-8 bg-blue-500"></div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Si vous voyez cette page avec des styles colorés, Tailwind CSS fonctionne ! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}