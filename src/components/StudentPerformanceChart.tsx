import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Topic, LessonItem, UserProgress } from '../types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  BarChart3,
  Target,
  Sparkles,
  HelpCircle,
  Video,
  FileText,
} from 'lucide-react';

interface StudentPerformanceChartProps {
  topics: Topic[];
  allLessons: LessonItem[];
  progressMap: Record<string, UserProgress>;
  subjectName?: string;
  onSelectTopic?: (topicId: string) => void;
}

export const StudentPerformanceChart: React.FC<StudentPerformanceChartProps> = ({
  topics,
  allLessons,
  progressMap,
  subjectName = 'Current Course',
  onSelectTopic,
}) => {
  const [chartView, setChartView] = useState<'topics' | 'modalities'>('topics');

  // Compute topic-by-topic metrics
  const topicData = useMemo(() => {
    if (!topics || topics.length === 0) return [];

    return topics.map((topic) => {
      const topicLessons = allLessons.filter((l) => l.topicId === topic.id);
      const totalCount = topicLessons.length;
      const completedCount = topicLessons.filter((l) => progressMap[l.id]?.completed).length;
      const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      const quizLessons = topicLessons.filter((l) => l.type === 'quiz');
      let quizScore = 0;
      const attemptedQuizzes = quizLessons.filter((q) => progressMap[q.id]);
      
      if (attemptedQuizzes.length > 0) {
        const scores = attemptedQuizzes
          .map((q) => progressMap[q.id]?.score ?? (progressMap[q.id]?.passed ? 100 : 0))
          .filter((s) => typeof s === 'number');
        if (scores.length > 0) {
          quizScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
      }

      const allQuizzesPassed =
        quizLessons.length > 0 &&
        quizLessons.every((q) => progressMap[q.id]?.passed);

      // Shorten label for chart axis
      const shortName =
        topic.title.length > 15 ? topic.title.slice(0, 13) + '…' : topic.title;

      return {
        topicId: topic.id,
        name: shortName,
        fullName: topic.title,
        'Completion Rate': completionRate,
        'Quiz Score': quizScore,
        completedCount,
        totalCount,
        quizCount: quizLessons.length,
        attemptedQuizCount: attemptedQuizzes.length,
        isMastered: allQuizzesPassed,
      };
    });
  }, [topics, allLessons, progressMap]);

  // Modality overview: Videos vs Notes vs Quizzes
  const modalityData = useMemo(() => {
    const videos = allLessons.filter((l) => l.type === 'video');
    const notes = allLessons.filter((l) => l.type === 'notes');
    const quizzes = allLessons.filter((l) => l.type === 'quiz');

    const videosCompleted = videos.filter((v) => progressMap[v.id]?.completed).length;
    const notesCompleted = notes.filter((n) => progressMap[n.id]?.completed).length;
    const quizzesPassed = quizzes.filter((q) => progressMap[q.id]?.passed).length;

    const videoRate = videos.length > 0 ? Math.round((videosCompleted / videos.length) * 100) : 0;
    const notesRate = notes.length > 0 ? Math.round((notesCompleted / notes.length) * 100) : 0;
    const quizRate = quizzes.length > 0 ? Math.round((quizzesPassed / quizzes.length) * 100) : 0;

    return [
      {
        name: 'Video Masterclasses',
        'Your Progress': videoRate,
        '100% Target': 100,
        completed: videosCompleted,
        total: videos.length,
        icon: 'video',
      },
      {
        name: 'Notes & Cheatsheets',
        'Your Progress': notesRate,
        '100% Target': 100,
        completed: notesCompleted,
        total: notes.length,
        icon: 'notes',
      },
      {
        name: '100% Mastery Quizzes',
        'Your Progress': quizRate,
        '100% Target': 100,
        completed: quizzesPassed,
        total: quizzes.length,
        icon: 'quiz',
      },
    ];
  }, [allLessons, progressMap]);

  // Overall calculations for summary badges
  const overallStats = useMemo(() => {
    const totalItems = allLessons.length;
    const completedItems = allLessons.filter((l) => progressMap[l.id]?.completed).length;
    const overallCompletionPercent =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const quizzes = allLessons.filter((l) => l.type === 'quiz');
    const attemptedQuizzes = quizzes.filter((q) => progressMap[q.id]);
    const passed100Quizzes = quizzes.filter((q) => progressMap[q.id]?.passed);

    let avgQuizScore = 0;
    if (attemptedQuizzes.length > 0) {
      const scores = attemptedQuizzes
        .map((q) => progressMap[q.id]?.score ?? (progressMap[q.id]?.passed ? 100 : 0))
        .filter((s) => typeof s === 'number');
      if (scores.length > 0) {
        avgQuizScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
    }

    return {
      overallCompletionPercent,
      completedItems,
      totalItems,
      avgQuizScore,
      passed100Quizzes: passed100Quizzes.length,
      totalQuizzes: quizzes.length,
    };
  }, [allLessons, progressMap]);

  // Custom Tooltip for topic-by-topic chart
  const CustomTopicTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-4 rounded-2xl shadow-2xl text-xs space-y-3 min-w-[240px]">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Module Analytics</span>
            <p className="font-extrabold text-white text-sm">{data.fullName}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                Course Completion
              </span>
              <span className="font-extrabold text-white text-sm">{data['Completion Rate']}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${data['Completion Rate']}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {data.completedCount} of {data.totalCount} lessons completed
            </p>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                Quiz Performance
              </span>
              <span className="font-extrabold text-white text-sm">{data['Quiz Score']}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${data['Quiz Score']}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {data.quizCount === 0
                ? 'No quizzes in this module yet'
                : data.isMastered
                ? '✓ 100% Passed (Full Mastery)'
                : data['Quiz Score'] > 0
                ? `${data['Quiz Score']}% score (Hartley standard: 100% needed)`
                : 'Quiz not attempted yet'}
            </p>
          </div>

          {onSelectTopic && (
            <p className="text-[10px] text-slate-500 italic pt-1 text-center">
              Click bar to jump to this module
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Modality chart
  const CustomModalityTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-4 rounded-2xl shadow-2xl text-xs space-y-2 min-w-[220px]">
          <p className="font-extrabold text-white text-sm border-b border-slate-800 pb-1.5">
            {data.name}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-400 font-semibold">Your Progress:</span>
            <span className="font-extrabold text-white text-sm">{data['Your Progress']}%</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {data.completed} of {data.total} completed
          </p>
          <div className="flex items-center justify-between gap-4 text-slate-400 pt-1 border-t border-slate-800">
            <span>Hartley Target:</span>
            <span className="text-amber-400 font-bold">100% Mastery</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-2xl mb-8 relative overflow-hidden">
      {/* Background glowing gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header & Controls */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Learning Analytics & Mastery Summary
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Progress
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Visual tracking of course completion percentages and quiz performance for <span className="text-slate-200 font-semibold">{subjectName}</span>.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setChartView('topics')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              chartView === 'topics'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Modules Breakdown
          </button>
          <button
            onClick={() => setChartView('modalities')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              chartView === 'modalities'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Skill Modalities
          </button>
        </div>
      </div>

      {/* Key Metric Highlights Cards */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
        {/* Card 1: Course Completion */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Course Completion</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">
              {overallStats.overallCompletionPercent}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              ({overallStats.completedItems}/{overallStats.totalItems})
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1 rounded-full transition-all duration-700"
              style={{ width: `${overallStats.overallCompletionPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2: Quiz Score Average */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Quiz Score</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-400">
              {overallStats.avgQuizScore}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">score</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 mt-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1 rounded-full transition-all duration-700"
              style={{ width: `${overallStats.avgQuizScore}%` }}
            />
          </div>
        </div>

        {/* Card 3: 100% Quizzes Passed */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>100% Mastery</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-yellow-400">
              {overallStats.passed100Quizzes}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              / {overallStats.totalQuizzes} Passed
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 truncate">
            {overallStats.passed100Quizzes === overallStats.totalQuizzes && overallStats.totalQuizzes > 0
              ? '★ All Quizzes Mastered!'
              : 'Strict 100% passing threshold'}
          </p>
        </div>

        {/* Card 4: Status Indicator */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Curriculum Pace</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-indigo-300">
              {overallStats.overallCompletionPercent >= 80
                ? 'Distinction Ready'
                : overallStats.overallCompletionPercent >= 40
                ? 'Steady Progress'
                : 'Beginning Module'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            Targeting Level 7 (80%+) CAPS
          </p>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="relative z-10 w-full pt-2">
        {chartView === 'topics' ? (
          <div>
            {topicData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <BookOpen className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
                <p className="text-sm font-semibold">No modules found for this subject yet.</p>
                <p className="text-xs text-slate-500 mt-1">Select another subject or grade above.</p>
              </div>
            ) : (
              <div className="w-full h-80 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topicData}
                    margin={{ top: 20, right: 20, left: -10, bottom: 45 }}
                    barGap={6}
                    barSize={20}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                      vertical={false}
                      opacity={0.4}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTopicTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: 16, fontSize: '11px' }}
                      formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
                    />
                    {/* Reference Line for Hartley Tutoring 100% Mastery Standard */}
                    <ReferenceLine
                      y={100}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeOpacity={0.6}
                      label={{
                        value: '100% Mastery Standard',
                        fill: '#34d399',
                        fontSize: 10,
                        position: 'insideTopRight',
                      }}
                    />
                    <Bar
                      dataKey="Completion Rate"
                      name="Course Completion (%)"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      onClick={(entry: any) => onSelectTopic && entry?.topicId && onSelectTopic(entry.topicId)}
                      cursor={onSelectTopic ? 'pointer' : 'default'}
                    >
                      {topicData.map((entry, index) => (
                        <Cell
                          key={`comp-cell-${index}`}
                          fill={entry['Completion Rate'] === 100 ? '#10b981' : '#059669'}
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="Quiz Score"
                      name="Quiz Performance (%)"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      onClick={(entry: any) => onSelectTopic && entry?.topicId && onSelectTopic(entry.topicId)}
                      cursor={onSelectTopic ? 'pointer' : 'default'}
                    >
                      {topicData.map((entry, index) => (
                        <Cell
                          key={`quiz-cell-${index}`}
                          fill={
                            entry.isMastered
                              ? '#eab308'
                              : entry['Quiz Score'] > 0
                              ? '#d97706'
                              : '#475569'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          /* Modality View */
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={modalityData}
                margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
                barGap={8}
                barSize={32}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                  opacity={0.4}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomModalityTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 16, fontSize: '11px' }}
                  formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
                />
                <ReferenceLine
                  y={100}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                />
                <Bar
                  dataKey="Your Progress"
                  name="Your Progress (%)"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f59e0b" />
                </Bar>
                <Bar
                  dataKey="100% Target"
                  name="Hartley Target (100%)"
                  fill="#334155"
                  radius={[6, 6, 0, 0]}
                  opacity={0.4}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer Insight Note */}
      <div className="relative z-10 mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-200">The Hartley 100% Rule:</strong> A quiz is only marked as passed when all answers are 100% correct to guarantee matric & university exam readiness.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Completion
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Quiz Score
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400 inline-block" /> 100% Mastered
          </span>
        </div>
      </div>
    </div>
  );
};
