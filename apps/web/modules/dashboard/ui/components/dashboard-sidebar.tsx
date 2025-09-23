'use client'
import { OrganizationSwitcher,UserButton } from "@clerk/nextjs"
import { Badge, CreditCardIcon,InboxIcon,LayoutDashboardIcon,LibraryBigIcon,Mic,PaletteIcon } from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupContent, SidebarGroupLabel, SidebarHeader,SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@workspace/ui/components/sidebar"

import { cn } from "@workspace/ui/lib/utils"
import { title } from "process"

const customerSupportItems=[
    {
        title:"Conversations",
        url:"/conversations",
        icon:InboxIcon,
    },{
        title:"Knowledge Base",
        url:"/files",
        icon:LibraryBigIcon

    }
];

const configurationItems=[
    {
        title:"Widget Custumization",
        url:"/customization",
        icon:PaletteIcon,
    },
    {
        title:"Integrations",
        url:"/integrations",
        icon:LayoutDashboardIcon,
    },
    {
        title: "Voice Assist",
        url:"/plugins/vapi",
        icon:Mic,
    }
]

const accountItems=[
    {
        title:"Plans & Billing",
        url:"/billing",
        icon:CreditCardIcon,
    }
]


export const DashboardSidebar=()=>{
    const pathname=usePathname()

    const isActive =(url:string)=>{
        if(url==="/"){
            return pathname === "/";
        }
        return pathname.startsWith(url);
    }

    return (
        <Sidebar className="group" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                            <OrganizationSwitcher hidePersonal skipInvitationScreen
                                appearance={{
                                    elements:{
                                        rootBox:'w-full! h-8!',
                                        avatarBox:"size-4! rounded-md!",
                                        organizationSwitcherTrigger:"w-full! justtify-start! group-data-[collapsible=icon]:size-8! group-data[collapsible=icon]:p-2!",
                                        organizationPreview:"group-data-[collapsible=icon]:justify-center! gap-2!",
                                        organizationPreviewTextContainer:"group-data-[collapsible=icon]:hidden! text-xs! font-medium! test-sidebar-foreground!",
                                        organizationSwitcherTriggerIcon:"group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!"
                                    }
                                }}
                            />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Customer support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {customerSupportItems.map((item)=>(
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)} size="lg">
                                        <Link href={item.url} className="mx-2 gap-4"><item.icon className="size-6"/><span>{item.title}</span></Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                                    
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu >
                            {configurationItems.map((item)=>(
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)} size="lg">
                                        <Link href={item.url} className="mx-2 gap-4"><item.icon className="size-6"/><span>{item.title}</span></Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                                    
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu >
                            {accountItems.map((item)=>(
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)} size="lg">
                                        <Link href={item.url} className="mx-2 gap-4"><item.icon className="size-8"/><span>{item.title}</span></Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                                    
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                            <UserButton showName 
                             appearance={{
                                elements:{
                                    rootBox:"w-full! h-8!",
                                    userButtonTrigger:"w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                                    userButtonBox:"w-full! flex-row-reverse! gap-2! justify-end! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
                                    userButtonOuterIdentifier:"pl-0! group-data-[collapsible=icon]:hidden! ",
                                    avatarBox:"size-8! rounded-md!",
                                }
                             }}
                            />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail/>
        </Sidebar>
    )
}