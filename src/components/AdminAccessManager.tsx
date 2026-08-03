import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldUserBold, UserPlusBold, TrashBinTrashLinear } from 'solar-icon-set'
import { addAdmin, listAdmins, removeAdmin } from '@/lib/adminAccess'
import { useShop } from '@/store/ShopContext'

export function AdminAccessManager() {
  const { showToast } = useShop()
  const [admins, setAdmins] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function refresh() {
    setIsLoading(true)
    try {
      const list = await listAdmins()
      setAdmins(list)
    } catch {
      showToast('Não foi possível carregar os administradores.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAdd(event: FormEvent) {
    event.preventDefault()
    const email = newEmail.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      showToast('Informe um e-mail válido.', 'error')
      return
    }
    if (admins.includes(email)) {
      showToast('Esse e-mail já tem acesso.', 'error')
      return
    }
    setIsSubmitting(true)
    try {
      await addAdmin(email)
      setNewEmail('')
      showToast('E-mail liberado com sucesso')
      await refresh()
    } catch {
      showToast('Não foi possível liberar esse e-mail.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRemove(email: string) {
    if (!window.confirm(`Remover o acesso de "${email}"?`)) return
    try {
      await removeAdmin(email)
      showToast('Acesso removido', 'info')
      await refresh()
    } catch {
      showToast('Não foi possível remover esse e-mail.', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-noir-900 p-4">
        <ShieldUserBold size={22} className="mt-0.5 shrink-0 text-gold-400" />
        <p className="text-sm text-cream-300">
          Só você (o dono da conta) vê essa aba. Adicione aqui o e-mail da lojista (ou de quem
          mais precisar) para liberar o acesso ao painel. A pessoa também precisa existir como
          usuário no Firebase Authentication (Google, ou e-mail/senha cadastrado no console) —
          essa lista só controla a <em>permissão</em>, não cria o login em si.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="email@lojista.com"
          className="w-full rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
        />
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={isSubmitting ? undefined : { scale: 0.97 }}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-medium text-noir-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlusBold size={18} />
          {isSubmitting ? 'Liberando...' : 'Liberar acesso'}
        </motion.button>
      </form>

      {isLoading ? (
        <p className="text-sm text-cream-300">Carregando...</p>
      ) : (
        <ul className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {admins.map((email) => (
              <motion.li
                key={email}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-3 rounded-2xl border border-noir-700 bg-noir-900 p-4"
              >
                <span className="truncate text-sm text-cream-100">{email}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(email)}
                  aria-label={`Remover acesso de ${email}`}
                  title="Remover acesso"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent text-cream-300 transition hover:border-noir-600 hover:text-wine-600"
                >
                  <TrashBinTrashLinear size={16} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>

          {admins.length === 0 && (
            <p className="py-6 text-center text-sm text-cream-300">
              Nenhuma lojista com acesso ainda além de você.
            </p>
          )}
        </ul>
      )}
    </div>
  )
}
