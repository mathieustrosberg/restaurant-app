"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Settings, 
  ChefHat, 
  Calendar,
  Mail,
  Upload,
  Trash2,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Plus,
  Home,
  Menu as MenuIcon,
  LogOut
} from "lucide-react";

type Service = "lunch" | "dinner";

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELED";

type Reservation = {
  id: number; name: string; email: string; phone: string;
  date: string; time: string; service: Service; people: number; notes?: string;
  status: ReservationStatus;
};

type Subscriber = { id: number; email: string };

type Contact = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED";
  response?: string;
  createdAt: string;
};

type MenuItem = {
  name: string;
  description: string;
  price: string;
};

type MenuCategory = {
  category: string;
  items: MenuItem[];
};

// Sidebar navigation items
const items = [
  {
    title: "Contenu",
    value: "content",
    icon: Settings,
  },
  {
    title: "Menu",
    value: "menu", 
    icon: ChefHat,
  },
  {
    title: "Réservations",
    value: "reservations",
    icon: Calendar,
  },
  {
    title: "Newsletter",
    value: "newsletter",
    icon: Mail,
  },
  {
    title: "Messages",
    value: "contact",
    icon: MessageSquare,
  },
];

export default function DashboardPage() {
  /* ===== States ===== */
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("content");
  const [siteTitle, setSiteTitle] = useState("Mon Restaurant");
  const [siteIntro, setSiteIntro] = useState("Bienvenue dans notre restaurant");
  const [siteImage, setSiteImage] = useState("/image.jpg");
  const [imageUploadMsg, setImageUploadMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<"entrees" | "plats" | "desserts">("entrees");
  const [menuSaveMsg, setMenuSaveMsg] = useState("");

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newEmail, setNewEmail] = useState("");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [responseText, setResponseText] = useState("");

  /* ===== Functions ===== */
  async function handleLogout() {
    try {
      await authClient.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
  const loadContent = useCallback(async (): Promise<void> => {
    const res = await fetch("/api/content/home", { cache: "no-store" });
    if (!res.ok) return;
    const doc = await res.json();
    type Section = { type: string; value?: Record<string, unknown> };
    const sections: Section[] = Array.isArray(doc?.sections) ? doc.sections : [];
    const title = (sections.find((s)=>s.type==="title")?.value as { text?: string } | undefined)?.text ?? "Mon Restaurant";
    const paragraph = (sections.find((s)=>s.type==="paragraph")?.value as { text?: string } | undefined)?.text ?? "Bienvenue dans notre restaurant";
    const image = (sections.find((s)=>s.type==="image")?.value as { src?: string } | undefined)?.src ?? "/image.jpg";
    setSiteTitle(title); setSiteIntro(paragraph); setSiteImage(image);
  }, []);

  async function saveContent(): Promise<void> {
    const sections = [
      { type: "title", value: { text: siteTitle } },
      { type: "paragraph", value: { text: siteIntro } },
      { type: "image", value: { src: siteImage, alt: "Image" } },
    ];
    const res = await fetch("/api/content/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections })
    });
    if (res.ok) {
      setImageUploadMsg("Contenu sauvegardé avec succès !");
      setTimeout(() => setImageUploadMsg(""), 3000);
    }
  }

  async function loadMenu(): Promise<void> {
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMenuData(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du menu:", error);
    }
  }

  async function saveMenu(): Promise<void> {
    const category = menuData.find(cat => cat.category === selectedMenuCategory);
    if (!category) return;

    const res = await fetch("/api/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category)
    });
    
    if (res.ok) {
      setMenuSaveMsg("Menu sauvegardé avec succès !");
      setTimeout(() => setMenuSaveMsg(""), 3000);
    }
  }

  async function loadReservations(): Promise<void> {
    const res = await fetch("/api/reservations", { cache: "no-store" });
    if (res.ok) setReservations(await res.json());
  }

  async function updateReservationStatus(id: number, status: ReservationStatus): Promise<void> {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        loadReservations();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation:", error);
    }
  }

  async function deleteReservation(id: number): Promise<void> {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadReservations();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation:", error);
    }
  }

  async function loadSubscribers(): Promise<void> {
    const res = await fetch("/api/newsletter", { cache: "no-store" });
    if (res.ok) setSubscribers(await res.json());
  }

  async function addSubscriber(): Promise<void> {
    if (!newEmail) return;
    const res = await fetch("/api/newsletter", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email: newEmail }) });
    if (res.status === 201) { 
      setNewEmail(""); 
      loadSubscribers(); 
    }
  }

  async function deleteSubscriber(id:number): Promise<void> {
    const res = await fetch(`/api/newsletter/${id}`, { method:"DELETE" });
    if (res.ok) loadSubscribers();
  }

  async function loadContacts(): Promise<void> {
    const res = await fetch("/api/contact", { cache: "no-store" });
    if (res.ok) setContacts(await res.json());
  }

  async function updateContactStatus(id: number, status: "NEW" | "READ" | "REPLIED", response?: string): Promise<void> {
    const updateData: { status: string; response?: string } = { status };
    if (response !== undefined) updateData.response = response;

    const res = await fetch(`/api/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      loadContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(null);
        setResponseText("");
      }
    }
  }

  async function deleteContact(id: number): Promise<void> {
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(null);
        setResponseText("");
      }
    }
  }

  function openContactDetails(contact: Contact) {
    setSelectedContact(contact);
    setResponseText(contact.response || "");
    
    if (contact.status === "NEW") {
      updateContactStatus(contact.id, "READ");
    }
  }

  async function sendResponse() {
    if (!selectedContact || !responseText.trim()) return;
    await updateContactStatus(selectedContact.id, "REPLIED", responseText.trim());
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImageUploadMsg("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        setImageUploadMsg(error.error || "Erreur lors de l'upload");
        return;
      }

      const uploadData = await uploadRes.json();
      const newImageUrl = uploadData.url;

      setSiteImage(newImageUrl);
      await saveContentWithImage(newImageUrl);

      setImageUploadMsg("Image uploadée et sauvegardée avec succès !");
      setTimeout(() => setImageUploadMsg(""), 3000);

    } catch (error) {
      setImageUploadMsg("Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
    }
  }

  async function saveContentWithImage(imageUrl: string): Promise<void> {
    const sections = [
      { type: "title", value: { text: siteTitle } },
      { type: "paragraph", value: { text: siteIntro } },
      { type: "image", value: { src: imageUrl } }
    ];
    await fetch("/api/content/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections })
    });
  }

  useEffect(() => {
    loadContent();
    loadMenu();
    loadReservations();
    loadSubscribers();
    loadContacts();
  }, [loadContent]);

  const getContactStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="default" className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />Nouveau</Badge>;
      case "READ":
        return <Badge variant="secondary"><Eye className="w-3 h-3 mr-1" />Lu</Badge>;
      case "REPLIED":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Répondu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReservationStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="default" className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case "CONFIRMED":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmée</Badge>;
      case "CANCELED":
        return <Badge variant="destructive"><Trash2 className="w-3 h-3 mr-1" />Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const AppSidebar = () => (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <ChefHat className="w-6 h-6" />
          <span className="font-semibold">Restaurant Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection(item.value)}
                    isActive={activeSection === item.value}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => window.open('/', '_blank')}>
            <Home className="w-4 h-4 mr-2" />
            Voir le site
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "content":
        return (
          <div className="space-y-6">
        <div>
              <h2 className="text-2xl font-bold tracking-tight">Gestion du contenu</h2>
              <p className="text-muted-foreground">Modifiez le titre, la description et l&apos;image de votre page d&apos;accueil</p>
        </div>
            
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Titre du site</label>
                      <Input
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                        placeholder="Nom de votre restaurant"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={siteIntro}
                        onChange={(e) => setSiteIntro(e.target.value)}
                        placeholder="Description de votre restaurant"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">URL de l&apos;image</label>
                      <Input
                        value={siteImage}
                        onChange={(e) => setSiteImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Uploader une image</label>
                      <div className="mt-2">
                        <label className="cursor-pointer">
                          <div className="flex items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {isUploading ? "Upload en cours..." : "Choisir une image"}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {siteImage && (
                      <div>
                        <label className="text-sm font-medium">Aperçu</label>
                        <img 
                          src={siteImage} 
                          alt="Aperçu" 
                          className="w-full h-32 object-cover rounded-lg border mt-2" 
                        />
                      </div>
                    )}
                  </div>
                </div>

                {imageUploadMsg && (
                  <div className={`p-3 rounded-lg text-sm ${
                    imageUploadMsg.includes("succès") 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {imageUploadMsg}
                  </div>
                )}

                <Button onClick={saveContent} className="w-full md:w-auto">
                  Sauvegarder les modifications
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "menu":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Gestion du menu</h2>
              <p className="text-muted-foreground">Modifiez les plats de votre restaurant par catégorie</p>
            </div>

            <Card>
              <CardContent className="space-y-6 pt-6">
                <Select value={selectedMenuCategory} onValueChange={(value: "entrees" | "plats" | "desserts") => setSelectedMenuCategory(value)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrees">Entrées</SelectItem>
                    <SelectItem value="plats">Plats</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-4">
                  {menuData.find(cat => cat.category === selectedMenuCategory)?.items.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Nom du plat"
                          value={item.name}
                          onChange={(e) => {
                            const newMenuData = menuData.map(cat => {
                              if (cat.category === selectedMenuCategory) {
                                const newItems = [...cat.items];
                                newItems[index] = { ...item, name: e.target.value };
                                return { ...cat, items: newItems };
                              }
                              return cat;
                            });
                            setMenuData(newMenuData);
                          }}
                        />
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => {
                            const newMenuData = menuData.map(cat => {
                              if (cat.category === selectedMenuCategory) {
                                const newItems = [...cat.items];
                                newItems[index] = { ...item, description: e.target.value };
                                return { ...cat, items: newItems };
                              }
                              return cat;
                            });
                            setMenuData(newMenuData);
                          }}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Prix"
                            value={item.price}
                            onChange={(e) => {
                              const newMenuData = menuData.map(cat => {
                                if (cat.category === selectedMenuCategory) {
                                  const newItems = [...cat.items];
                                  newItems[index] = { ...item, price: e.target.value };
                                  return { ...cat, items: newItems };
                                }
                                return cat;
                              });
                              setMenuData(newMenuData);
                            }}
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              const newMenuData = menuData.map(cat => {
                                if (cat.category === selectedMenuCategory) {
                                  const newItems = cat.items.filter((_, i) => i !== index);
                                  return { ...cat, items: newItems };
                                }
                                return cat;
                              });
                              setMenuData(newMenuData);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
        </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    const newMenuData = menuData.map(cat => {
                      if (cat.category === selectedMenuCategory) {
                        return {
                          ...cat,
                          items: [...cat.items, { name: "", description: "", price: "" }]
                        };
                      }
                      return cat;
                    });
                    setMenuData(newMenuData);
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un plat
                </Button>

                {menuSaveMsg && (
                  <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                    {menuSaveMsg}
                  </div>
                )}

                <Button onClick={saveMenu} className="w-full md:w-auto">
                  Sauvegarder le menu
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "reservations":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Réservations ({reservations.length})</h2>
              <p className="text-muted-foreground">Gérez les réservations de votre restaurant</p>
            </div>

            {/* Vue Desktop - Tableau */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Date & Heure</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Personnes</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="w-[200px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground">
                            Aucune réservation
                          </TableCell>
                        </TableRow>
                      ) : (
                        reservations.map((res) => (
                          <TableRow key={res.id}>
                            <TableCell className="font-medium">{res.name}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{res.email}</div>
                                <div className="text-muted-foreground">{res.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{new Date(res.date).toLocaleDateString('fr-FR')}</div>
                                <div className="text-muted-foreground">{res.time}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={res.service === "lunch" ? "default" : "secondary"}>
                                {res.service === "lunch" ? "Déjeuner" : "Dîner"}
                              </Badge>
                            </TableCell>
                            <TableCell>{res.people}</TableCell>
                            <TableCell>
                              {getReservationStatusBadge(res.status)}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">{res.notes || "-"}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {res.status === "PENDING" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => updateReservationStatus(res.id, "CONFIRMED")}
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => updateReservationStatus(res.id, "CANCELED")}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                {res.status === "CONFIRMED" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateReservationStatus(res.id, "CANCELED")}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                                {res.status === "CANCELED" && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Supprimer cette réservation ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cette action est irréversible. La réservation sera définitivement supprimée.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteReservation(res.id)}>
                                          Supprimer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Vue Mobile/Tablet - Cartes */}
            <div className="lg:hidden space-y-4">
              {reservations.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Aucune réservation
                  </CardContent>
                </Card>
              ) : (
                reservations.map((res) => (
                  <Card key={res.id} className="overflow-hidden">
                    <CardContent className="p-4 space-y-4">
                      {/* En-tête avec nom et statut */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{res.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={res.service === "lunch" ? "default" : "secondary"} className="text-xs">
                              {res.service === "lunch" ? "Déjeuner" : "Dîner"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{res.people} pers.</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getReservationStatusBadge(res.status)}
                        </div>
                      </div>

                      <Separator />

                      {/* Informations principales */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Date & Heure :</span>
                            <div className="mt-1">
                              <div>{new Date(res.date).toLocaleDateString('fr-FR')}</div>
                              <div className="text-muted-foreground">{res.time}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Contact :</span>
                            <div className="mt-1">
                              <div>{res.email}</div>
                              <div className="text-muted-foreground">{res.phone}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {res.notes && (
                        <div className="text-sm">
                          <span className="font-medium text-muted-foreground">Notes :</span>
                          <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                            {res.notes}
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 justify-end">
                        {res.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                              onClick={() => updateReservationStatus(res.id, "CONFIRMED")}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Confirmer
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1 sm:flex-none"
                              onClick={() => updateReservationStatus(res.id, "CANCELED")}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Refuser
                            </Button>
                          </>
                        )}
                        {res.status === "CONFIRMED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReservationStatus(res.id, "CANCELED")}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Annuler
                          </Button>
                        )}
                        {res.status === "CANCELED" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cette réservation ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. La réservation sera définitivement supprimée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteReservation(res.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );

      case "newsletter":
        return (
          <div className="space-y-6">
          <div>
              <h2 className="text-2xl font-bold tracking-tight">Newsletter ({subscribers.length} abonnés)</h2>
              <p className="text-muted-foreground">Gérez les abonnés à votre newsletter</p>
            </div>

            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Ajouter un email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addSubscriber}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                          Aucun abonné
                        </TableCell>
                      </TableRow>
                    ) : (
                      subscribers.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell>{sub.email}</TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer cet abonné ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible. L&apos;abonné sera définitivement supprimé.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteSubscriber(sub.id)}>
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Messages de contact ({contacts.length})</h2>
              <p className="text-muted-foreground">Messages reçus via le formulaire de contact</p>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Messages List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Messages ({contacts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {contacts.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        Aucun message reçu
                      </div>
                    ) : (
                      contacts.map((contact) => (
                        <Card 
                          key={contact.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedContact?.id === contact.id ? "bg-blue-50 border-blue-200" : ""
                          }`}
                          onClick={() => openContactDetails(contact)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium truncate">{contact.name}</h4>
                              {getContactStatusBadge(contact.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{contact.email}</p>
                            <p className="text-sm font-medium mb-2 truncate">{contact.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(contact.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Message Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails du message</CardTitle>
                  <CardDescription>
                    {selectedContact ? "Voir et répondre au message" : "Sélectionnez un message"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedContact ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">De :</label>
                          <p className="text-sm">{selectedContact.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email :</label>
                          <p className="text-sm">{selectedContact.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Sujet :</label>
                          <p className="text-sm">{selectedContact.subject}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Date :</label>
                          <p className="text-sm">
                            {new Date(selectedContact.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
        </div>

                      <Separator />

                      <div>
                        <label className="text-sm font-medium">Message :</label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                          {selectedContact.message}
                        </div>
        </div>

                      {selectedContact.response && (
                        <>
                          <Separator />
                          <div>
                            <label className="text-sm font-medium">Réponse envoyée :</label>
                            <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm border border-green-200">
                              {selectedContact.response}
                            </div>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div>
                        <label className="text-sm font-medium">
                          {selectedContact.status === "REPLIED" ? "Modifier la réponse :" : "Répondre :"}
                        </label>
                        <Textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Votre réponse..."
                          rows={4}
                          className="mt-2"
                        />
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={sendResponse}
                            disabled={!responseText.trim()}
                            className="flex-1"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {selectedContact.status === "REPLIED" ? "Modifier" : "Envoyer"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Le message sera définitivement supprimé.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteContact(selectedContact.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Sélectionnez un message pour voir les détails
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center gap-2 border-b bg-background px-4 py-3 lg:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <MenuIcon className="w-4 h-4" />
              <span className="font-semibold">Dashboard</span>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
        </div>
    </main>
      </div>
    </SidebarProvider>
  );
}