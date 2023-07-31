import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LoggedInAsContextProvider } from './components/contexts/loggedInAsContext'
import Footer from '@/app/(application)/components/footer'
import Header from '@/app/(application)/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next Campsiter',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <LoggedInAsContextProvider>
        <Header />
        <main className='bg-slate-800 text-slate-100 container mx-auto p-4'>
          {children}
        </main>
        <Footer />
      </LoggedInAsContextProvider>
    </>
  )
}
