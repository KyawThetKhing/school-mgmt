import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'

import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'School Management Dashboard',
    description: 'Next.js School Management System',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ToastContainer position="bottom-right" theme="dark" />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
