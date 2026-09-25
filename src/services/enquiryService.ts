import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Enquiry } from '../types';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export async function submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const collectionName = 'enquiries';
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...enquiry,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const collectionName = 'enquiries';
  try {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enquiry));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: 'new' | 'contacted' | 'resolved'
): Promise<void> {
  const path = `enquiries/${enquiryId}`;
  try {
    await updateDoc(doc(db, 'enquiries', enquiryId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEnquiry(enquiryId: string): Promise<void> {
  const path = `enquiries/${enquiryId}`;
  try {
    await deleteDoc(doc(db, 'enquiries', enquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
