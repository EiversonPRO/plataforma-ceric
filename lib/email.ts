import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/restablecer-contrasena?token=${token}`

  await resend.emails.send({
    from: 'CERIC <no-reply@ceric.edu.co>',
    to: email,
    subject: 'Restablecer contraseña - Plataforma CERIC',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F97316;">Restablecer contraseña</h1>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}" style="background: #F97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
          Restablecer contraseña
        </a>
        <p style="color: #78716C; font-size: 14px;">Este enlace expira en 1 hora.</p>
      </div>
    `,
  })
}
