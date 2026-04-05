import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
