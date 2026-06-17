import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-h-0">
        {children}
      </main>
    </div>
  )
}
