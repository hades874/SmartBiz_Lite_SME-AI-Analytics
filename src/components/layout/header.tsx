
'use client';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Search, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import React from "react";
import { useLanguage, strings } from "@/context/language-context";


function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
}

export function Header() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const { language, setLanguage } = useLanguage();
    const t = strings[language];

    const getPageTitle = (segment: string) => {
        switch (segment) {
            case 'dashboard':
                return t.dashboard;
            case 'forecast':
                return t.salesForecasting;
            case 'inventory':
                return t.inventory;
            case 'cashflow':
                return t.cashFlow;
            case 'customers':
                return t.customers;
            case 'reports':
                return t.reports;
            case 'agent':
                return t.aiAgent;
            case 'settings':
                return t.settings;
            default:
                return toTitleCase(segment);
        }
    }

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/dashboard">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {segments.map((segment, index) => (
                             <React.Fragment key={segment}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                {index === segments.length - 1 ? (
                                    <BreadcrumbPage>{getPageTitle(segment)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={`/${segments.slice(0, index + 1).join('/')}`}>
                                            {getPageTitle(segment)}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                                </BreadcrumbItem>
                             </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
                    />
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <text x="3" y="18" fontSize="14" fontWeight="bold">A</text>
                                <text x="13" y="18" fontSize="14" fontWeight="bold">অ</text>
                            </svg>
                            <span className="sr-only">Toggle language</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setLanguage('en')}>English</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setLanguage('bn')}>বাংলা</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </div>
        </header>
    )
}
