import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

const COLLECTION = 'couponUsages'

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function usageDocId(code: string, cpfDigits: string): Promise<string> {
  const hash = await sha256Hex(cpfDigits)
  return `${code}_${hash}`
}

export async function hasUsedCoupon(code: string, cpfDigits: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('firebase-not-configured')
  }
  const id = await usageDocId(code, cpfDigits)
  const snap = await getDoc(doc(db, COLLECTION, id))
  return snap.exists()
}

export async function registerCouponUsage(code: string, cpfDigits: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return
  try {
    const id = await usageDocId(code, cpfDigits)
    await setDoc(doc(db, COLLECTION, id), {
      couponCode: code,
      usedAt: serverTimestamp(),
    })
  } catch {
    // Best-effort: nunca deve travar o fechamento do pedido no WhatsApp.
  }
}
