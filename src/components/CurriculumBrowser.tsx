import React, { useState, useEffect } from 'react';
import { Grade, Subject, Topic, LessonItem } from '../types';
import { getGrades, getSubjects, getTopics, getLessonItems } from '../services/curriculumService';
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Lock,
  ChevronRight,
  Calculator,
  Atom,
  Clock,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';

interface CurriculumBrowserProps {
  onSelectSubscription: (gradeId?: string, subjectId?: string) => void;
}

export const CurriculumBrowser: React.FC<CurriculumBrowserProps> = ({ onSelectSubscription }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGradeId, setSelectedGradeId] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [lessonItems, setLessonItems] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load Grades on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const loadedGrades = await getGrades();
        setGrades(loadedGrades);
        if (loadedGrades.length > 0) {
          setSelectedGradeId(loadedGrades[0].id);
        }
      } catch (err) {
        console.error('Failed to load grades:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // When Grade changes, load Subjects
  useEffect(() => {
    if (!selectedGradeId) return;
    async function loadSub() {
      try {
        const subs = await getSubjects(selectedGradeId);
        setSubjects(subs);
        if (subs.length > 0) {
          setSelectedSubjectId(subs[0].id);
        } else {
          setSelectedSubjectId('');
          setTopics([]);
          setLessonItems([]);
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
      }
    }
    loadSub();
  }, [selectedGradeId]);

  // When Subject changes, load Topics
  useEffect(() => {
    if (!selectedGradeId || !selectedSubjectId) return;
    async function loadTop() {
      try {
        const tops = await getTopics(selectedGradeId, selectedSubjectId);
        setTopics(tops);
        if (tops.length > 0) {
          setSelectedTopicId(tops[0].id);
        } else {
          setSelectedTopicId('');
          setLessonItems([]);
        }
      } catch (err) {
        console.error('Failed to load topics:', err);
      }
    }
    loadTop();
  }, [selectedGradeId, selectedSubjectId]);

  // When Topic changes, load Lesson Items
  useEffect(() => {
    if (!selectedTopicId) return;
    async function loadItems() {
      try {
        const items = await getLessonItems(selectedTopicId);
        setLessonItems(items);
      } catch (err) {
        console.error('Failed to load lesson items:', err);
      }
    }
    loadItems();
  }, [selectedTopicId]);

  const activeGrade = grades.find((g) => g.id === selectedGradeId);
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  const activeTopic = topics.find((t) => t.id === selectedTopicId);

  return (
    <section id="curriculum" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Curriculum Explorer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comprehensive Math & Science Syllabus
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            Aligned with Department of Basic Education CAPS, IEB, and South African University first-year STEM curriculums.
          </p>
        </div>

        {/* Grade Selection Controls: Dropdown & Tabs */}
        <div className="flex flex-col items-center gap-4 mb-3">
          
          {/* Mobile & Quick Grade Dropdown */}
          <div className="sm:hidden w-full max-w-xs">
            <div className="relative">
              <select
                value={selectedGradeId}
                onChange={(e) => setSelectedGradeId(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-lg cursor-pointer"
              >
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id} className="bg-slate-950 text-white py-1">
                    {grade.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amber-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Desktop Grade Selection Tabs */}
          <div className="hidden sm:flex items-center justify-center flex-wrap gap-2.5">
            {grades.map((grade) => (
              <button
                key={grade.id}
                onClick={() => setSelectedGradeId(grade.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
                  selectedGradeId === grade.id
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {grade.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Description */}
        {activeGrade?.description && (
          <p className="text-center text-xs sm:text-sm text-slate-400 mt-2 mb-8 max-w-xl mx-auto italic">
            "{activeGrade.description}"
          </p>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          
          {/* Column 1: Subject Cards & Topic List */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Subject Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Select Subject:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjects.map((sub) => {
                  const isMath = sub.name.toLowerCase().includes('math');
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-3.5 ${
                        selectedSubjectId === sub.id
                          ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isMath ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'
                        }`}
                      >
                        {isMath ? <Calculator className="w-5 h-5" /> : <Atom className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{sub.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {isMath ? 'Pure Calculus & Algebra' : 'Physics & Chemistry'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topics Navigation */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Curriculum Topics ({topics.length})
                </span>
                <span className="text-[11px] text-amber-400 font-medium">Click to inspect</span>
              </div>

              {topics.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No topics listed yet for this subject.
                </div>
              ) : (
                <div className="space-y-2">
                  {topics.map((t, index) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopicId(t.id)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedTopicId === t.id
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold'
                          : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-400 flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm truncate">{t.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Column 2: Topic Details, Video, Notes & Quiz Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
              
              {activeTopic ? (
                <div>
                  
                  {/* Topic Title & Description */}
                  <div className="border-b border-slate-800 pb-5 mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {activeGrade?.name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {activeSubject?.name}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white tracking-tight">{activeTopic.title}</h3>
                    {activeTopic.description && (
                      <p className="mt-2 text-sm text-slate-300 leading-relaxed">{activeTopic.description}</p>
                    )}
                  </div>

                  {/* Lesson Items inside this topic */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Learning Materials Inside This Topic ({lessonItems.length})
                    </h4>

                    {lessonItems.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm bg-slate-950/50 rounded-2xl border border-slate-800/80">
                        New lesson videos, summary notes, and quizzes are currently being finalized for this topic.
                      </div>
                    ) : (
                      lessonItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                item.type === 'video'
                                  ? 'bg-rose-500/10 text-rose-400'
                                  : item.type === 'notes'
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : 'bg-emerald-500/10 text-emerald-400'
                              }`}
                            >
                              {item.type === 'video' && <Video className="w-5 h-5" />}
                              {item.type === 'notes' && <FileText className="w-5 h-5" />}
                              {item.type === 'quiz' && <HelpCircle className="w-5 h-5" />}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                <span className="capitalize">{item.type}</span>
                                {item.videoDuration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.videoDuration}
                                  </span>
                                )}
                                {item.type === 'quiz' && (
                                  <span className="text-amber-400 font-medium">100% Pass Mark Required</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Subscriber Access</span>
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Call to Action Banner to Unlock */}
                  <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-indigo-600/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-base">Unlock All Videos, Notes & 100% Quizzes</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Subscribe from <strong className="text-amber-400">R 250 / month</strong> for complete step-by-step guidance.
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectSubscription(selectedGradeId, selectedSubjectId)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <span>Enroll in {activeSubject?.name || 'Subject'}</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="py-20 text-center text-slate-400">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-base font-medium">Please select a grade and subject on the left to view the curriculum.</p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
