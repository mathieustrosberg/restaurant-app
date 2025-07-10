"use client"

import { useState, useEffect } from 'react'
import { Save, FileText, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useContent } from '@/lib/hooks/useContent'
import { PageContent } from '@/lib/content'

export default function ContentEditor() {
  const { content, loading, updateContent } = useContent()
  const [editingContent, setEditingContent] = useState<Partial<PageContent>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (content) {
      setEditingContent(content)
    }
  }, [content])

  const handleSave = async () => {
    if (!editingContent.heroSection || !editingContent.infoBanner || !editingContent.imageHighlight) {
      alert('Veuillez remplir tous les champs requis')
      return
    }

    setSaving(true)
    const success = await updateContent({
      heroSection: editingContent.heroSection,
      infoBanner: editingContent.infoBanner,
      imageHighlight: editingContent.imageHighlight,
      menuSection: content?.menuSection || {
        title: "Découvrez ",
        subtitle: "",
        highlightText: "notre menu.",
        description: "Notre menu sera géré dans la section Menu dédiée.",
        items: []
      }
    })
    
    if (success) {
      alert('Contenu mis à jour avec succès !')
    } else {
      alert('Erreur lors de la mise à jour')
    }
    setSaving(false)
  }

  if (loading || !editingContent.heroSection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Éditeur de contenu</h2>
          <p className="text-muted-foreground">
            Modifiez le contenu de votre site web en temps réel
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero" className="gap-2">
            <FileText className="h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2">
            <FileText className="h-4 w-4" />
            Info
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-2">
            <Palette className="h-4 w-4" />
            Image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Section Hero
              </CardTitle>
              <CardDescription>
                Configurez le titre principal de votre page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Titre principal</Label>
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
                <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Aperçu</h4>
                <p className="text-lg">
                  {editingContent.heroSection?.title || 'Chez nous,'}{' '}
                  {editingContent.heroSection?.subtitle || 'il y en a pour '}
                  <span className="font-semibold text-primary">
                    {editingContent.heroSection?.highlightText || 'tous les goûts'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Bannière d'information
              </CardTitle>
              <CardDescription>
                Texte de présentation de votre restaurant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="info-text">Texte d'information</Label>
                <Textarea
                  id="info-text"
                  rows={6}
                  value={editingContent.infoBanner?.text || ''}
                  onChange={(e) => setEditingContent(prev => ({
                    ...prev,
                    infoBanner: { ...prev.infoBanner!, text: e.target.value }
                  }))}
                  placeholder="Votre texte d'information..."
                />
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Aperçu</h4>
                <p className="text-sm text-muted-foreground">
                  {editingContent.infoBanner?.text || 'Votre texte apparaîtra ici...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Section Image Highlight
              </CardTitle>
              <CardDescription>
                Configurez les couleurs et l'apparence de la section visuelle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="main-color">Couleur principale</Label>
                  <div className="flex gap-2">
                    <Input
                      id="main-color"
                      type="color"
                      value={editingContent.imageHighlight?.mainColor || '#ef4444'}
                      onChange={(e) => setEditingContent(prev => ({
                        ...prev,
                        imageHighlight: { ...prev.imageHighlight!, mainColor: e.target.value }
                      }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={editingContent.imageHighlight?.mainColor || '#ef4444'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingContent(prev => ({
                        ...prev,
                        imageHighlight: { ...prev.imageHighlight!, mainColor: e.target.value }
                      }))}
                      placeholder="#ef4444"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overlay-color">Couleur de superposition</Label>
                  <div className="flex gap-2">
                    <Input
                      id="overlay-color"
                      type="color"
                      value={editingContent.imageHighlight?.overlayColor || '#ef4444'}
                      onChange={(e) => setEditingContent(prev => ({
                        ...prev,
                        imageHighlight: { ...prev.imageHighlight!, overlayColor: e.target.value }
                      }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={editingContent.imageHighlight?.overlayColor || '#ef4444'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingContent(prev => ({
                        ...prev,
                        imageHighlight: { ...prev.imageHighlight!, overlayColor: e.target.value }
                      }))}
                      placeholder="#ef4444"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opacity">Opacité (%)</Label>
                  <Input
                    id="opacity"
                    type="number"
                    min="0"
                    max="100"
                    value={editingContent.imageHighlight?.opacity || 30}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingContent(prev => ({
                      ...prev,
                      imageHighlight: { ...prev.imageHighlight!, opacity: parseInt(e.target.value) || 30 }
                    }))}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Aperçu des couleurs</h4>
                <div className="flex gap-4">
                  <div 
                    className="w-16 h-16 rounded border"
                    style={{ backgroundColor: editingContent.imageHighlight?.mainColor }}
                  />
                  <div 
                    className="w-16 h-16 rounded border"
                    style={{ backgroundColor: editingContent.imageHighlight?.overlayColor }}
                  />
                  <div className="flex items-center">
                    <Badge variant="secondary">
                      Opacité: {editingContent.imageHighlight?.opacity || 30}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
              <CardDescription>
                Gestion du menu déplacée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Menu géré séparément</h4>
                </div>
                <p className="text-sm text-blue-800">
                  La gestion des plats du menu a été déplacée vers la section <strong>"Menu"</strong> de la sidebar pour une meilleure organisation.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Utilisez la navigation latérale pour accéder à la gestion complète du menu par catégories.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 