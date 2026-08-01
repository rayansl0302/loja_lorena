import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

const COLLECTION = 'customers'

export interface CustomerProfile {
  name: string
  phone: string
}

export async function lookupCustomerProfile(cpfDigits: string): Promise<CustomerProfile | null> {
  if (!isFirebaseConfigured || !db) return null
  try {
    const snap = await getDoc(doc(db, COLLECTION, cpfDigits))
    if (!snap.exists()) return null
    const data = snap.data()
    return { name: String(data.name ?? ''), phone: String(data.phone ?? '') }
  } catch {
    return null
  }
}

export async function saveCustomerProfile(
  cpfDigits: string,
  profile: CustomerProfile,
): Promise<void> {
  if (!isFirebaseConfigured || !db) return
  try {
    await setDoc(doc(db, COLLECTION, cpfDigits), {
      name: profile.name,
      phone: profile.phone,
      updatedAt: serverTimestamp(),
    })
  } catch {
    // Best-effort: nunca deve travar o fechamento do pedido no WhatsApp.
  }
}
