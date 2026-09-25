import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Subscription } from '../types';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  const collectionName = 'subscriptions';
  try {
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscription));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function createSubscription(params: {
  userId: string;
  userEmail: string;
  userName?: string;
  gradeId: string;
  gradeName: string;
  subjectId: string;
  subjectName: string;
  durationMonths: number;
  priceZar: number;
  paymentMethod: string;
  paymentRef: string;
}): Promise<string> {
  const collectionName = 'subscriptions';
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + params.durationMonths);

    const docRef = await addDoc(collection(db, collectionName), {
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName || '',
      gradeId: params.gradeId,
      gradeName: params.gradeName,
      subjectId: params.subjectId,
      subjectName: params.subjectName,
      durationMonths: params.durationMonths,
      priceZar: params.priceZar,
      status: 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      paymentMethod: params.paymentMethod,
      paymentRef: params.paymentRef,
      createdAt: new Date().toISOString(),
    });

    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const collectionName = 'subscriptions';
  try {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscription));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}
