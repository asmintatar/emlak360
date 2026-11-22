
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, Users, Building2 } from 'lucide-react'

const API_URL = 'http://localhost:5000'

export default function AdminPanel() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include',
        })

        if (!response.ok) throw new Error('Oturum geçersiz')

        const data = await response.json()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [])

  if (loading) {
    return <main className="container"><p>Yetki kontrol ediliyor...</p></main>
  }

  if (!user) return <Navigate to="/giris" replace />

  if (user.role !== 'ADMIN') {
    return (
      <main className="container">
        <h1>403 - Yetkisiz eriþim</h1>
        <p>Bu sayfayý görüntülemek için yönetici yetkisi gerekiyor.</p>
      </main>
    )
  }

  return (
    <main className="container">
      <h1><ShieldCheck size={26} /> Yönetici Paneli</h1>
      <p>Hoþ geldiniz, {user.name}</p>

      <section>
        <h2><Users size={22} /> Kullanýcý Yönetimi</h2>
        <p>Kullanýcý listeleme, arama ve filtreleme burada olacak.</p>
      </section>

      <section>
        <h2><Building2 size={22} /> Ýlan Denetimi</h2>
        <p>Ýlan denetimi, ilan modülü hazýr olduðunda eklenecek.</p>
      </section>
    </main>
  )
}
