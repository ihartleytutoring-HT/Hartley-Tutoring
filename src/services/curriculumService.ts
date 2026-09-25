import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Grade, Subject, Topic, LessonItem, PackagePrice } from '../types';
import { handleFirestoreError, OperationType } from '../firebase/errors';

// Default pricing structure in South African Rands (ZAR)
export const DEFAULT_PRICING: PackagePrice = {
  id: 'default',
  month1: 250,
  month3: 600,
  month6: 1000,
  month12: 1800,
};

// ----------------- GRADES -----------------
export async function getGrades(): Promise<Grade[]> {
  const collectionName = 'grades';
  try {
    const snap = await getDocs(query(collection(db, collectionName), orderBy('order', 'asc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Grade));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function saveGrade(grade: Omit<Grade, 'id'>, id?: string): Promise<string> {
  const collectionName = 'grades';
  try {
    if (id) {
      await setDoc(doc(db, collectionName, id), { ...grade, id }, { merge: true });
      return id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...grade,
        createdAt: new Date().toISOString(),
      });
      await updateDoc(docRef, { id: docRef.id });
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

export async function deleteGrade(gradeId: string): Promise<void> {
  const path = `grades/${gradeId}`;
  try {
    await deleteDoc(doc(db, 'grades', gradeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------- SUBJECTS -----------------
export async function getSubjects(gradeId?: string): Promise<Subject[]> {
  const collectionName = 'subjects';
  try {
    let q = query(collection(db, collectionName), orderBy('order', 'asc'));
    if (gradeId) {
      q = query(collection(db, collectionName), where('gradeId', '==', gradeId), orderBy('order', 'asc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subject));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function saveSubject(subject: Omit<Subject, 'id'>, id?: string): Promise<string> {
  const collectionName = 'subjects';
  try {
    if (id) {
      await setDoc(doc(db, collectionName, id), { ...subject, id }, { merge: true });
      return id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...subject,
        createdAt: new Date().toISOString(),
      });
      await updateDoc(docRef, { id: docRef.id });
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

export async function deleteSubject(subjectId: string): Promise<void> {
  const path = `subjects/${subjectId}`;
  try {
    await deleteDoc(doc(db, 'subjects', subjectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------- TOPICS -----------------
export async function getTopics(gradeId?: string, subjectId?: string): Promise<Topic[]> {
  const collectionName = 'topics';
  try {
    let q = query(collection(db, collectionName), orderBy('order', 'asc'));
    if (gradeId && subjectId) {
      q = query(
        collection(db, collectionName),
        where('gradeId', '==', gradeId),
        where('subjectId', '==', subjectId),
        orderBy('order', 'asc')
      );
    } else if (gradeId) {
      q = query(collection(db, collectionName), where('gradeId', '==', gradeId), orderBy('order', 'asc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Topic));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function saveTopic(topic: Omit<Topic, 'id'>, id?: string): Promise<string> {
  const collectionName = 'topics';
  try {
    if (id) {
      await setDoc(doc(db, collectionName, id), { ...topic, id }, { merge: true });
      return id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...topic,
        createdAt: new Date().toISOString(),
      });
      await updateDoc(docRef, { id: docRef.id });
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

export async function deleteTopic(topicId: string): Promise<void> {
  const path = `topics/${topicId}`;
  try {
    await deleteDoc(doc(db, 'topics', topicId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------- LESSON ITEMS (Videos, Notes, Quizzes) -----------------
export async function getLessonItems(topicId?: string): Promise<LessonItem[]> {
  const collectionName = 'lessonItems';
  try {
    let q = query(collection(db, collectionName), orderBy('order', 'asc'));
    if (topicId) {
      q = query(collection(db, collectionName), where('topicId', '==', topicId), orderBy('order', 'asc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LessonItem));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function saveLessonItem(item: Omit<LessonItem, 'id'>, id?: string): Promise<string> {
  const collectionName = 'lessonItems';
  try {
    if (id) {
      await setDoc(doc(db, collectionName, id), { ...item, id }, { merge: true });
      return id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        passingScorePercent: 100, // Enforce 100% pass mark for quizzes
        createdAt: new Date().toISOString(),
      });
      await updateDoc(docRef, { id: docRef.id });
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

export async function deleteLessonItem(itemId: string): Promise<void> {
  const path = `lessonItems/${itemId}`;
  try {
    await deleteDoc(doc(db, 'lessonItems', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------- PACKAGE PRICES (Grade + Subject = Package) -----------------
export async function getPackagePrice(gradeId?: string, subjectId?: string): Promise<PackagePrice> {
  const collectionName = 'packagePrices';
  try {
    if (gradeId && subjectId) {
      const specificId = `${gradeId}_${subjectId}`;
      const docSnap = await getDoc(doc(db, collectionName, specificId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as PackagePrice;
      }
    }
    // Check global default override or return default
    const defaultSnap = await getDoc(doc(db, collectionName, 'default'));
    if (defaultSnap.exists()) {
      return { id: defaultSnap.id, ...defaultSnap.data() } as PackagePrice;
    }
    return DEFAULT_PRICING;
  } catch (error) {
    console.warn('Using default pricing fallback:', error);
    return DEFAULT_PRICING;
  }
}

export async function getAllPackagePrices(): Promise<PackagePrice[]> {
  const collectionName = 'packagePrices';
  try {
    const snap = await getDocs(collection(db, collectionName));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PackagePrice));
    if (!items.find((p) => p.id === 'default')) {
      items.unshift(DEFAULT_PRICING);
    }
    return items;
  } catch (error) {
    return [DEFAULT_PRICING];
  }
}

export async function savePackagePrice(pricing: PackagePrice): Promise<void> {
  const collectionName = 'packagePrices';
  try {
    await setDoc(doc(db, collectionName, pricing.id), {
      ...pricing,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

// ----------------- SEED INITIAL CURRICULUM -----------------
export async function seedInitialCurriculum(): Promise<void> {
  // Check if grades exist
  const existingGrades = await getGrades();
  if (existingGrades.length > 0) {
    return; // Already populated
  }

  // 1. Create Grades
  const grade12Id = 'grade-12';
  const grade11Id = 'grade-11';
  const grade10Id = 'grade-10';
  const uniId = 'university';

  await setDoc(doc(db, 'grades', grade12Id), {
    id: grade12Id,
    name: 'Grade 12 (Matric)',
    description: 'Final year NSC & IEB preparation, past paper drills, and calculus mastery.',
    order: 1,
    active: true,
    createdAt: new Date().toISOString(),
  });

  await setDoc(doc(db, 'grades', grade11Id), {
    id: grade11Id,
    name: 'Grade 11',
    description: 'Crucial foundation year building towards provisional university admission.',
    order: 2,
    active: true,
    createdAt: new Date().toISOString(),
  });

  await setDoc(doc(db, 'grades', grade10Id), {
    id: grade10Id,
    name: 'Grade 10',
    description: 'Transition into Senior FET phase for pure Mathematics and Physical Sciences.',
    order: 3,
    active: true,
    createdAt: new Date().toISOString(),
  });

  await setDoc(doc(db, 'grades', uniId), {
    id: uniId,
    name: 'University & Tertiary',
    description: 'Engineering Calculus, Linear Algebra, General Physics & Chemistry (UCT, Stellenbosch, UWC, CPUT).',
    order: 4,
    active: true,
    createdAt: new Date().toISOString(),
  });

  // 2. Create Subjects for Grade 12
  const g12MathId = 'g12-math';
  const g12SciId = 'g12-physics';

  await setDoc(doc(db, 'subjects', g12MathId), {
    id: g12MathId,
    gradeId: grade12Id,
    name: 'Mathematics (Pure Maths)',
    icon: 'Calculator',
    description: 'Calculus, Functions, Trigonometry, Euclidean Geometry, Financial Maths & Probability.',
    order: 1,
    createdAt: new Date().toISOString(),
  });

  await setDoc(doc(db, 'subjects', g12SciId), {
    id: g12SciId,
    gradeId: grade12Id,
    name: 'Physical Sciences (Physics & Chemistry)',
    icon: 'Atom',
    description: 'Newtonian Mechanics, Work Energy Power, Organic Chemistry, Chemical Equilibrium, Rates & Electricity.',
    order: 2,
    createdAt: new Date().toISOString(),
  });

  // 3. Create Sample Topics for Grade 12 Math
  const topicCalcId = 'g12-math-calc';
  const topicTrigId = 'g12-math-trig';

  await setDoc(doc(db, 'topics', topicCalcId), {
    id: topicCalcId,
    gradeId: grade12Id,
    subjectId: g12MathId,
    title: 'Differential Calculus & Cubic Polynomials',
    description: 'First principles, power rule, stationary points, inflection, and optimization problems.',
    order: 1,
    createdAt: new Date().toISOString(),
  });

  await setDoc(doc(db, 'topics', topicTrigId), {
    id: topicTrigId,
    gradeId: grade12Id,
    subjectId: g12MathId,
    title: 'Compound & Double Angle Trigonometry',
    description: 'Deriving identities, solving general solutions, proofs, and 2D/3D trig height problems.',
    order: 2,
    createdAt: new Date().toISOString(),
  });

  // 4. Create Sample Lessons (Video, Notes, Quiz) under Differential Calculus
  await setDoc(doc(db, 'lessonItems', 'lesson-calc-video-1'), {
    id: 'lesson-calc-video-1',
    topicId: topicCalcId,
    gradeId: grade12Id,
    subjectId: g12MathId,
    title: 'Mastering First Principles & Derivative Rules',
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=3a-a1v1934Y',
    videoDuration: '18:45',
    order: 1,
    createdAt: new Date().toISOString(),
  });

  await setDoc(doc(db, 'lessonItems', 'lesson-calc-notes-1'), {
    id: 'lesson-calc-notes-1',
    topicId: topicCalcId,
    gradeId: grade12Id,
    subjectId: g12MathId,
    title: 'Calculus Summary & Formula Sheet Notes',
    type: 'notes',
    notesContent: `### Differential Calculus Exam Summary by Imraan Hartley\n\n**1. Definition of Derivative from First Principles:**\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\n\n*Key Tip:* Always write the limit operator at every step until you substitute $h = 0$! Omitting the limit loses an easy method mark in NSC exam marking.\n\n**2. The Power Rule:**\nIf $f(x) = a x^n$, then $f'(x) = n \\cdot a x^{n-1}$.\nRemember to convert all radicals and fractional powers: $\\sqrt[3]{x^2} = x^{2/3}$ before applying differentiation rules.\n\n**3. Stationary Points & Inflection:**\n- At turning points: $f'(x) = 0$.\n- Local maximum if $f''(x) < 0$; Local minimum if $f''(x) > 0$.\n- Point of inflection: $f''(x) = 0$ with change of concavity.\n\n*Hartley Tutoring Hotline:* 068 143 2025 for instant homework check!`,
    order: 2,
    createdAt: new Date().toISOString(),
  });

  await setDoc(doc(db, 'lessonItems', 'lesson-calc-quiz-1'), {
    id: 'lesson-calc-quiz-1',
    topicId: topicCalcId,
    gradeId: grade12Id,
    subjectId: g12MathId,
    title: 'Calculus Mastery Check (100% Pass Required)',
    type: 'quiz',
    order: 3,
    passingScorePercent: 100,
    quizQuestions: [
      {
        id: 'q1',
        question: 'What is the derivative of f(x) = 3x^4 - 5x + 7 with respect to x?',
        options: ['12x^3 - 5', '12x^3 - 5x', '7x^3 - 5', '12x^4 - 5'],
        correctOptionIndex: 0,
        explanation: 'Applying the power rule: d/dx(3x^4) = 12x^3, d/dx(-5x) = -5, and the derivative of constant 7 is 0. Thus 12x^3 - 5.',
      },
      {
        id: 'q2',
        question: 'If a cubic function has a stationary point at x = 2 and f\'\'(2) = -6, what kind of point is (2, f(2))?',
        options: ['Local Maximum', 'Local Minimum', 'Point of Inflection', 'Undefined'],
        correctOptionIndex: 0,
        explanation: 'When f\'(x) = 0 and the second derivative is negative (f\'\'(x) < 0), the curve is concave down, confirming a local maximum.',
      },
      {
        id: 'q3',
        question: 'Find dy/dx if y = 1 / x^2.',
        options: ['-2 / x^3', '2 / x', '-1 / (2x)', 'x^(-1)'],
        correctOptionIndex: 0,
        explanation: 'Rewrite y = x^(-2). The derivative is dy/dx = -2 * x^(-3) = -2 / x^3.',
      },
    ],
    createdAt: new Date().toISOString(),
  });

  // 5. Default Package Prices
  await setDoc(doc(db, 'packagePrices', 'default'), DEFAULT_PRICING);
}
