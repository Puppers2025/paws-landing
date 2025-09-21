// app/layout.jsx
import './styles/globals.css'
import { Orbitron, Rajdhani, Press_Start_2P } from 'next/font/google'
import { OverviewModalsProvider } from '@/components/overview/hooks/overviewModals'
import { AuthProvider } from './contexts/AuthContext'
import AdminBypass from './components/AdminBypass'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-orbitron' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-rajdhani' })
const pressStart = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--font-press' })

export const metadata = { title: 'Puppers Landing', description: 'Futuristic site' }

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${pressStart.variable}`}>
      <body className="font-body">
        <AuthProvider>
          <OverviewModalsProvider>
            {children}
            <AdminBypass />
          </OverviewModalsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}