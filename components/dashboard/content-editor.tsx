"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useContent } from '@/lib/hooks/useContent'
import { PageContent, MenuItem } from '@/lib/content'

export default function ContentEditor() {
  const { content, loading, updateContent } = useContent()
  const [editingContent, setEditingContent] = useState<Partial<PageContent>>({})
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')

  useEffect(() => {
    if (content) {
      setEditingContent(content)
    }
  }, [content])

  const handleSave = async () => {
    if (!editingContent.heroSection || !editingContent.infoBanner || !editingContent.imageHighlight || !editingContent.menuSection) {
      alert('Veuillez remplir tous les champs requis')
      return
    }

    setSaving(true)
    const success = await updateContent({
      heroSection: editingContent.heroSection,
      infoBanner: editingContent.infoBanner,
      imageHighlight: editingContent.imageHighlight,
      menuSection: editingContent.menuSection
    })
    
    if (success) {
      alert('Contenu mis à jour avec succès !')
    } else {
      alert('Erreur lors de la mise à jour')
    }
    setSaving(false)
  }

  const addMenuItem = () => {
    const newItem: MenuItem = {
      name: 'Nouveau plat',
      category: 'entree',
      description: 'Description du plat',
      price: '0€'
    }
    setEditingContent(prev => ({
      ...prev,
      menuSection: {
        ...prev.menuSection!,
        items: [...(prev.menuSection?.items || []), newItem]
      }
    }))
  }

  const removeMenuItem = (index: number) => {
    setEditingContent(prev => ({
      ...prev,
      menuSection: {
        ...prev.menuSection!,
        items: prev.menuSection?.items.filter((_, i) => i !== index) || []
      }
    }))
  }

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    setEditingContent(prev => ({
      ...prev,
      menuSection: {
        ...prev.menuSection!,
        items: prev.menuSection?.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ) || []
      }
    }))
  }

  if (loading || !editingContent.heroSection) {
    return <div>Chargement...</div>
  }

  const tabs = [
    { id: 'hero', label: 'Section Hero' },
    { id: 'info', label: 'Bannière Info' },
    { id: 'image', label: 'Image Highlight' },
    { id: 'menu', label: 'Menu' }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Éditeur de contenu</h2>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-green-600 hover:bg-green-700"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Hero */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Section Hero</h3>
          <div>
            <Label htmlFor="hero-title">Titre</Label>
            <Input
              id="hero-title"
              value={editingContent.heroSection?.title || ''}
              onChange={(e) => setEditingContent(prev => ({
                ...prev,
                heroSection: { ...prev.heroSection!, title: e.target.value }
              }))}
              placeholder="Chez nous,"
            />
          </div>
          <div>
            <Label htmlFor="hero-subtitle">Sous-titre</Label>
            <Input
              id="hero-subtitle"
              value={editingContent.heroSection?.subtitle || ''}
              onChange={(e) => setEditingContent(prev => ({
                ...prev,
                heroSection: { ...prev.heroSection!, subtitle: e.target.value }
              }))}
              placeholder="il y en a pour "
            />
          </div>
          <div>
            <Label htmlFor="hero-highlight">Texte en évidence</Label>
            <Input
              id="hero-highlight"
              value={editingContent.heroSection?.highlightText || ''}
              onChange={(e) => setEditingContent(prev => ({
                ...prev,
                heroSection: { ...prev.heroSection!, highlightText: e.target.value }
              }))}
              placeholder="tous les goûts"
            />
          </div>
        </div>
      )}

      {/* Bannière Info */}
      {activeTab === 'info' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bannière d'information</h3>
          <div>
            <Label htmlFor="info-text">Texte</Label>
            <textarea
              id="info-text"
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={editingContent.infoBanner?.text || ''}
              onChange={(e) => setEditingContent(prev => ({
                ...prev,
                infoBanner: { ...prev.infoBanner!, text: e.target.value }
              }))}
              placeholder="Votre texte d'information..."
            />
          </div>
        </div>
      )}

      {/* Image Highlight */}
      {activeTab === 'image' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Image Highlight</h3>
          <div>
            <Label htmlFor="main-color">Couleur principale</Label>
            <Input
              id="main-color"
              type="color"
              value={editingContent.imageHighlight?.mainColor || '#ef4444'}
              onChange={(e) => setEditingContent(prev => ({
                ...prev,
                imageHighlight: { ...prev.imageHighlight!, mainColor: e.target.value }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="overlay-color">Couleur de superposition</Label>
            <Input
              id="overlay-color"
              type="color"
              value={editingContent.imageHighlight?.overlayColor || '#ef4444'}
              onChange={(e) => setEditingContent(prev => ({
                ...prev,
                imageHighlight: { ...prev.imageHighlight!, overlayColor: e.target.value }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="opacity">Opacité (%)</Label>
            <Input
              id="opacity"
              type="number"
              min="0"
              max="100"
              value={editingContent.imageHighlight?.opacity || 30}
              onChange={(e) => setEditingContent(prev => ({
                ...prev,
                imageHighlight: { ...prev.imageHighlight!, opacity: parseInt(e.target.value) }
              }))}
            />
          </div>
        </div>
      )}

      {/* Menu */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Section Menu</h3>
          
          {/* Titre et description du menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="menu-title">Titre</Label>
              <Input
                id="menu-title"
                value={editingContent.menuSection?.title || ''}
                onChange={(e) => setEditingContent(prev => ({
                  ...prev,
                  menuSection: { ...prev.menuSection!, title: e.target.value }
                }))}
                placeholder="Découvrez "
              />
            </div>
            <div>
              <Label htmlFor="menu-highlight">Texte en évidence</Label>
              <Input
                id="menu-highlight"
                value={editingContent.menuSection?.highlightText || ''}
                onChange={(e) => setEditingContent(prev => ({
                  ...prev,
                  menuSection: { ...prev.menuSection!, highlightText: e.target.value }
                }))}
                placeholder="notre menu."
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="menu-description">Description</Label>
            <textarea
              id="menu-description"
              className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={editingContent.menuSection?.description || ''}
              onChange={(e) => setEditingContent(prev => ({
                ...prev,
                menuSection: { ...prev.menuSection!, description: e.target.value }
              }))}
              placeholder="Description du menu..."
            />
          </div>

          {/* Items du menu */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-semibold">Items du menu</h4>
              <Button onClick={addMenuItem} className="bg-blue-600 hover:bg-blue-700">
                Ajouter un plat
              </Button>
            </div>
            
            <div className="space-y-4">
              {editingContent.menuSection?.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Nom</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                        placeholder="Nom du plat"
                      />
                    </div>
                    <div>
                      <Label>Catégorie</Label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={item.category}
                        onChange={(e) => updateMenuItem(index, 'category', e.target.value as any)}
                      >
                        <option value="entree">Entrée</option>
                        <option value="plat">Plat</option>
                        <option value="dessert">Dessert</option>
                      </select>
                    </div>
                    <div>
                      <Label>Prix</Label>
                      <Input
                        value={item.price}
                        onChange={(e) => updateMenuItem(index, 'price', e.target.value)}
                        placeholder="0€"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={() => removeMenuItem(index)}
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label>Description</Label>
                    <textarea
                      className="w-full min-h-[60px] p-2 border border-gray-300 rounded-md"
                      value={item.description}
                      onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                      placeholder="Description du plat"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 