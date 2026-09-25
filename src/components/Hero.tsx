import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Calculator,
  Atom,
  Award,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface HeroProps {
  onOpenSubscribe: () => void;
  onExploreCurriculum: () => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenSubscribe,
  onExploreCurriculum,
  onOpenContact,
}) => {
  const imraanPhoto =
    'https://static.wixstatic.com/media/9d2cc8_b55b9713967d4acda98de4fb279f2776~mv2.jpg/v1/fill/w_481,h_782,al_c,lg_1,q_85,enc_avif,quality_auto/imraan_photo_edited.jpg';

  const partnerLogos = [
    {
      name: 'UCT (University of Cape Town)',
      logo: 'https://static.wixstatic.com/media/9d2cc8_59df768621ce4abebdae8440b431f7b4~mv2.png/v1/fill/w_96,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/UCT.png',
      caption: 'Mechatronics Graduate',
    },
    {
      name: 'SuperProf',
      logo: 'https://static.wixstatic.com/media/9d2cc8_510cd100e8d8482e8600baa04e0be19b~mv2.png/v1/fill/w_256,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SuperProf.png',
      caption: 'Top Rated Tutor',
    },
    {
      name: 'Brightsparkz Tutors',
      logo: 'https://static.wixstatic.com/media/9d2cc8_737d365d194d4b938fb95d4beed5947a~mv2.png/v1/fill/w_137,h_116,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Brightzsparks%20tutors.png',
      caption: 'STEM Specialist',
    },
    {
      name: 'Prep2Perfection',
      logo: 'https://static.wixstatic.com/media/9d2cc8_69fe2feb16b74950b666490e5848a199~mv2.png/v1/fill/w_179,h_116,al_c,q_85,enc_avif,quality_auto/Prep2perfectin.png',
      caption: 'Matric Preparation',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white pt-6 pb-20 lg:pt-12 lg:pb-28">
      {/* Background Glows and Math Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-indigo-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Main Content: Two Columns on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines and CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Unlock Your Math &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500">
                Physics Potential.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Founded by <strong className="text-white font-semibold">Imraan Hartley</strong>, a{' '}
              <span className="text-amber-400 font-medium">Mechatronics Engineering graduate (UCT)</span> with{' '}
              <span className="text-white font-medium">7+ years tutoring experience</span> from Superprof, Brightsparkz and Prep2Perfection.
            </p>

            {/* Engineering Mindset Quote */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 italic border-l-4 border-l-amber-500">
              "I bring an engineering mindset to every lesson: breaking problems down step by step so you don’t just get the answer, you understand how to get there yourself."
            </div>

            {/* Quick Proof Badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <p className="text-xl sm:text-2xl font-black text-amber-400">7+ Yrs</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tutoring Experience</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <p className="text-xl sm:text-2xl font-black text-emerald-400">40% → 75%</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Avg 6-Month Jump</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <p className="text-xl sm:text-2xl font-black text-indigo-400">UCT</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Mechatronics Eng.</p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={onOpenSubscribe}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe (From R250/mo)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={onExploreCurriculum}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 shadow-lg hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Explore Curriculum & Quizzes</span>
              </button>
            </div>
          </div>

          {/* Right Column: Real Photo of Imraan Hartley */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 rounded-3xl blur-lg opacity-40 animate-pulse" />
              
              <div className="relative rounded-3xl bg-slate-900 p-2.5 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-950">
                  <img
                    src={imraanPhoto}
                    alt="Imraan Hartley - Founder of Hartley Tutoring"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay banner at bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-white text-base">Imraan Hartley</h4>
                        <p className="text-xs text-amber-400 font-semibold">Founder & Head STEM Educator</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                        Penlyn Estate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Partner / Experience Showcase Strip */}
        <div className="mt-16 pt-8 border-t border-slate-900">
          <p className="text-center text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-6">
            7+ Years Experience Across Premier Tutoring Platforms & Academia
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {partnerLogos.map((p, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-900 transition-colors"
              >
                <div className="h-10 flex items-center justify-center">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-8 max-w-[120px] object-contain opacity-85 hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400">{p.caption}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Cards / Preview Strip */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          <div className="relative group rounded-3xl bg-slate-900/80 p-6 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Math Tutoring & AP Maths</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Tailored math tutoring for grades 8–12 and Advanced Placement (AP) courses, focusing on core concepts and step-by-step problem-solving.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Grades 8 – 12 & AP Maths</span>
              <span className="text-amber-400 font-semibold">Caps & IEB</span>
            </div>
          </div>

          <div className="relative group rounded-3xl bg-slate-900/80 p-6 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
              <Atom className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Physics & Chemistry</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              In-depth support in Physical Sciences for grades 10–12, enabling students to grasp complex scientific principles and past paper techniques with ease.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Grades 10 – 12</span>
              <span className="text-indigo-400 font-semibold">Physical Sciences</span>
            </div>
          </div>

          <div className="relative group rounded-3xl bg-slate-900/80 p-6 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">100% Pass Mastery Rule</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              No half-measures: topic quizzes require 100% mastery score before graduation, combined with direct WhatsApp panic support before exams.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>WhatsApp Panic Support</span>
              <span className="text-emerald-400 font-semibold">100% Quizzes</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
