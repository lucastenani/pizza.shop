import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div>
      <header>app header</header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
