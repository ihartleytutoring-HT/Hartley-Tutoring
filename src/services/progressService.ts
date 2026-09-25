import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { UserProgress, LessonType } from '../types';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export async function getUserProgress(userId: string): Promise<Record<string, UserProgress>> {
  const collectionName = 'userProgress';
  try {
    const q = query(collection(db, collectionName), where('userId', '==', userId));
    const snap = await getDocs(q);
    const progressMap: Record<string, UserProgress> = {};
    snap.docs.forEach((d) => {
      const data = d.data() as UserProgress;
      progressMap[data.lessonItemId] = data;
    });
    return progressMap;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function recordLessonProgress(params: {
  userId: string;
  userEmail?: string;
  userName?: string;
  lessonItemId: string;
  topicId: string;
  gradeId: string;
  subjectId: string;
  type: LessonType;
  completed: boolean;
  score?: number; // e.g. 100 for 100%
  passed?: boolean; // Must be true only if score === 100
}): Promise<void> {
  const collectionName = 'userProgress';
  const progressDocId = `${params.userId}_${params.lessonItemId}`;
  try {
    const isPassed = params.type === 'quiz' ? params.score === 100 : params.completed;
    const existingRef = doc(db, collectionName, progressDocId);
    const existingSnap = await getDoc(existingRef);

    let attemptsCount = 1;
    if (existingSnap.exists()) {
      attemptsCount = (existingSnap.data().attemptsCount || 0) + 1;
    }

    const payload: UserProgress = {
      id: progressDocId,
      userId: params.userId,
      userEmail: params.userEmail || '',
      userName: params.userName || '',
      lessonItemId: params.lessonItemId,
      topicId: params.topicId,
      gradeId: params.gradeId,
      subjectId: params.subjectId,
      type: params.type,
      completed: params.completed,
      score: params.score ?? (params.completed ? 100 : 0),
      passed: isPassed,
      attemptsCount,
      lastScorePercent: params.score,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(existingRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

export async function getAllStudentProgress(): Promise<UserProgress[]> {
  const collectionName = 'userProgress';
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => d.data() as UserProgress);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}
