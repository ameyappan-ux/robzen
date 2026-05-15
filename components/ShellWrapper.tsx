'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import Footer from './Footer'

const SHELL_HIDDEN_PREFIXES = ['/login', '/demo']

export default function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideShell = SHELL_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  return (
    <>
      {!hideShell && <Nav />}
      <main className="flex-1">{children}</main>
      {!hideShell && <Footer />}
    </>
  )
}
