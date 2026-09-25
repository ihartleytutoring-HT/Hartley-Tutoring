import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Award,
  CheckCircle,
  BookOpen,
  Target,
  Sparkles,
  MessageCircle,
  Cpu,
  GraduationCap,
  Clock,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const waUrl =
    'https://wa.me/27681432025?text=Hi%20Imraan%2C%20I%20saw%20your%20website%20and%20would%20like%20to%20inquire%20about%20tutoring.';

  const imraanAboutPhoto =
    'https://static.wixstatic.com/media/9d2cc8_bb9807da06484cc8aeee5ee586e6743c~mv2.jpg/v1/fill/w_393,h_524,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WEBSITE%20PIC_edited.jpg';

  return (
    <section id="about" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Profile Card with Real Photo */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative background glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-3xl blur-xl opacity-30 animate-tilt"></div>
              
              <div className="relative rounded-3xl bg-slate-950 p-6 sm:p-7 border border-slate-800 shadow-2xl">
                
                {/* Real Tutor Photo */}
                <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/5] bg-slate-900">
                  <img
                    src={imraanAboutPhoto}
                    alt="Imraan Hartley - Head Educator"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-extrabold uppercase text-amber-400">
                    UCT Graduate
                  </div>
                </div>

                {/* Tutor Profile Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Imraan Hartley</h3>
                    <p className="text-amber-400 text-xs font-semibold">Founder & Head Math & Science Educator</p>
                    <p className="text-xs text-slate-400 mt-0.5">Mechatronics Engineering (UCT)</p>
                  </div>
                  <div className="flex h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 items-center justify-center font-black">
                    IH
                  </div>
                </div>

                {/* Key Details & Location */}
                <div className="mt-5 space-y-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Physical Tutoring Center</p>
                      <p className="text-xs text-slate-400">
                        12 Arlington Road, Penlyn Estate, Cape Town, 7780, South Africa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Direct Mobile & WhatsApp</p>
                      <a href="tel:0681432025" className="text-xs text-emerald-400 hover:underline font-mono">
                        068 143 2025
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Official Direct Email</p>
                      <a href="mailto:ihartleytutoring@gmail.com" className="text-xs text-indigo-400 hover:underline">
                        ihartleytutoring@gmail.com / imraanhartley76@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quick WhatsApp Action inside card */}
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>Chat on WhatsApp (068 143 2025)</span>
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Mission, Engineering Mindset & Services */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>The Engineering Mindset</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              About Hartley Tutoring
            </h2>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Imraan is a <strong className="text-white">Mechatronics Engineering graduate from UCT</strong> and the founder of Hartley Tutoring, bringing over <strong>7 years of specialized tutoring experience</strong> across platforms including Superprof, Brightsparkz, and Prep2Perfection.
            </p>

            {/* Engineering Mindset Callout */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed border-l-4 border-l-amber-500 shadow-lg">
              <p className="font-semibold text-white mb-1.5">How Imraan Teaches:</p>
              <p className="italic text-slate-300">
                "I bring an engineering mindset to every lesson: breaking problems down step by step so you don’t just get the answer, you understand how to get there yourself. Whatever your goal; passing, catching up, or aiming for a distinction, lessons are built around exactly where you are and where you want to be."
              </p>
            </div>

            {/* Our Services Offered Grid */}
            <div className="pt-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 text-amber-400">
                Services Offered
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Math Tutoring (Grades 8–12)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Tailored math tutoring focusing on core concepts, algebraic intuition, and problem-solving strategies.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1.5">
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                    <span>Physics & Chemistry (Grades 10–12)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    In-depth support in Physical Sciences, enabling students to grasp complex mechanics and chemistry principles.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span>AP & FS Mathematics</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Prepare for Advanced Placement and Further Studies courses with university-ready analytical training.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Exam Prep & WhatsApp Panic Support</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Past exam paper drills, exam techniques, plus personalized WhatsApp support for last-minute questions before exams.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <GraduationCap className="w-4 h-4 text-amber-400" /> UCT BSc (Eng) Mechatronics
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400" /> 7+ Years Experience
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Target className="w-4 h-4 text-indigo-400" /> 40% → 75% Average Improvement
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
