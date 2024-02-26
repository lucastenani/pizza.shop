import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div>
      <header>auth header</header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
