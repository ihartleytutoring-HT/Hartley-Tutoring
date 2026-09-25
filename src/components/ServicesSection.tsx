import React from 'react';
import {
  Calculator,
  Atom,
  Cpu,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenSubscribe: () => void;
  onExploreCurriculum: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenSubscribe,
  onExploreCurriculum,
}) => {
  const services = [
    {
      id: 'maths-physics',
      title: 'Mathematics & Physics Tutoring',
      tag: 'Grades 8 – 12',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: Calculator,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      description:
        'At Hartley Tutoring, we offer specialized tutoring in Mathematics for grades 8–12, focusing on developing problem-solving skills and a solid understanding of concepts. Our personalized approach ensures that each student receives the support they need to excel academically.',
      features: [
        'Algebraic foundations, functions, and quadratic equations',
        'Differential calculus from first principles and curve sketching',
        'Trigonometric identities, reductions, and 2D/3D problems',
        'Physical Sciences: Mechanics, electric circuits, and chemistry',
        'Exam techniques and past trial papers preparation',
      ],
      ctaText: 'Explore Grade 8–12 Curriculum',
    },
    {
      id: 'ap-maths-fsm',
      title: 'AP Maths & Physics',
      tag: 'Further Studies Maths (FSM)',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      icon: Atom,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
      description:
        'Our AP Maths and Physics tutoring prepares students for advanced placement exams, helping them gain confidence and achieve high scores. We also offer Further Studies Maths (FSM) sessions that cater to learners aiming to deepen their understanding for future academic pursuits.',
      features: [
        'Advanced Calculus: Limits, integration techniques, and differential equations',
        'Matrices, linear transformations, and complex numbers',
        'Further Studies Physics: Relativistic mechanics and quantum concepts',
        'Bridging the high school to university STEM gap',
        'Designed for aspiring engineering, computer science, and actuarial students',
      ],
      ctaText: 'View AP & FSM Modules',
    },
    {
      id: 'engineering-maths',
      title: 'Engineering Mathematics',
      tag: 'N1 – N6 Levels & Tertiary',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: Cpu,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      description:
        'We provide Engineering Mathematics tutoring for N1–N6 levels, tailored for students in technical fields. Whether in individual or group settings, our interactive sessions foster collaborative learning and ensure every student grasps the material effectively.',
      features: [
        'N1 to N6 National Certificate / NATED Engineering Mathematics',
        'Technical calculations, trigonometric equations, and logs',
        'Applied differential and integral calculus for engineers',
        'Support for TVET colleges (False Bay College, College of Cape Town, etc.)',
        'Taught by a UCT Mechatronics Engineering graduate',
      ],
      ctaText: 'Explore N1–N6 Engineering',
    },
    {
      id: 'sessions-support',
      title: 'Individual & Group Sessions',
      tag: 'In-Person & Online Nationwide',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: Users,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      description:
        'Whether you prefer one-on-one focused attention or collaborative study classes, our flexible tutoring options accommodate diverse learning preferences. Plus, get personalized WhatsApp support for last-minute questions before exams.',
      features: [
        'Interactive 1-on-1 private coaching tailored to your exact pace',
        'Small group masterclasses fostering peer discussion',
        'In-person at Penlyn Estate, Cape Town or online nationwide',
        'Personalized WhatsApp support for last-minute panic before tests',
        '100% mastery quiz tracking ensuring zero knowledge gaps',
      ],
      ctaText: 'Start Learning Today',
    },
  ];

  return (
    <section id="services" className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Academic Excellence & Support</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tutoring Services for Students
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            From Grade 8 foundations and Matric distinctions to AP Maths, Further Studies Maths (FSM), and N1–N6 Engineering Mathematics.
          </p>
        </div>

        {/* Services 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 p-7 sm:p-8 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group hover:shadow-2xl"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl ${service.iconBg} border flex items-center justify-center ${service.iconColor} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${service.badgeColor}`}
                    >
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-6">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={onExploreCurriculum}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer group-hover:gap-2 transition-all"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onOpenSubscribe}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
                  >
                    Subscribe (from R250)
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engineering Mindset Callout Banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              The Hartley Tutoring Difference
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Need Help With N1–N6 Engineering or AP Further Studies?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Imraan Hartley brings a Mechatronics Engineering (UCT) problem-solving method to every concept. Join our interactive sessions or get direct WhatsApp exam support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenSubscribe}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              Choose Your Package
            </button>
            <a
              href="https://wa.me/27681432025?text=Hi%20Imraan%2C%20I%20would%20like%20to%20inquire%20about%20your%20Engineering%20Maths%20%2F%20AP%20Maths%20tutoring."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 cursor-pointer transition-all text-center"
            >
              WhatsApp Imraan
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
