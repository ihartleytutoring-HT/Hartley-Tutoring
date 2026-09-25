import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Grade,
  Subject,
  Topic,
  LessonItem,
  PackagePrice,
  UserProgress,
  Enquiry,
  QuizQuestion,
} from '../types';
import {
  getGrades,
  saveGrade,
  deleteGrade,
  getSubjects,
  saveSubject,
  deleteSubject,
  getTopics,
  saveTopic,
  deleteTopic,
  getLessonItems,
  saveLessonItem,
  deleteLessonItem,
  getAllPackagePrices,
  savePackagePrice,
  DEFAULT_PRICING,
  seedInitialCurriculum,
} from '../services/curriculumService';
import { getAllStudentProgress } from '../services/progressService';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../services/enquiryService';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Check,
  Video,
  FileText,
  HelpCircle,
  Tag,
  DollarSign,
  Users,
  Inbox,
  FolderTree,
  ExternalLink,
  MessageCircle,
  Mail,
  AlertCircle,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'curriculum' | 'content' | 'progress' | 'pricing' | 'enquiries'
  >('curriculum');

  // Curriculum states
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessonItems, setLessonItems] = useState<LessonItem[]>([]);

  // Selection filters for admin
  const [selectedGradeId, setSelectedGradeId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  // Progress and Enquiries
  const [allProgress, setAllProgress] = useState<UserProgress[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [pricingList, setPricingList] = useState<PackagePrice[]>([]);

  // Modal / Form states
  const [showGradeModal, setShowGradeModal] = useState<boolean>(false);
  const [gradeName, setGradeName] = useState<string>('');
  const [gradeDesc, setGradeDesc] = useState<string>('');
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);

  const [showSubjectModal, setShowSubjectModal] = useState<boolean>(false);
  const [subjectName, setSubjectName] = useState<string>('');
  const [subjectDesc, setSubjectDesc] = useState<string>('');
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [topicDesc, setTopicDesc] = useState<string>('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  // Lesson Item Form state
  const [showLessonModal, setShowLessonModal] = useState<boolean>(false);
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [lessonType, setLessonType] = useState<'video' | 'notes' | 'quiz'>('video');
  const [lessonVideoUrl, setLessonVideoUrl] = useState<string>('');
  const [lessonVideoDuration, setLessonVideoDuration] = useState<string>('15:00');
  const [lessonNotesContent, setLessonNotesContent] = useState<string>('');
  const [lessonNotesUrl, setLessonNotesUrl] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'Sample calculus or physics question',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: 0,
      explanation: 'Explanation why Option A is correct according to formulas.',
    },
  ]);

  // Pricing Form state
  const [selectedPricingPackage, setSelectedPricingPackage] = useState<PackagePrice>(DEFAULT_PRICING);
  const [priceM1, setPriceM1] = useState<number>(250);
  const [priceM3, setPriceM3] = useState<number>(600);
  const [priceM6, setPriceM6] = useState<number>(1000);
  const [priceM12, setPriceM12] = useState<number>(1800);
  const [pricingSuccessMsg, setPricingSuccessMsg] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  // Initial Data Load
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [gList, pList, progList, enqList] = await Promise.all([
        getGrades(),
        getAllPackagePrices(),
        getAllStudentProgress(),
        getEnquiries(),
      ]);

      setGrades(gList);
      setPricingList(pList);
      setAllProgress(progList);
      setEnquiries(enqList);

      if (gList.length > 0 && !selectedGradeId) {
        setSelectedGradeId(gList[0].id);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Subjects when Grade changes
  useEffect(() => {
    if (!selectedGradeId) return;
    async function loadSubs() {
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
        console.error('Error fetching subjects:', err);
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
        } else {
          setSelectedTopicId('');
          setLessonItems([]);
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    }
    loadTops();
  }, [selectedGradeId, selectedSubjectId]);

  // Load Lessons when Topic changes
  useEffect(() => {
    if (!selectedTopicId) return;
    async function loadItems() {
      try {
        const items = await getLessonItems(selectedTopicId);
        setLessonItems(items);
      } catch (err) {
        console.error('Error fetching lessons:', err);
      }
    }
    loadItems();
  }, [selectedTopicId]);

  // Handle Grade Save
  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeName.trim()) return;
    try {
      await saveGrade(
        {
          name: gradeName.trim(),
          description: gradeDesc.trim(),
          order: grades.length + 1,
          active: true,
        },
        editingGradeId || undefined
      );
      setGradeName('');
      setGradeDesc('');
      setEditingGradeId(null);
      setShowGradeModal(false);
      await refreshAllData();
      showFlash('Grade saved successfully.');
    } catch (err: any) {
      alert('Error saving grade: ' + err.message);
    }
  };

  const handleDeleteGrade = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Grade? All subjects within it will be affected.')) return;
    try {
      await deleteGrade(id);
      await refreshAllData();
      showFlash('Grade deleted.');
    } catch (err: any) {
      alert('Error deleting grade: ' + err.message);
    }
  };

  // Handle Subject Save
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !selectedGradeId) return;
    try {
      await saveSubject(
        {
          gradeId: selectedGradeId,
          name: subjectName.trim(),
          description: subjectDesc.trim(),
          order: subjects.length + 1,
        },
        editingSubjectId || undefined
      );
      setSubjectName('');
      setSubjectDesc('');
      setEditingSubjectId(null);
      setShowSubjectModal(false);
      const updatedSubs = await getSubjects(selectedGradeId);
      setSubjects(updatedSubs);
      showFlash('Subject saved successfully.');
    } catch (err: any) {
      alert('Error saving subject: ' + err.message);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    try {
      await deleteSubject(id);
      const updatedSubs = await getSubjects(selectedGradeId);
      setSubjects(updatedSubs);
      showFlash('Subject deleted.');
    } catch (err: any) {
      alert('Error deleting subject: ' + err.message);
    }
  };

  // Handle Topic Save
  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim() || !selectedGradeId || !selectedSubjectId) return;
    try {
      await saveTopic(
        {
          gradeId: selectedGradeId,
          subjectId: selectedSubjectId,
          title: topicTitle.trim(),
          description: topicDesc.trim(),
          order: topics.length + 1,
        },
        editingTopicId || undefined
      );
      setTopicTitle('');
      setTopicDesc('');
      setEditingTopicId(null);
      setShowTopicModal(false);
      const updatedTops = await getTopics(selectedGradeId, selectedSubjectId);
      setTopics(updatedTops);
      showFlash('Topic saved successfully.');
    } catch (err: any) {
      alert('Error saving topic: ' + err.message);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Delete this topic and its lessons?')) return;
    try {
      await deleteTopic(id);
      const updatedTops = await getTopics(selectedGradeId, selectedSubjectId);
      setTopics(updatedTops);
      showFlash('Topic deleted.');
    } catch (err: any) {
      alert('Error deleting topic: ' + err.message);
    }
  };

  // Handle Lesson Item Save (Video, Notes, Quiz)
  const handleSaveLessonItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !selectedTopicId) return;

    try {
      await saveLessonItem({
        topicId: selectedTopicId,
        gradeId: selectedGradeId,
        subjectId: selectedSubjectId,
        title: lessonTitle.trim(),
        type: lessonType,
        order: lessonItems.length + 1,
        videoUrl: lessonType === 'video' ? lessonVideoUrl.trim() : undefined,
        videoDuration: lessonType === 'video' ? lessonVideoDuration.trim() : undefined,
        notesContent: lessonType === 'notes' ? lessonNotesContent : undefined,
        notesAttachmentUrl: lessonType === 'notes' ? lessonNotesUrl.trim() : undefined,
        quizQuestions: lessonType === 'quiz' ? quizQuestions : undefined,
        passingScorePercent: 100, // Enforce 100% pass mark for quizzes as requested
      });

      setShowLessonModal(false);
      setLessonTitle('');
      setLessonVideoUrl('');
      setLessonNotesContent('');
      const updatedLessons = await getLessonItems(selectedTopicId);
      setLessonItems(updatedLessons);
      showFlash(`Lesson ${lessonType.toUpperCase()} added successfully.`);
    } catch (err: any) {
      alert('Error saving lesson item: ' + err.message);
    }
  };

  const handleDeleteLessonItem = async (id: string) => {
    if (!confirm('Delete this lesson item?')) return;
    try {
      await deleteLessonItem(id);
      const updatedLessons = await getLessonItems(selectedTopicId);
      setLessonItems(updatedLessons);
      showFlash('Lesson removed.');
    } catch (err: any) {
      alert('Error deleting lesson: ' + err.message);
    }
  };

  // Handle Package Price Save
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const packageId =
        selectedGradeId && selectedSubjectId ? `${selectedGradeId}_${selectedSubjectId}` : 'default';

      const gradeObj = grades.find((g) => g.id === selectedGradeId);
      const subjectObj = subjects.find((s) => s.id === selectedSubjectId);

      await savePackagePrice({
        id: packageId,
        gradeId: selectedGradeId || undefined,
        subjectId: selectedSubjectId || undefined,
        gradeName: gradeObj?.name,
        subjectName: subjectObj?.name,
        month1: Number(priceM1),
        month3: Number(priceM3),
        month6: Number(priceM6),
        month12: Number(priceM12),
      });

      setPricingSuccessMsg('Package pricing updated in real-time!');
      setTimeout(() => setPricingSuccessMsg(''), 4000);
      refreshAllData();
    } catch (err: any) {
      alert('Error updating prices: ' + err.message);
    }
  };

  const showFlash = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleSeedData = async () => {
    if (!confirm('Populate Hartley Tutoring with Grade 12 & 11 Math & Science sample curriculum?')) return;
    setLoading(true);
    try {
      await seedInitialCurriculum();
      await refreshAllData();
      showFlash('Curriculum initialized successfully!');
    } catch (err: any) {
      alert('Seeding error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-24 bg-slate-950 text-white min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Admin Portal Restricted</h2>
          <p className="text-xs text-slate-400 mb-6">
            This dashboard is only available to pre-approved administrator accounts:
            <br />
            <code className="text-amber-400 text-[11px] block mt-2 font-mono">
              ihartleytutoring@gmail.com
              <br />
              imraanhartley76@gmail.com
              <br />
              yaaseen.abrahams@gmail.com
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Hartley Tutoring Admin Suite
              </span>
              <span className="text-xs text-slate-400">&bull; {user?.email}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Management & Curriculum Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Restore Sample Curriculum</span>
            </button>
          </div>
        </div>

        {/* Flash Message */}
        {statusMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>1. Grades & Subjects</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>2. Videos, Notes & Quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>3. Package Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'progress'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. Track Student Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>5. Inquiries Inbox ({enquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: CURRICULUM HIERARCHY (Grades, Subjects, Topics) */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. GRADES COLUMN */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-white">Grades (School Years)</h3>
                  <p className="text-[11px] text-slate-400">e.g. Grade 12 Matric, Grade 11</p>
                </div>
                <button
                  onClick={() => {
                    setGradeName('');
                    setGradeDesc('');
                    setEditingGradeId(null);
                    setShowGradeModal(true);
                  }}
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    onClick={() => setSelectedGradeId(grade.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedGradeId === grade.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-semibold'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{grade.name}</p>
                      {grade.description && (
                        <p className="text-[11px] text-slate-400 truncate">{grade.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGrade(grade.id);
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. SUBJECTS COLUMN */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-white">Subjects Under Grade</h3>
                  <p className="text-[11px] text-slate-400">
                    Active: {grades.find((g) => g.id === selectedGradeId)?.name || 'None'}
                  </p>
                </div>
                <button
                  disabled={!selectedGradeId}
                  onClick={() => {
                    setSubjectName('');
                    setSubjectDesc('');
                    setEditingSubjectId(null);
                    setShowSubjectModal(true);
                  }}
                  className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {subjects.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No subjects added for this grade yet. Click + to add Mathematics or Physical Sciences.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {subjects.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedSubjectId === sub.id
                          ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 font-semibold'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{sub.name}</p>
                        {sub.description && (
                          <p className="text-[11px] text-slate-400 truncate">{sub.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubject(sub.id);
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. TOPICS COLUMN */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-white">Topics Under Subject</h3>
                  <p className="text-[11px] text-slate-400">
                    Active: {subjects.find((s) => s.id === selectedSubjectId)?.name || 'None'}
                  </p>
                </div>
                <button
                  disabled={!selectedSubjectId}
                  onClick={() => {
                    setTopicTitle('');
                    setTopicDesc('');
                    setEditingTopicId(null);
                    setShowTopicModal(true);
                  }}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {topics.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No topics added yet. Click + to add topics like Calculus, Trigonometry, or Mechanics.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {topics.map((top) => (
                    <div
                      key={top.id}
                      onClick={() => setSelectedTopicId(top.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedTopicId === top.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{top.title}</p>
                        {top.description && (
                          <p className="text-[11px] text-slate-400 truncate">{top.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTopic(top.id);
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: CONTENT (Upload Videos, Notes, Quizzes) */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            
            {/* Filter selectors */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Grade:</label>
                <select
                  value={selectedGradeId}
                  onChange={(e) => setSelectedGradeId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Subject:</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Topic:</label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white min-w-[200px]"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-auto pt-4">
                <button
                  disabled={!selectedTopicId}
                  onClick={() => {
                    setLessonTitle('');
                    setLessonVideoUrl('');
                    setLessonNotesContent('');
                    setShowLessonModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Video / Notes / Quiz</span>
                </button>
              </div>
            </div>

            {/* List of Lesson Items */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
              <h3 className="font-bold text-base text-white mb-4">
                Lesson Content in "{topics.find((t) => t.id === selectedTopicId)?.title || 'Selected Topic'}" ({lessonItems.length})
              </h3>

              {lessonItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No lesson items uploaded for this topic. Click "Upload Video / Notes / Quiz" above.
                </div>
              ) : (
                <div className="space-y-3">
                  {lessonItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
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
                          <p className="text-sm font-bold text-white truncate">{item.title}</p>
                          <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-0.5">
                            <span className="capitalize font-semibold text-slate-300">{item.type}</span>
                            {item.videoDuration && <span>&bull; {item.videoDuration}</span>}
                            {item.videoUrl && (
                              <span className="truncate max-w-[200px] text-slate-500">
                                {item.videoUrl}
                              </span>
                            )}
                            {item.type === 'quiz' && (
                              <span className="text-emerald-400 font-semibold">
                                {item.quizQuestions?.length || 0} Questions (100% Pass Mark)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDeleteLessonItem(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: PACKAGE PRICING MANAGER */}
        {activeTab === 'pricing' && (
          <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Dynamic Package Pricing (ZAR)</h3>
                <p className="text-xs text-slate-400">
                  Configure package prices for Grade + Subject combinations or global defaults.
                </p>
              </div>
            </div>

            {pricingSuccessMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{pricingSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePricing} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Grade (or Leave Global)
                  </label>
                  <select
                    value={selectedGradeId}
                    onChange={(e) => setSelectedGradeId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="">Global Default Pricing</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Subject (or Leave Global)
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="">All Subjects in Grade</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Package Tiers Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    1 Month Price (ZAR):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">R</span>
                    <input
                      type="number"
                      value={priceM1}
                      onChange={(e) => setPriceM1(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Default: R 250</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    3 Months Price (ZAR):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">R</span>
                    <input
                      type="number"
                      value={priceM3}
                      onChange={(e) => setPriceM3(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Default: R 600 (~R 200/mo)</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    6 Months Price (ZAR):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">R</span>
                    <input
                      type="number"
                      value={priceM6}
                      onChange={(e) => setPriceM6(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Default: R 1000 (~R 167/mo)</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    12 Months Full Year (ZAR):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">R</span>
                    <input
                      type="number"
                      value={priceM12}
                      onChange={(e) => setPriceM12(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Default: R 1800 (~R 150/mo)</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Save Package Pricing in Real-Time</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: TRACK STUDENT PROGRESS */}
        {activeTab === 'progress' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-white">Student Learning & 100% Pass Records</h3>
                <p className="text-xs text-slate-400">
                  Real-time audit log of videos watched and quizzes completed and passed at 100%.
                </p>
              </div>
              <button
                onClick={refreshAllData}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Refresh Log
              </button>
            </div>

            {allProgress.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No student activity recorded yet. As students watch videos and complete quizzes, records appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Item ID</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">100% Pass Grade</th>
                      <th className="py-3 px-4">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {allProgress.map((prog) => (
                      <tr key={prog.id} className="hover:bg-slate-950/50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{prog.userName || 'Student'}</p>
                          <p className="text-[11px] text-slate-400">{prog.userEmail || prog.userId}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              prog.type === 'video'
                                ? 'bg-rose-500/10 text-rose-400'
                                : prog.type === 'notes'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {prog.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {prog.lessonItemId}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white">{prog.score ?? 100}%</span>
                        </td>
                        <td className="py-3 px-4">
                          {prog.passed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                              <Check className="w-3 h-3" />
                              <span>100% PASSED</span>
                            </span>
                          ) : (
                            <span className="text-amber-400 font-medium">Pending 100%</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(prog.updatedAt).toLocaleString('en-ZA')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INQUIRIES INBOX */}
        {activeTab === 'enquiries' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-6">Website Visitor & Student Enquiries</h3>

            {enquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No contact form enquiries yet. Messages submitted via the website contact form appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-white">{enq.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            enq.status === 'new'
                              ? 'bg-amber-500/20 text-amber-400'
                              : enq.status === 'contacted'
                              ? 'bg-indigo-500/20 text-indigo-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>{enq.email}</span>
                        <span>&bull;</span>
                        <span>{enq.phone}</span>
                        {enq.grade && (
                          <>
                            <span>&bull;</span>
                            <span className="text-amber-400">{enq.grade}</span>
                          </>
                        )}
                        {enq.subject && (
                          <>
                            <span>&bull;</span>
                            <span className="text-indigo-400">{enq.subject}</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                        "{enq.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                          enq.name
                        )},%20Imraan%20Hartley%20here%20from%20Hartley%20Tutoring.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 flex items-center gap-1 text-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:${enq.email}?subject=Hartley%20Tutoring%20Inquiry`}
                        className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 flex items-center gap-1 text-xs"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </a>

                      <button
                        onClick={async () => {
                          await updateEnquiryStatus(
                            enq.id,
                            enq.status === 'new' ? 'contacted' : 'resolved'
                          );
                          refreshAllData();
                        }}
                        className="p-2 text-xs text-slate-400 hover:text-white"
                      >
                        Status
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm('Delete enquiry?')) {
                            await deleteEnquiry(enq.id);
                            refreshAllData();
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD / EDIT GRADE */}
        {showGradeModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bold text-lg text-white mb-4">Add / Edit School Grade</h3>
              <form onSubmit={handleSaveGrade} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Grade Name (e.g. Grade 12 Matric)
                  </label>
                  <input
                    type="text"
                    required
                    value={gradeName}
                    onChange={(e) => setGradeName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="e.g. Grade 12 (Matric)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={gradeDesc}
                    onChange={(e) => setGradeDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="e.g. Final NSC/IEB exam preparation"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGradeModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Save Grade
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT SUBJECT */}
        {showSubjectModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bold text-lg text-white mb-4">Add Subject under Grade</h3>
              <form onSubmit={handleSaveSubject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject Name (e.g. Mathematics, Physical Sciences)
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="e.g. Physical Sciences"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={subjectDesc}
                    onChange={(e) => setSubjectDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="e.g. Physics & Chemistry syllabus"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubjectModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs"
                  >
                    Save Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT TOPIC */}
        {showTopicModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bold text-lg text-white mb-4">Add Topic under Subject</h3>
              <form onSubmit={handleSaveTopic} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Topic Title (e.g. Differential Calculus, Organic Chemistry)
                  </label>
                  <input
                    type="text"
                    required
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="e.g. Differential Calculus"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={topicDesc}
                    onChange={(e) => setTopicDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    placeholder="e.g. First principles, derivatives, cubic functions"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTopicModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    Save Topic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD LESSON ITEM (Video, Notes, Quiz) */}
        {showLessonModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
              <h3 className="font-bold text-xl text-white mb-4">Upload Topic Material</h3>

              <form onSubmit={handleSaveLessonItem} className="space-y-4 text-xs">
                {/* Type Selection */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Material Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setLessonType('video')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        lessonType === 'video'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Video className="w-4 h-4 mx-auto mb-1 text-rose-400" />
                      <span>Video Lesson</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonType('notes')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        lessonType === 'notes'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <FileText className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                      <span>Summary Notes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonType('quiz')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        lessonType === 'quiz'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span>100% Pass Quiz</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    placeholder="e.g. Masterclass: First Principles & Derivatives"
                  />
                </div>

                {/* Video specific inputs */}
                {lessonType === 'video' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <label className="block text-slate-400 mb-1">Video Stream URL (YouTube, Vimeo, or MP4)</label>
                      <input
                        type="url"
                        required
                        value={lessonVideoUrl}
                        onChange={(e) => setLessonVideoUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Duration (e.g. 18:30)</label>
                      <input
                        type="text"
                        value={lessonVideoDuration}
                        onChange={(e) => setLessonVideoDuration(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Notes specific inputs */}
                {lessonType === 'notes' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <label className="block text-slate-400 mb-1">Study Guide / Notes Content</label>
                      <textarea
                        rows={6}
                        required
                        value={lessonNotesContent}
                        onChange={(e) => setLessonNotesContent(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white font-mono text-xs"
                        placeholder="### Important Formulas & Exam Traps..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Optional PDF Attachment / Link</label>
                      <input
                        type="url"
                        value={lessonNotesUrl}
                        onChange={(e) => setLessonNotesUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                        placeholder="https://.../notes.pdf"
                      />
                    </div>
                  </div>
                )}

                {/* Quiz specific inputs */}
                {lessonType === 'quiz' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Quiz Questions ({quizQuestions.length})</span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuizQuestions([
                            ...quizQuestions,
                            {
                              id: `q${quizQuestions.length + 1}`,
                              question: 'New question',
                              options: ['A', 'B', 'C', 'D'],
                              correctOptionIndex: 0,
                              explanation: '',
                            },
                          ])
                        }
                        className="text-amber-400 font-bold hover:underline"
                      >
                        + Add Question
                      </button>
                    </div>

                    {quizQuestions.map((q, idx) => (
                      <div key={q.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-300">Question {idx + 1}</span>
                          {quizQuestions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))}
                              className="text-rose-400 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          required
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[idx].question = e.target.value;
                            setQuizQuestions(updated);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                          placeholder="Question text"
                        />

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-1.5">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correctOptionIndex === optIdx}
                                onChange={() => {
                                  const updated = [...quizQuestions];
                                  updated[idx].correctOptionIndex = optIdx;
                                  setQuizQuestions(updated);
                                }}
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...quizQuestions];
                                  updated[idx].options[optIdx] = e.target.value;
                                  setQuizQuestions(updated);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={q.explanation}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[idx].explanation = e.target.value;
                            setQuizQuestions(updated);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 text-xs mt-1"
                          placeholder="Explanation for 100% mastery review"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowLessonModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                  >
                    Save & Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
