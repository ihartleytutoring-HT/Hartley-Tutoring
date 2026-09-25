import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { Grade, Subject, Topic, LessonItem, Subscription, UserProgress, QuizQuestion } from '../types';
import { getGrades, getSubjects, getTopics, getLessonItems } from '../services/curriculumService';
import { getUserSubscriptions } from '../services/subscriptionService';
import { getUserProgress, recordLessonProgress } from '../services/progressService';
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  ExternalLink,
  Download,
  AlertCircle,
  Clock,
  Check,
  Flame,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';

import { StudentPerformanceChart } from './StudentPerformanceChart';

interface StudentPortalProps {
  onOpenSubscribe: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onOpenSubscribe }) => {
  const { user, loginWithGoogle } = useAuth();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedGradeId, setSelectedGradeId] = useState<string>('');

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [lessonItems, setLessonItems] = useState<LessonItem[]>([]);
  const [allSubjectLessons, setAllSubjectLessons] = useState<LessonItem[]>([]);
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);

  // User progress state map
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Quiz active state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  // Load Subscriptions and Progress for User
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadUserData() {
      setLoading(true);
      try {
        const [subs, prog] = await Promise.all([
          getUserSubscriptions(user!.uid),
          getUserProgress(user!.uid),
        ]);
        setSubscriptions(subs);
        setProgressMap(prog);

        const allGrades = await getGrades();
        setGrades(allGrades);

        if (subs.length > 0) {
          const firstSub = subs[0];
          setSelectedGradeId(firstSub.gradeId);
          setSelectedSubjectId(firstSub.subjectId);
        } else if (allGrades.length > 0) {
          setSelectedGradeId(allGrades[0].id);
          const subsOfGrade = await getSubjects(allGrades[0].id);
          setSubjects(subsOfGrade);
          if (subsOfGrade.length > 0) {
            setSelectedSubjectId(subsOfGrade[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading student portal:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [user]);

  // Load Subjects when Grade changes
  useEffect(() => {
    if (!selectedGradeId) return;
    async function loadSubs() {
      try {
        const subs = await getSubjects(selectedGradeId);
        setSubjects(subs);
        if (!subs.some((s) => s.id === selectedSubjectId) && subs.length > 0) {
          setSelectedSubjectId(subs[0].id);
        }
      } catch (err) {
        console.error('Error loading subjects:', err);
      }
    }
    loadSubs();
  }, [selectedGradeId]);

  // Load Topics when Subject changes
  useEffect(() => {
    if (!selectedGradeId || !selectedSubjectId) return;
    async function loadTops() {
      try {
        const tops = await getTopics(selectedGradeId, selectedSubjectId);
        setTopics(tops);
        if (tops.length > 0) {
          setSelectedTopicId(tops[0].id);
          // Fetch all lessons across all topics in this subject for comprehensive visual analytics
          const lessonsPromises = tops.map((t) => getLessonItems(t.id));
          const allResults = await Promise.all(lessonsPromises);
          setAllSubjectLessons(allResults.flat());
        } else {
          setSelectedTopicId('');
          setLessonItems([]);
          setAllSubjectLessons([]);
          setActiveLesson(null);
        }
      } catch (err) {
        console.error('Error loading topics:', err);
      }
    }
    loadTops();
  }, [selectedGradeId, selectedSubjectId]);

  // Load Lessons when Topic changes
  useEffect(() => {
    if (!selectedTopicId) return;
    async function loadLessons() {
      try {
        const items = await getLessonItems(selectedTopicId);
        setLessonItems(items);
        if (items.length > 0) {
          setActiveLesson(items[0]);
          // Reset quiz state
          setSelectedAnswers({});
          setQuizSubmitted(false);
        } else {
          setActiveLesson(null);
        }
      } catch (err) {
        console.error('Error loading lessons:', err);
      }
    }
    loadLessons();
  }, [selectedTopicId]);

  // Handle Mark as Watched / Read
  const handleMarkComplete = async (lesson: LessonItem) => {
    if (!user) return;
    try {
      await recordLessonProgress({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || '',
        lessonItemId: lesson.id,
        topicId: lesson.topicId,
        gradeId: lesson.gradeId,
        subjectId: lesson.subjectId,
        type: lesson.type,
        completed: true,
        score: 100,
        passed: true,
      });

      // Update local state
      setProgressMap((prev) => ({
        ...prev,
        [lesson.id]: {
          id: `${user.uid}_${lesson.id}`,
          userId: user.uid,
          lessonItemId: lesson.id,
          topicId: lesson.topicId,
          gradeId: lesson.gradeId,
          subjectId: lesson.subjectId,
          type: lesson.type,
          completed: true,
          score: 100,
          passed: true,
          updatedAt: new Date().toISOString(),
        },
      }));
    } catch (err) {
      console.error('Error recording completion:', err);
    }
  };

  // Handle Quiz Submission
  const handleQuizSubmit = async () => {
    if (!activeLesson?.quizQuestions || !user) return;
    const questions = activeLesson.quizQuestions;
    let correctCount = 0;

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    const isPassed = percent === 100; // STRICT 100% passing mark as requested

    setQuizScore(percent);
    setQuizPassed(isPassed);
    setQuizSubmitted(true);

    if (isPassed) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }

    try {
      await recordLessonProgress({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || '',
        lessonItemId: activeLesson.id,
        topicId: activeLesson.topicId,
        gradeId: activeLesson.gradeId,
        subjectId: activeLesson.subjectId,
        type: 'quiz',
        completed: isPassed,
        score: percent,
        passed: isPassed,
      });

      setProgressMap((prev) => ({
        ...prev,
        [activeLesson.id]: {
          id: `${user.uid}_${activeLesson.id}`,
          userId: user.uid,
          lessonItemId: activeLesson.id,
          topicId: activeLesson.topicId,
          gradeId: activeLesson.gradeId,
          subjectId: activeLesson.subjectId,
          type: 'quiz',
          completed: isPassed,
          score: percent,
          passed: isPassed,
          updatedAt: new Date().toISOString(),
        },
      }));
    } catch (err) {
      console.error('Error saving quiz result:', err);
    }
  };

  if (!user) {
    return (
      <div className="py-24 bg-slate-950 text-white min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Student Learning Portal</h2>
          <p className="text-sm text-slate-300 mb-6">
            Please sign in with your Google account to access your enrolled courses, lesson videos, notes, and track your 100% quiz mastery.
          </p>
          <button
            onClick={() => loginWithGoogle()}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-white/10 cursor-pointer"
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
      </div>
    );
  }

  // Calculate user overall statistics
  const completedLessonsCount = Object.values(progressMap).filter((p) => p.completed).length;
  const passedQuizzesCount = Object.values(progressMap).filter((p) => p.type === 'quiz' && p.passed).length;

  return (
    <div className="py-10 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Student Welcome Header */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 sm:p-8 shadow-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Student'}
                className="w-16 h-16 rounded-2xl ring-2 ring-amber-400/50 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold border border-amber-500/30">
                {user.displayName?.charAt(0) || 'S'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">
                  Welcome, {user.displayName?.split(' ')[0] || 'Student'}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Active Student
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Hartley Tutoring Portal &bull; High School & University STEM
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-4 sm:gap-6 bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 text-xs">
            <div>
              <p className="text-slate-400">Completed</p>
              <p className="text-base font-extrabold text-amber-400">{completedLessonsCount} Items</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <p className="text-slate-400">100% Quizzes Passed</p>
              <p className="text-base font-extrabold text-emerald-400">{passedQuizzesCount} Passed</p>
            </div>
          </div>
        </div>

        {/* Subscription Notice banner if not subscribed */}
        {subscriptions.length === 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">You are previewing sample curriculum modules.</p>
                <p className="text-slate-300">
                  Subscribe to unlock all full-length masterclasses, past papers, notes & 1-on-1 WhatsApp support from Imraan Hartley.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenSubscribe}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md"
            >
              Subscribe (from R250/mo)
            </button>
          </div>
        )}

        {/* Grade & Subject Selector Bar */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Grade Dropdown Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label htmlFor="student-grade-select" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Select Grade:</span>
            </label>
            <div className="relative min-w-[210px]">
              <select
                id="student-grade-select"
                value={selectedGradeId}
                onChange={(e) => setSelectedGradeId(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-10 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all cursor-pointer shadow-inner"
              >
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id} className="bg-slate-950 text-white py-1">
                    {grade.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-amber-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Subject Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Subject:
            </span>
            {subjects.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No subjects available</span>
            ) : (
              subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSubjectId === sub.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {sub.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Visual Summary of Course Completion % and Quiz Performance using Recharts */}
        <StudentPerformanceChart
          topics={topics}
          allLessons={allSubjectLessons}
          progressMap={progressMap}
          subjectName={subjects.find((s) => s.id === selectedSubjectId)?.name || 'Mathematics & Science'}
          gradeName={grades.find((g) => g.id === selectedGradeId)?.name}
          grades={grades}
          selectedGradeId={selectedGradeId}
          onSelectGrade={setSelectedGradeId}
          onSelectTopic={(topicId) => setSelectedTopicId(topicId)}
        />

        {/* Main Portal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Topics & Lesson Items Accordion/List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Curriculum Modules ({topics.length})
              </h3>

              {topics.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No topics available.</div>
              ) : (
                <div className="space-y-3">
                  {topics.map((top) => {
                    const isSelected = selectedTopicId === top.id;
                    return (
                      <div key={top.id} className="rounded-2xl border border-slate-800/80 overflow-hidden">
                        <button
                          onClick={() => setSelectedTopicId(top.id)}
                          className={`w-full text-left p-3.5 flex items-center justify-between text-xs font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-500/15 text-amber-300 border-b border-amber-500/20'
                              : 'bg-slate-950/70 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <span className="truncate">{top.title}</span>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-amber-400' : 'text-slate-500'}`}
                          />
                        </button>

                        {/* If this topic is selected, display its lessons */}
                        {isSelected && (
                          <div className="p-2 space-y-1 bg-slate-950/90">
                            {lessonItems.map((item) => {
                              const prog = progressMap[item.id];
                              const isCompleted = prog?.completed;
                              const isPassed = item.type === 'quiz' ? prog?.passed : isCompleted;
                              const isCurrent = activeLesson?.id === item.id;

                              return (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setActiveLesson(item);
                                    setSelectedAnswers({});
                                    setQuizSubmitted(false);
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                                    isCurrent
                                      ? 'bg-slate-800 text-white font-medium ring-1 ring-slate-700'
                                      : 'hover:bg-slate-900 text-slate-400'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {item.type === 'video' && <Video className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                                    {item.type === 'notes' && <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                                    {item.type === 'quiz' && <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                    <span className="truncate">{item.title}</span>
                                  </div>

                                  {isPassed ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                                      <Check className="w-3 h-3" />
                                      {item.type === 'quiz' ? '100%' : 'Done'}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-500 shrink-0">Pending</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Lesson Content Viewer */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl min-h-[500px]">
              
              {activeLesson ? (
                <div>
                  
                  {/* Lesson Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-400">
                          {activeLesson.type.toUpperCase()}
                        </span>
                        {activeLesson.type === 'quiz' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            100% Pass Mark Required
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">{activeLesson.title}</h2>
                    </div>

                    {/* Completion status pill */}
                    <div>
                      {progressMap[activeLesson.id]?.passed || progressMap[activeLesson.id]?.completed ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Mastered & Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs">
                          <Clock className="w-4 h-4" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 1. TYPE: VIDEO LESSON */}
                  {activeLesson.type === 'video' && (
                    <div className="space-y-6">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
                        {activeLesson.videoUrl?.includes('youtube.com') || activeLesson.videoUrl?.includes('youtu.be') ? (
                          <iframe
                            src={
                              activeLesson.videoUrl.includes('watch?v=')
                                ? activeLesson.videoUrl.replace('watch?v=', 'embed/')
                                : activeLesson.videoUrl
                            }
                            title={activeLesson.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                            <Play className="w-12 h-12 text-amber-400 mb-3" />
                            <p className="font-semibold text-white">Video Lesson Stream</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                              Watch Imraan Hartley's walkthrough of the topic and key exam strategies.
                            </p>
                            {activeLesson.videoUrl && (
                              <a
                                href={activeLesson.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center gap-1.5"
                              >
                                <span>Open Video Link</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Video actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                        <div className="text-xs text-slate-400">
                          <span>Video Duration: </span>
                          <strong className="text-white">{activeLesson.videoDuration || '15-20 min'}</strong>
                        </div>

                        <button
                          onClick={() => handleMarkComplete(activeLesson)}
                          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            progressMap[activeLesson.id]?.completed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {progressMap[activeLesson.id]?.completed
                              ? 'Completed (Click to Re-confirm)'
                              : 'Mark as Watched'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. TYPE: NOTES & SUMMARY */}
                  {activeLesson.type === 'notes' && (
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 text-sm leading-relaxed text-slate-200 font-sans whitespace-pre-wrap">
                        {activeLesson.notesContent || 'No notes content has been uploaded for this lesson.'}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                        {activeLesson.notesAttachmentUrl ? (
                          <a
                            href={activeLesson.notesAttachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-semibold flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download PDF Worksheet</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">Digital summary notes provided by Imraan Hartley</span>
                        )}

                        <button
                          onClick={() => handleMarkComplete(activeLesson)}
                          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            progressMap[activeLesson.id]?.completed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {progressMap[activeLesson.id]?.completed
                              ? 'Reviewed & Completed'
                              : 'Mark Notes Reviewed'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. TYPE: 100% MASTERY QUIZ */}
                  {activeLesson.type === 'quiz' && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-200">
                        <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <strong className="text-white">Hartley Tutoring 100% Standard:</strong> In order to pass this quiz and receive full credit, you must achieve 100%. If you make an error, read the solution explanations and try again!
                        </div>
                      </div>

                      {/* Quiz Questions */}
                      {activeLesson.quizQuestions && activeLesson.quizQuestions.length > 0 ? (
                        <div className="space-y-6">
                          {activeLesson.quizQuestions.map((q, qIndex) => {
                            const selectedOption = selectedAnswers[q.id];
                            const isCorrect = selectedOption === q.correctOptionIndex;

                            return (
                              <div
                                key={q.id}
                                className={`p-5 rounded-2xl border transition-all ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? 'bg-emerald-950/20 border-emerald-500/40'
                                      : 'bg-rose-950/20 border-rose-500/40'
                                    : 'bg-slate-950 border-slate-800'
                                }`}
                              >
                                <p className="font-bold text-sm text-white mb-4">
                                  {qIndex + 1}. {q.question}
                                </p>

                                <div className="space-y-2.5">
                                  {q.options.map((opt, optIdx) => {
                                    const isThisSelected = selectedOption === optIdx;
                                    const isThisTheCorrectAnswer = q.correctOptionIndex === optIdx;

                                    let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                                    if (quizSubmitted) {
                                      if (isThisTheCorrectAnswer) {
                                        optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                                      } else if (isThisSelected && !isThisTheCorrectAnswer) {
                                        optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
                                      }
                                    } else if (isThisSelected) {
                                      optionStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold';
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        disabled={quizSubmitted}
                                        onClick={() => {
                                          setSelectedAnswers((prev) => ({
                                            ...prev,
                                            [q.id]: optIdx,
                                          }));
                                        }}
                                        className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer disabled:cursor-default ${optionStyle}`}
                                      >
                                        <span>{opt}</span>
                                        {quizSubmitted && isThisTheCorrectAnswer && (
                                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Explanation on submission */}
                                {quizSubmitted && q.explanation && (
                                  <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                                    <strong className="text-amber-400">Explanation: </strong>
                                    {q.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Result and submission controls */}
                          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                            {quizSubmitted ? (
                              <div className="text-center space-y-4">
                                <div>
                                  <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                                    Your Score:
                                  </p>
                                  <p
                                    className={`text-4xl font-extrabold mt-1 ${
                                      quizPassed ? 'text-emerald-400' : 'text-amber-400'
                                    }`}
                                  >
                                    {quizScore}%
                                  </p>
                                </div>

                                {quizPassed ? (
                                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                                    <div className="flex items-center justify-center gap-2 font-bold text-sm text-emerald-400">
                                      <Award className="w-5 h-5" />
                                      <span>CONGRATULATIONS! 100% PASS ACHIEVED!</span>
                                    </div>
                                    <p className="mt-1">
                                      You have fully mastered this curriculum module. Your progress has been updated in the portal.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                                    <p className="font-bold text-sm">Passing mark is 100%.</p>
                                    <p className="mt-1">
                                      You scored {quizScore}%. Review the explanations above, then click Retry to achieve 100% mastery!
                                    </p>
                                  </div>
                                )}

                                {!quizPassed && (
                                  <button
                                    onClick={() => {
                                      setSelectedAnswers({});
                                      setQuizSubmitted(false);
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Retry Quiz to Get 100%</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-xs text-slate-400">
                                  Answer all {activeLesson.quizQuestions.length} questions before submitting.
                                </div>
                                <button
                                  onClick={handleQuizSubmit}
                                  disabled={
                                    Object.keys(selectedAnswers).length < activeLesson.quizQuestions.length
                                  }
                                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50"
                                >
                                  <span>Submit Quiz for 100% Grading</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-400 text-xs bg-slate-950 rounded-2xl">
                          No quiz questions configured yet.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-24 text-center text-slate-500">
                  <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm">Please select a lesson from the menu on the left to start learning.</p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
