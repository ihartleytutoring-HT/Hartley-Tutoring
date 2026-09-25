import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore using designated database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Pre-approved admin emails specified in requirements
export const PRE_APPROVED_ADMIN_EMAILS = [
  'ihartleytutoring@gmail.com',
  'imraanhartley76@gmail.com',
  'yaaseen.abrahams@gmail.com',
];

// Helper to check if an email is an authorized admin
export function isPreApprovedAdmin(email?: string | null): boolean {
  if (!email) return false;
  return PRE_APPROVED_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// Validate connection to Firestore on boot as mandated by the Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connection warning: client appears offline.', error);
    }
    return false;
  }
}

// Run test on load
testFirestoreConnection().catch(() => {});
