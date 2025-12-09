import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

export async function getPageContent(pageName: string) {
  try {
    const siteId = process.env.NEXT_PUBLIC_SITE_ID
    const docRef = doc(db, 'sites', siteId || 'default')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return data.pages?.[pageName] || { title: 'Page not found', content: '' }
    }
    return { title: 'Welcome', content: 'Content not yet configured' }
  } catch (error) {
    console.error('Error fetching content:', error)
    return { title: 'Error', content: 'Failed to load content' }
  }
}

export async function updatePageContent(pageName: string, content: any) {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID
  const docRef = doc(db, 'sites', siteId || 'default')
  
  const docSnap = await getDoc(docRef)
  const currentData = docSnap.exists() ? docSnap.data() : { pages: {} }
  
  await setDoc(docRef, {
    ...currentData,
    pages: {
      ...currentData.pages,
      [pageName]: content,
    },
  })
}

export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function isUserAuthenticated(): Promise<boolean> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(!!user)
    })
  })
}

export { auth }
