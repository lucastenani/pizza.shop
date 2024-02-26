import { Pizza } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <header className="flex items-center gap-3 text-lg text-foreground">
          <Pizza className="h-5 w-5" />
          <h2 className="font-semibold">pizza.shop</h2>
        </header>
        <footer className="text-sm">
          Partner Dashboard &copy; pizza.shop - {new Date().getFullYear()}
        </footer>
      </div>
      <main className="flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  )
}
