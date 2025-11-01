
'use client'
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
    LayoutDashboard,
    BarChart3,
    Package,
    Banknote,
    Users2,
    FileText,
    Settings,
    Briefcase,
    LogOut,
    ChevronDown
} from "lucide-react"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/forecast", icon: BarChart3, label: "Sales Forecasting" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/cashflow", icon: Banknote, label: "Cash Flow" },
    { href: "/customers", icon: Users2, label: "Customers" },
    { href: "/reports", icon: FileText, label: "Reports" },
]

export function AppSidebar() {
    const pathname = usePathname()
    const userAvatar = PlaceHolderImages.find(p => p.id === 'avatar-1')

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <Briefcase className="w-8 h-8 text-primary" />
                    <span className="text-xl font-bold font-headline">SmartBiz Lite</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    tooltip={item.label}
                                >
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu className="p-2">
                     <SidebarMenuItem>
                        <Link href="/settings">
                            <SidebarMenuButton
                                isActive={pathname === '/settings'}
                                tooltip="Settings"
                            >
                                <Settings />
                                <span>Settings</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="p-2 border-t border-sidebar-border">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start h-auto p-2">
                                <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={userAvatar?.imageUrl} alt="Karim" />
                                    <AvatarFallback>K</AvatarFallback>
                                </Avatar>
                                <div className="text-left hidden group-data-[state=expanded]:block">
                                    <p className="text-sm font-medium">Karim Ahmed</p>
                                    <p className="text-xs text-muted-foreground">karim.a@example.com</p>
                                </div>
                                <ChevronDown className="ml-auto h-4 w-4 hidden group-data-[state=expanded]:block" />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 mb-2 ml-4">
                            <div className="p-1">
                                <Button variant="ghost" className="w-full justify-start">
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    Logout
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
