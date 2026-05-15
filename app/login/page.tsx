'use client'

import { useRouter } from 'next/navigation'
import { SignInPage } from '@/components/ui/sign-in'

export default function LoginPage() {
  const router = useRouter()

  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    console.log('Login:', data)
    // TODO: wire up real auth here
    router.push('/demo')
  }

  return (
    <SignInPage
      title={
        <>
          <span className="text-accent font-bold">ROB</span>
          <span className="font-light">ZEN</span>
        </>
      }
      description="Melden Sie sich an, um Ihre Automatisierungsprojekte zu verwalten."
      heroImageSrc="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=2160&q=80"
      onSignIn={handleSignIn}
      onGoogleSignIn={() => console.log('Google sign-in')}
      onResetPassword={() => router.push('/passwort-vergessen')}
      onCreateAccount={() => router.push('/registrieren')}
    />
  )
}
