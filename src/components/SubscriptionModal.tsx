import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { Grade, Subject, PackagePrice } from '../types';
import {
  getGrades,
  getSubjects,
  getPackagePrice,
  DEFAULT_GRADES,
  getDefaultSubjectsForGrade,
} from '../services/curriculumService';
import { createSubscription } from '../services/subscriptionService';
import {
  X,
  Check,
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  Lock,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Calculator,
  Atom,
  AlertCircle,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedGradeId?: string;
  preSelectedSubjectId?: string;
  preSelectedDuration?: number;
  onSuccess: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  preSelectedGradeId,
  preSelectedSubjectId,
  preSelectedDuration,
  onSuccess,
}) => {
  const { user, loginWithGoogle } = useAuth();

  // Step flow: 1: Grade, 2: Subject, 3: Package, 4: Payment / Confirm
  const [step, setStep] = useState<number>(1);

  // Selections
  const initialGradeId = preSelectedGradeId || DEFAULT_GRADES[0].id;
  const initialSubjects = getDefaultSubjectsForGrade(initialGradeId);
  const initialSubjectId = preSelectedSubjectId || (initialSubjects[0]?.id || '');

  const [grades, setGrades] = useState<Grade[]>(DEFAULT_GRADES);
  const [selectedGradeId, setSelectedGradeId] = useState<string>(initialGradeId);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [durationMonths, setDurationMonths] = useState<number>(preSelectedDuration || 1);
  const [pricing, setPricing] = useState<PackagePrice>({
    id: 'default',
    month1: 250,
    month3: 600,
    month6: 1000,
    month12: 1800,
  });

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft' | 'snapscan' | 'payfast'>('card');
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Dummy Card inputs for realistic SA checkout
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('888');

  const handleGradeSelect = async (gradeId: string) => {
    setSelectedGradeId(gradeId);
    setErrorMsg('');
    try {
      const subs = await getSubjects(gradeId);
      const finalSubs = subs && subs.length > 0 ? subs : getDefaultSubjectsForGrade(gradeId);
      setSubjects(finalSubs);
      if (finalSubs.length > 0) {
        setSelectedSubjectId(finalSubs[0].id);
      }
    } catch {
      const fallback = getDefaultSubjectsForGrade(gradeId);
      setSubjects(fallback);
      if (fallback.length > 0) {
        setSelectedSubjectId(fallback[0].id);
      }
    }
  };

  // Load Grades and Subjects
  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      try {
        const gList = await getGrades();
        const activeGrades = gList && gList.length > 0 ? gList : DEFAULT_GRADES;
        setGrades(activeGrades);
        const targetGId = preSelectedGradeId || selectedGradeId || activeGrades[0].id;
        setSelectedGradeId(targetGId);

        const subs = await getSubjects(targetGId);
        const activeSubs = subs && subs.length > 0 ? subs : getDefaultSubjectsForGrade(targetGId);
        setSubjects(activeSubs);

        if (!selectedSubjectId || !activeSubs.some((s) => s.id === selectedSubjectId)) {
          setSelectedSubjectId(preSelectedSubjectId || activeSubs[0]?.id || '');
        }
      } catch (err) {
        console.error('Error fetching grades in modal:', err);
      }
    }
    load();
  }, [isOpen, preSelectedGradeId, preSelectedSubjectId]);

  // Load Dynamic Pricing for chosen Grade + Subject
  useEffect(() => {
    async function loadPricing() {
      if (selectedGradeId && selectedSubjectId) {
        try {
          const p = await getPackagePrice(selectedGradeId, selectedSubjectId);
          setPricing(p);
        } catch (err) {
          console.warn('Could not load specific pricing:', err);
        }
      }
    }
    loadPricing();
  }, [selectedGradeId, selectedSubjectId]);

  if (!isOpen) return null;

  const currentGrade = grades.find((g) => g.id === selectedGradeId);
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Calculate current price based on duration
  const getSelectedPrice = () => {
    switch (durationMonths) {
      case 3:
        return pricing.month3;
      case 6:
        return pricing.month6;
      case 12:
        return pricing.month12;
      case 1:
      default:
        return pricing.month1;
    }
  };

  const handleNextStep = () => {
    let effectiveGradeId = selectedGradeId;
    if (step === 1) {
      if (!effectiveGradeId) {
        if (grades.length > 0) {
          effectiveGradeId = grades[0].id;
          handleGradeSelect(effectiveGradeId);
        } else {
          setErrorMsg('Please select your grade from the drop-down menu.');
          return;
        }
      }
    }
    if (step === 2) {
      if (!selectedSubjectId) {
        if (subjects.length > 0) {
          setSelectedSubjectId(subjects[0].id);
        } else {
          setErrorMsg('Please select your subject.');
          return;
        }
      }
    }
    setErrorMsg('');
    setStep((prev) => prev + 1);
  };

  const handleProcessPayment = async () => {
    if (!user) {
      const loggedIn = await loginWithGoogle();
      if (!loggedIn) return;
    }

    setProcessing(true);
    setErrorMsg('');

    try {
      const activeUser = user!;
      const finalPrice = getSelectedPrice();
      const paymentRef = `HT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await createSubscription({
        userId: activeUser.uid,
        userEmail: activeUser.email || '',
        userName: activeUser.displayName || 'Student',
        gradeId: selectedGradeId,
        gradeName: currentGrade?.name || 'Selected Grade',
        subjectId: selectedSubjectId,
        subjectName: currentSubject?.name || 'Selected Subject',
        durationMonths,
        priceZar: finalPrice,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentRef,
      });

      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setPaymentComplete(true);
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMsg('Transaction could not be completed: ' + (err?.message || 'Please try again'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              HT
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Hartley Tutoring Subscription</h3>
              <p className="text-[11px] text-slate-400">High School & University Math & Science</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {!paymentComplete && (
          <div className="grid grid-cols-4 border-b border-slate-800 text-center text-xs py-3 px-4 bg-slate-950/30">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              <span>1. Grade</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              <span>2. Subject</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              <span>3. Package</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 4 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              <span>4. Checkout</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {/* SUCCESS SCREEN */}
          {paymentComplete ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-white">Enrollment Successful!</h4>
              <p className="text-slate-300 text-sm mt-2 max-w-md mx-auto">
                Welcome to <strong>Hartley Tutoring</strong>! Your subscription for{' '}
                <span className="text-amber-400 font-semibold">{currentGrade?.name}</span> –{' '}
                <span className="text-amber-400 font-semibold">{currentSubject?.name}</span> is now active.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-slate-400">
                  <span>Subject:</span>
                  <span className="text-white font-medium">{currentSubject?.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Duration:</span>
                  <span className="text-white font-medium">{durationMonths} Month(s)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-400 font-bold">R {getSelectedPrice()} ZAR</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tutoring Support:</span>
                  <span className="text-white font-medium">Imraan Hartley (068 143 2025)</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onSuccess();
                  }}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Go to My Learning Portal</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: CHOOSE GRADE */}
              {step === 1 && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-1.5">Step 1: Choose Your Schooling Grade</h4>
                  <p className="text-xs text-slate-400 mb-6">
                    Select your current high school grade or university level for tailored syllabus alignment.
                  </p>

                  {/* PROMINENT DROP DOWN MENU FOR GRADE */}
                  <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 focus-within:border-amber-400 transition-all">
                    <label
                      htmlFor="grade-dropdown-selector"
                      className="block text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Choose Grade Level (Drop-down Menu)
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Required
                      </span>
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <select
                        id="grade-dropdown-selector"
                        value={selectedGradeId}
                        onChange={(e) => handleGradeSelect(e.target.value)}
                        className="w-full pl-11 pr-10 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm sm:text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer hover:border-slate-600 transition-colors"
                      >
                        {grades.map((grade) => (
                          <option key={grade.id} value={grade.id} className="bg-slate-900 text-white py-2">
                            {grade.name} {grade.description ? `— ${grade.description}` : ''}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-amber-400">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Active Selection: <strong className="text-amber-300 font-bold">{currentGrade?.name || 'Grade 12 (Matric)'}</strong>
                      </span>
                      <span className="text-[11px] text-slate-500">Tap to expand options</span>
                    </div>
                  </div>

                  {/* QUICK SELECTION CARDS */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Or Select Grade Card Below:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {grades.map((grade) => (
                        <button
                          key={grade.id}
                          type="button"
                          onClick={() => handleGradeSelect(grade.id)}
                          className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                            selectedGradeId === grade.id
                              ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/50 shadow-lg shadow-amber-500/10'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white">{grade.name}</span>
                            {selectedGradeId === grade.id ? (
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-700" />
                            )}
                          </div>
                          {grade.description && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{grade.description}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CHOOSE SUBJECT */}
              {step === 2 && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-1.5">Step 2: Choose Your Subject</h4>
                  <p className="text-xs text-slate-400 mb-6">
                    Enroll for Mathematics or Physical Sciences under <strong className="text-amber-400">{currentGrade?.name}</strong>.
                  </p>

                  {/* DROP DOWN MENU FOR SUBJECT */}
                  {subjects.length > 0 && (
                    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950 border-2 border-indigo-500/50 shadow-xl shadow-indigo-500/10 focus-within:border-indigo-400 transition-all">
                      <label
                        htmlFor="subject-dropdown-selector"
                        className="block text-xs font-extrabold uppercase tracking-wider text-indigo-400 mb-2 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Choose Subject (Drop-down Menu)
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Required
                        </span>
                      </label>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <select
                          id="subject-dropdown-selector"
                          value={selectedSubjectId}
                          onChange={(e) => {
                            setSelectedSubjectId(e.target.value);
                            setErrorMsg('');
                          }}
                          className="w-full pl-11 pr-10 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm sm:text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer hover:border-slate-600 transition-colors"
                        >
                          {subjects.map((sub) => (
                            <option key={sub.id} value={sub.id} className="bg-slate-900 text-white py-2">
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-indigo-400">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Active Selection: <strong className="text-indigo-300 font-bold">{currentSubject?.name || 'Please choose a subject'}</strong>
                        </span>
                        <span className="text-[11px] text-slate-500">Tap to switch</span>
                      </div>
                    </div>
                  )}

                  {subjects.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm bg-slate-950 rounded-2xl">
                      No subjects found for this grade. Please select another grade.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Or Select Subject Card Below:
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                      {subjects.map((sub) => {
                        const isMath = sub.name.toLowerCase().includes('math');
                        return (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubjectId(sub.id)}
                            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                              selectedSubjectId === sub.id
                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                  isMath ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'
                                }`}
                              >
                                {isMath ? <Calculator className="w-6 h-6" /> : <Atom className="w-6 h-6" />}
                              </div>
                              <div>
                                <p className="font-bold text-base text-white">{sub.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {sub.description || 'Full curriculum lessons, notes, and 100% mastery quizzes'}
                                </p>
                              </div>
                            </div>
                            {selectedSubjectId === sub.id && (
                              <Check className="w-5 h-5 text-indigo-400 shrink-0 ml-3" />
                            )}
                          </button>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: CHOOSE PACKAGE */}
              {step === 3 && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Step 3: Choose Your Package Duration</h4>
                  <p className="text-xs text-slate-400 mb-6">
                    Pricing for <strong>{currentGrade?.name} – {currentSubject?.name}</strong>:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* 1 Month */}
                    <button
                      onClick={() => setDurationMonths(1)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                        durationMonths === 1
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">1 Month Access</span>
                        <span className="text-base font-extrabold text-amber-400">R {pricing.month1}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Single term sprint or quick exam boost</p>
                    </button>

                    {/* 3 Months */}
                    <button
                      onClick={() => setDurationMonths(3)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                        durationMonths === 3
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950">
                        Popular
                      </span>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">3 Months Pass</span>
                        <span className="text-base font-extrabold text-amber-400">R {pricing.month3}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Full term mastery (~R {Math.round(pricing.month3 / 3)}/mo)</p>
                    </button>

                    {/* 6 Months */}
                    <button
                      onClick={() => setDurationMonths(6)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                        durationMonths === 6
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">6 Months Semester</span>
                        <span className="text-base font-extrabold text-amber-400">R {pricing.month6}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Mid-years & Prelims prep (~R {Math.round(pricing.month6 / 6)}/mo)</p>
                    </button>

                    {/* 12 Months */}
                    <button
                      onClick={() => setDurationMonths(12)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                        durationMonths === 12
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-slate-950">
                        Best Value
                      </span>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">12 Months Full Year</span>
                        <span className="text-base font-extrabold text-amber-400">R {pricing.month12}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Annual peace of mind (~R {Math.round(pricing.month12 / 12)}/mo)</p>
                    </button>

                  </div>
                </div>
              )}

              {/* STEP 4: AUTH & PAYMENT GATEWAY */}
              {step === 4 && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Step 4: Secure South Africa Payment Gateway</h4>
                  <p className="text-xs text-slate-400 mb-5">
                    PayFast / Instant EFT / Card integration for instant portal access.
                  </p>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 text-xs space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Grade:</span>
                      <span className="text-white font-medium">{currentGrade?.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Subject:</span>
                      <span className="text-white font-medium">{currentSubject?.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Duration:</span>
                      <span className="text-white font-medium">{durationMonths} Month(s)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                      <span className="font-bold text-white">Total Due (ZAR):</span>
                      <span className="font-extrabold text-amber-400">R {getSelectedPrice()}</span>
                    </div>
                  </div>

                  {/* User Account verification */}
                  {!user ? (
                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6 text-center">
                      <p className="text-sm font-semibold text-white mb-1">
                        Sign in with Google Account Required
                      </p>
                      <p className="text-xs text-slate-300 mb-4">
                        Your subscription and progress will be securely linked to your Google Account.
                      </p>
                      <button
                        onClick={() => loginWithGoogle()}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center gap-2 mx-auto shadow-md"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign In with Google</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 mb-6">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">Account verified:</p>
                        <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Select South African Payment Option:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5 mb-5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                      <span>Card (Visa/MC)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('eft')}
                      className={`p-3 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                        paymentMethod === 'eft'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Building className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span>Instant EFT</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('snapscan')}
                      className={`p-3 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                        paymentMethod === 'snapscan'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                      <span>SnapScan / Zapper</span>
                    </button>
                  </div>

                  {/* Simulated Secure Payment Details */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">CVV / CVC</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'eft' && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-2">
                      <p className="font-semibold text-white">Supported Instant EFT Banks:</p>
                      <p className="text-slate-400">
                        Capitec Pay &bull; FNB &bull; Standard Bank &bull; Nedbank &bull; Absa &bull; Investec &bull; Tymebank
                      </p>
                      <p className="text-[11px] text-emerald-400">
                        Zero waiting time. Automated real-time verification confirms your payment instantly.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'snapscan' && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 text-center space-y-2">
                      <div className="w-24 h-24 bg-white rounded-xl mx-auto flex items-center justify-center p-2">
                        <div className="w-full h-full border-4 border-slate-950 rounded flex items-center justify-center font-bold text-slate-950 text-xs">
                          QR PAY
                        </div>
                      </div>
                      <p className="text-slate-400">Scan via SnapScan or Zapper app on your phone</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-bit SSL encrypted. Direct South African payment processing.</span>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep((prev) => prev - 1)}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleProcessPayment}
                    disabled={processing}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-60"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Securely...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Pay R {getSelectedPrice()}</span>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
