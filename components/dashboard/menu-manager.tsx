"use client"

import { useState, useEffect } from 'react'
import { ChefHat, Plus, Trash2, Edit, Save, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useContent } from '@/lib/hooks/useContent'
import { MenuItem } from '@/lib/content'

/**
 * Configuration des catégories de menu avec leurs couleurs d'affichage
 */
const CATEGORIES = [
  { key: 'entree', label: 'Entrées', color: 'bg-green-100 text-green-800' },
  { key: 'plat', label: 'Plats principaux', color: 'bg-blue-100 text-blue-800' },
  { key: 'dessert', label: 'Desserts', color: 'bg-purple-100 text-purple-800' },
] as const

type CategoryKey = 'entree' | 'plat' | 'dessert'

/**
 * Composant de gestion complète du menu du restaurant
 * 
 * Fonctionnalités :
 * - Organisation par catégories (Entrées, Plats, Desserts)
 * - Ajout, modification et suppression de plats
 * - Vue d'ensemble avec statistiques
 * - Interface par onglets pour chaque catégorie
 * - Sauvegarde automatique en base MongoDB
 * 
 * @returns JSX.Element Composant de gestion du menu
 */
export default function MenuManager() {
  const { content, loading, updateContent } = useContent()
  const [activeTab, setActiveTab] = useState<'overview' | CategoryKey>('overview')
  const [editingItem, setEditingItem] = useState<{index: number, item: MenuItem} | null>(null)
  const [newItem, setNewItem] = useState<MenuItem>({
    name: '',
    category: 'entree',
    description: '',
    price: ''
  })
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const menuItems = content?.menuSection?.items || []
  
  /**
   * Filtre les items de menu par catégorie
   * @param category - Catégorie à filtrer ('entree', 'plat', 'dessert')
   * @returns Array des items de la catégorie spécifiée
   */
  const getItemsByCategory = (category: CategoryKey) => {
    return menuItems.filter(item => item.category === category)
  }

  /**
   * Calcule les statistiques par catégorie (nombre d'items)
   * @returns Array des catégories avec leur nombre d'items
   */
  const getCategoryStats = () => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: getItemsByCategory(cat.key).length
    }))
  }

  /**
   * Sauvegarde un item de menu (ajout ou modification)
   * @param item - L'item de menu à sauvegarder
   * @param index - Index pour modification (optionnel pour ajout)
   */
  const handleSaveItem = async (item: MenuItem, index?: number) => {
    if (!content?.menuSection) return

    setSaving(true)
    let updatedItems = [...menuItems]
    
    if (index !== undefined) {
      // Modification d'un item existant
      updatedItems[index] = item
    } else {
      // Ajout d'un nouvel item
      updatedItems.push(item)
    }

    const { _id, updatedAt, ...contentWithoutId } = content
    const success = await updateContent({
      ...contentWithoutId,
      menuSection: {
        ...content.menuSection,
        items: updatedItems
      }
    })
    
    if (success) {
      setEditingItem(null)
      setIsAddingNew(false)
      setNewItem({ name: '', category: 'entree', description: '', price: '' })
    }
    setSaving(false)
  }

  /**
   * Supprime un item du menu après confirmation
   * @param index - Index de l'item à supprimer dans le tableau global
   */
  const handleDeleteItem = async (index: number) => {
    if (!content?.menuSection) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return

    setSaving(true)
    const updatedItems = menuItems.filter((_, i) => i !== index)
    
    const { _id, updatedAt, ...contentWithoutId } = content
    const success = await updateContent({
      ...contentWithoutId,
      menuSection: {
        ...content.menuSection,
        items: updatedItems
      }
    })
    setSaving(false)
  }

  /**
   * Active le mode édition pour un item existant
   * @param item - L'item à éditer
   * @param index - Index de l'item dans le tableau global
   */
  const handleStartEdit = (item: MenuItem, index: number) => {
    setEditingItem({ index, item: { ...item } })
    setIsAddingNew(false)
  }

  /**
   * Annule l'édition ou l'ajout en cours
   */
  const handleCancelEdit = () => {
    setEditingItem(null)
    setIsAddingNew(false)
  }

  /**
   * Active le mode ajout pour une catégorie spécifique
   * @param category - Catégorie pour le nouvel item
   */
  const handleStartAdd = (category: CategoryKey) => {
    setNewItem({ ...newItem, category })
    setIsAddingNew(true)
    setEditingItem(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
        </div>
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  /**
   * Rendu du formulaire d'édition/ajout d'un item de menu
   * @param item - Item à éditer ou template pour nouveau
   * @param onSave - Callback de sauvegarde
   * @param onCancel - Callback d'annulation
   * @returns JSX du formulaire
   */
  const renderItemForm = (item: MenuItem, onSave: (item: MenuItem) => void, onCancel: () => void) => (
    <Card className="border-dashed border-2">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nom du plat</Label>
            <Input
              value={item.name}
              onChange={(e) => {
                if (editingItem) {
                  setEditingItem(prev => prev ? {...prev, item: {...prev.item, name: e.target.value}} : null)
                } else {
                  setNewItem(prev => ({...prev, name: e.target.value}))
                }
              }}
              placeholder="Nom du plat"
            />
          </div>
          <div className="space-y-2">
            <Label>Prix</Label>
            <Input
              value={item.price}
              onChange={(e) => {
                if (editingItem) {
                  setEditingItem(prev => prev ? {...prev, item: {...prev.item, price: e.target.value}} : null)
                } else {
                  setNewItem(prev => ({...prev, price: e.target.value}))
                }
              }}
              placeholder="15€"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label>Description</Label>
          <Textarea
            rows={3}
            value={item.description}
            onChange={(e) => {
              if (editingItem) {
                setEditingItem(prev => prev ? {...prev, item: {...prev.item, description: e.target.value}} : null)
              } else {
                setNewItem(prev => ({...prev, description: e.target.value}))
              }
            }}
            placeholder="Description détaillée du plat..."
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={() => onSave(item)} 
            disabled={saving || !item.name.trim() || !item.price.trim()}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
          <Button variant="outline" onClick={onCancel} className="gap-2">
            <X className="h-4 w-4" />
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  /**
   * Rendu d'un item de menu en mode lecture avec actions d'édition/suppression
   * @param item - L'item de menu à afficher
   * @param index - Index de l'item pour les actions
   * @returns JSX de l'item
   */
  const renderMenuItem = (item: MenuItem, index: number) => (
    <Card key={index} className="transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <Badge className={CATEGORIES.find(cat => cat.key === item.category)?.color}>
                {CATEGORIES.find(cat => cat.key === item.category)?.label}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">{item.price}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartEdit(item, index)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(index)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestion du Menu</h2>
        <p className="text-muted-foreground">
          Organisez et gérez tous les plats de votre restaurant par catégories
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Eye className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          {CATEGORIES.map((category) => (
            <TabsTrigger key={category.key} value={category.key} className="gap-2">
              <ChefHat className="h-4 w-4" />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {getCategoryStats().map((category) => (
              <Card key={category.key} className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setActiveTab(category.key)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{category.label}</CardTitle>
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{category.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {category.count === 0 ? 'Aucun plat' : `${category.count} plat${category.count > 1 ? 's' : ''}`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Aperçu du menu complet</CardTitle>
              <CardDescription>
                Tous vos plats organisés par catégories - Total: {menuItems.length} plats
              </CardDescription>
            </CardHeader>
            <CardContent>
              {CATEGORIES.map((category) => {
                const items = getItemsByCategory(category.key)
                return (
                  <div key={category.key} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-lg">{category.label}</h3>
                      <Badge className={category.color}>{items.length}</Badge>
                    </div>
                    {items.length > 0 ? (
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <p className="text-sm text-muted-foreground">{item.description.slice(0, 80)}...</p>
                            </div>
                            <span className="font-bold text-primary">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Aucun plat dans cette catégorie</p>
                    )}
                    {category.key !== 'dessert' && <Separator className="mt-4" />}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {CATEGORIES.map((category) => (
          <TabsContent key={category.key} value={category.key} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {category.label}
                      <Badge className={category.color}>
                        {getItemsByCategory(category.key).length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Gérez les {category.label.toLowerCase()} de votre menu
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => handleStartAdd(category.key)} 
                    className="gap-2"
                    disabled={isAddingNew || editingItem !== null}
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter {category.key === 'entree' ? 'une entrée' : category.key === 'plat' ? 'un plat' : 'un dessert'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulaire d'ajout */}
                {isAddingNew && newItem.category === category.key && renderItemForm(
                  newItem,
                  (item) => handleSaveItem(item),
                  handleCancelEdit
                )}

                {/* Liste des items */}
                <div className="space-y-4">
                  {menuItems.map((item, globalIndex) => {
                    // Ne montrer que les items de la catégorie actuelle
                    if (item.category !== category.key) return null
                    
                    // Formulaire d'édition
                    if (editingItem && editingItem.index === globalIndex) {
                      return (
                        <div key={globalIndex}>
                          {renderItemForm(
                            editingItem.item,
                            (item) => handleSaveItem(item, editingItem.index),
                            handleCancelEdit
                          )}
                        </div>
                      )
                    }
                    
                    // Affichage normal
                    return renderMenuItem(item, globalIndex)
                  }).filter(Boolean)}
                  
                  {getItemsByCategory(category.key).length === 0 && !isAddingNew && (
                    <div className="text-center py-12 text-muted-foreground">
                      <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Aucun {category.key === 'entree' ? 'entrée' : category.key} dans cette catégorie</p>
                      <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 