"use client"

import { useState } from 'react'
import { Mail, Users, Send, Settings, Download, Filter, Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Données fictives pour la démonstration
const mockSubscribers = [
  { id: 1, email: 'client1@email.com', status: 'active', subscribedAt: '2024-01-15' },
  { id: 2, email: 'client2@email.com', status: 'active', subscribedAt: '2024-01-10' },
  { id: 3, email: 'client3@email.com', status: 'pending', subscribedAt: '2024-01-20' },
]

const mockCampaigns = [
  { id: 1, subject: 'Nouveau menu d\'hiver', status: 'sent', sentAt: '2024-01-15', opens: 85, clicks: 23 },
  { id: 2, subject: 'Offre spéciale Saint-Valentin', status: 'draft', createdAt: '2024-01-20' },
]

export default function NewsletterManager() {
  const [activeTab, setActiveTab] = useState('overview')
  const [newSubscriber, setNewSubscriber] = useState('')
  const [newCampaign, setNewCampaign] = useState({
    subject: '',
    content: '',
    scheduledAt: ''
  })

  const handleAddSubscriber = () => {
    if (newSubscriber.trim() && newSubscriber.includes('@')) {
      // TODO: Ajouter à la base de données
      console.log('Ajouter subscriber:', newSubscriber)
      setNewSubscriber('')
      alert('Abonné ajouté avec succès !')
    } else {
      alert('Veuillez entrer une adresse email valide')
    }
  }

  const handleSaveCampaign = () => {
    if (newCampaign.subject.trim() && newCampaign.content.trim()) {
      // TODO: Sauvegarder en base de données
      console.log('Sauvegarder campagne:', newCampaign)
      alert('Campagne sauvegardée avec succès !')
    } else {
      alert('Veuillez remplir tous les champs requis')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestion Newsletter</h2>
        <p className="text-muted-foreground">
          Gérez vos abonnés et créez des campagnes email pour votre restaurant
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Mail className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="gap-2">
            <Users className="h-4 w-4" />
            Abonnés
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="gap-2">
            <Send className="h-4 w-4" />
            Campagnes
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Abonnés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockSubscribers.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux d'ouverture</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  +5% vs mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campagnes envoyées</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">
                  Ce mois-ci
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux abonnés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Cette semaine
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dernières activités</CardTitle>
              <CardDescription>Activités récentes de votre newsletter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Campagne "Nouveau menu d'hiver" envoyée
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Il y a 5 jours - 85% d'ouverture
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      2 nouveaux abonnés
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cette semaine
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des abonnés</CardTitle>
                  <CardDescription>
                    Ajoutez et gérez vos abonnés à la newsletter
                  </CardDescription>
                </div>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="email@exemple.com"
                  value={newSubscriber}
                  onChange={(e) => setNewSubscriber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubscriber()}
                  className="flex-1"
                />
                <Button onClick={handleAddSubscriber} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Email</span>
                  <span>Statut</span>
                  <span>Date d'inscription</span>
                  <span>Actions</span>
                </div>
                {mockSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">{subscriber.email}</span>
                    <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                      {subscriber.status === 'active' ? 'Actif' : 'En attente'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle campagne</CardTitle>
                <CardDescription>
                  Créez une nouvelle campagne email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-subject">Sujet de l'email</Label>
                  <Input
                    id="campaign-subject"
                    placeholder="Sujet de votre campagne..."
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaign-content">Contenu</Label>
                  <Textarea
                    id="campaign-content"
                    placeholder="Contenu de votre email..."
                    rows={6}
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-schedule">Programmer l'envoi (optionnel)</Label>
                  <Input
                    id="campaign-schedule"
                    type="datetime-local"
                    value={newCampaign.scheduledAt}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveCampaign} className="flex-1">
                    Sauvegarder brouillon
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Send className="h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campagnes existantes</CardTitle>
                <CardDescription>
                  Gérez vos campagnes précédentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{campaign.subject}</h4>
                        <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                          {campaign.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                        </Badge>
                      </div>
                      {campaign.status === 'sent' ? (
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{campaign.opens}% ouvertures</span>
                          <span>{campaign.clicks}% clics</span>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">Modifier</Button>
                          <Button size="sm" className="gap-1">
                            <Send className="h-3 w-3" />
                            Envoyer
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la newsletter</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de votre newsletter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg text-center">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">Paramètres de configuration</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cette section sera développée lors de l'intégration du service email
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom de l'expéditeur</Label>
                  <Input placeholder="Loon Garden Restaurant" disabled />
                </div>
                
                <div className="space-y-2">
                  <Label>Email expéditeur</Label>
                  <Input placeholder="newsletter@loon-garden.com" disabled />
                </div>
                
                <div className="space-y-2">
                  <Label>Réponse automatique</Label>
                  <Textarea 
                    placeholder="Message de bienvenue pour les nouveaux abonnés..." 
                    rows={3}
                    disabled 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 