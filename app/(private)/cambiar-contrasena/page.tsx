'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Eye, EyeOff, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getDashboardByRole } from '@/lib/utils'

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${met ? 'text-emerald-600' : 'text-[#78716C]'}`}>
      <Check size={14} className={met ? 'text-emerald-500' : 'text-[#E7E5E4]'} />
      {label}
    </li>
  )
}

export default function CambiarContrasenaPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const hasLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isValid = hasLength && hasUpper && hasNumber && password === confirm

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (!isValid) {
      setError('La contraseña no cumple los requisitos')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/cambiar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Error al guardar la contraseña')
        return
      }

      // Update session to reflect forcePasswordChange = false
      await update({ forcePasswordChange: false })
      router.push(getDashboardByRole(session?.user?.role ?? ''))
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #F97316 0%, #10B981 100%)' }}
    >
      <div
        className="w-full max-w-md bg-white shadow-2xl p-8"
        style={{ borderRadius: '16px' }}
      >
        <div className="mb-8 text-center">
          <h1
            className="text-2xl font-extrabold text-[#1C1917]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Crea tu contraseña
          </h1>
          <p className="text-sm text-[#78716C] mt-2">
            Por seguridad, debes crear una contraseña personalizada antes de continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                aria-label={showConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Requirements */}
          <ul className="space-y-1 bg-[#FAFAF9] rounded-lg p-4">
            <Requirement met={hasLength} label="Mínimo 8 caracteres" />
            <Requirement met={hasUpper} label="Al menos una mayúscula" />
            <Requirement met={hasNumber} label="Al menos un número" />
            <Requirement met={confirm.length > 0 && password === confirm} label="Las contraseñas coinciden" />
          </ul>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-lg px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || !isValid}
            className="w-full min-h-[44px] bg-[#F97316] hover:bg-[#EA6A10] text-white font-semibold text-base rounded-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Guardando…
              </>
            ) : (
              'Guardar y continuar'
            )}
          </Button>
        </form>
      </div>
    </main>
  )
}
