"use client"

import { Calendar, Home, Inbox, Search, Settings, FileText, Menu, ChefHat, Users, BarChart3, Mail } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Accueil",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Contenu",
    url: "/dashboard/content",
    icon: FileText,
  },
  {
    title: "Menu",
    url: "/dashboard/menu",
    icon: ChefHat,
  },
  {
    title: "Newsletter",
    url: "/dashboard/newsletter",
    icon: Mail,
  },
  {
    title: "Réservations",
    url: "/dashboard/reservations",
    icon: Calendar,
  },
  {
    title: "Statistiques",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
]

const settingsItems = [
  {
    title: "Paramètres",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function AppSidebar({ activeSection = "content", onSectionChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Loon Garden Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={item.title.toLowerCase() === activeSection}
                    onClick={() => onSectionChange?.(item.title.toLowerCase())}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={item.title.toLowerCase() === activeSection}
                    onClick={() => onSectionChange?.(item.title.toLowerCase())}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">
            Version 1.0.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
} 