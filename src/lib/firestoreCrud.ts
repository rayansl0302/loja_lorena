import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
  type Firestore,
} from 'firebase/firestore'

export function subscribeCollection<T extends { id: string }>(
  db: Firestore,
  collectionName: string,
  onData: (items: T[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  return onSnapshot(
    collection(db, collectionName),
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }) as T)
      onData(items)
    },
    (error) => onError?.(error),
  )
}

export async function setItem<T extends { id: string }>(
  db: Firestore,
  collectionName: string,
  item: T,
): Promise<void> {
  const { id, ...data } = item
  await setDoc(doc(db, collectionName, id), data)
}

export async function deleteItem(
  db: Firestore,
  collectionName: string,
  id: string,
): Promise<void> {
  await deleteDoc(doc(db, collectionName, id))
}

export async function replaceCollectionWithSeed<T extends { id: string }>(
  db: Firestore,
  collectionName: string,
  currentIds: string[],
  seedData: T[],
): Promise<void> {
  const batch = writeBatch(db)
  currentIds.forEach((id) => batch.delete(doc(db, collectionName, id)))
  seedData.forEach((item) => {
    const { id, ...data } = item
    batch.set(doc(db, collectionName, id), data)
  })
  await batch.commit()
}
