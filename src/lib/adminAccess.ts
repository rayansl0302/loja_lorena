import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

const COLLECTION = 'admins'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function isRegisteredAdmin(email: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db || !email) return false
  try {
    const snap = await getDoc(doc(db, COLLECTION, normalizeEmail(email)))
    return snap.exists()
  } catch {
    return false
  }
}

export async function listAdmins(): Promise<string[]> {
  if (!isFirebaseConfigured || !db) return []
  const snap = await getDocs(collection(db, COLLECTION))
  return snap.docs.map((docSnap) => docSnap.id).sort()
}

export async function addAdmin(email: string): Promise<void> {
  if (!isFirebaseConfigured || !db) throw new Error('firebase-not-configured')
  await setDoc(doc(db, COLLECTION, normalizeEmail(email)), {
    addedAt: serverTimestamp(),
  })
}

export async function removeAdmin(email: string): Promise<void> {
  if (!isFirebaseConfigured || !db) throw new Error('firebase-not-configured')
  await deleteDoc(doc(db, COLLECTION, normalizeEmail(email)))
}
