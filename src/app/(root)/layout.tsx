'use client'
import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </SidebarProvider>
    )
}
