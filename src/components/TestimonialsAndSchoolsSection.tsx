import React, { useState } from 'react';
import { Quote, Star, GraduationCap, Building2, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export const TestimonialsAndSchoolsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'parents'>('all');

  const schools = [
    {
      name: 'Pinelands High',
      logo: 'https://static.wixstatic.com/media/9d2cc8_7d790c65c1e046c0b2b0826b9bdcc762~mv2.png/v1/fill/w_211,h_61,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/pinelands.png',
    },
    {
      name: 'Wynberg Girls High',
      logo: 'https://static.wixstatic.com/media/9d2cc8_0bf3ad16796d44d2a0b1f3ec3908e687~mv2.png/v1/fill/w_155,h_40,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/wynberg%20girsl.png',
    },
    {
      name: 'Wynberg Boys High',
      logo: 'https://static.wixstatic.com/media/9d2cc8_b9063d532c87465abaf91e53072c85a1~mv2.png/v1/fill/w_231,h_53,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/wynberg%20boys.png',
    },
    {
      name: 'Claremont High School',
      logo: 'https://static.wixstatic.com/media/9d2cc8_a3b1c4288bb945fe8e02d0e4389e7995~mv2.png/v1/fill/w_67,h_40,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/claremont%20high%20school.png',
    },
    {
      name: 'Rustenburg Girls High',
      logo: 'https://static.wixstatic.com/media/9d2cc8_b201ae8460524a1c94271f8329c6d117~mv2.png/v1/fill/w_182,h_67,al_c,q_85,enc_avif,quality_auto/Rustenberg%20girls.png',
    },
    {
      name: 'Fairmont High',
      logo: 'https://static.wixstatic.com/media/9d2cc8_2bda854db4534444b176855930e8a800~mv2.png/v1/fill/w_67,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fairmont%20high.png',
    },
    {
      name: 'Cravenby Secondary',
      logo: 'https://static.wixstatic.com/media/9d2cc8_00ce5b0a48b8491bbf27b8340c9bbcd7~mv2.png/v1/fill/w_81,h_80,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/cravenby.png',
    },
    {
      name: 'American International School (AISCT)',
      logo: 'https://static.wixstatic.com/media/9d2cc8_a1c694587ba745ebb65f760a58882751~mv2.png/v1/fill/w_165,h_40,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ameican%20school.png',
    },
    {
      name: 'Abbotts College',
      logo: 'https://static.wixstatic.com/media/9d2cc8_b249af24e14a489d8f0362d250ac01c5~mv2.png/v1/fill/w_67,h_75,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/abbotss.png',
    },
    {
      name: 'Islamia College',
      logo: 'https://static.wixstatic.com/media/9d2cc8_a0eddb44f92642a0be4d4a169afcc776~mv2.png/v1/fill/w_107,h_67,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/islamia.png',
    },
    {
      name: 'Norman Henshilwood High',
      logo: 'https://static.wixstatic.com/media/9d2cc8_3f89b4c41517439d84604b8cbea83594~mv2.png/v1/fill/w_175,h_61,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/normies.png',
    },
    {
      name: 'Portlands High',
      logo: 'https://static.wixstatic.com/media/9d2cc8_ee0f28b8d82e460a9abef8f5546c0b56~mv2.png/v1/fill/w_88,h_86,al_c,lg_1,q_85,enc_avif,quality_auto/portlands%20high%20.png',
    },
    {
      name: 'Rylands High',
      logo: 'https://static.wixstatic.com/media/9d2cc8_4bf7f8ca802c4a8ea72ac5eab7bbcfa9~mv2.png/v1/fill/w_126,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/rylands%20high.png',
    },
  ];

  const tertiaryInstitutes = [
    {
      name: 'University of Cape Town (UCT)',
      logo: 'https://static.wixstatic.com/media/9d2cc8_59df768621ce4abebdae8440b431f7b4~mv2.png/v1/fill/w_96,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/UCT.png',
    },
    {
      name: 'Cape Peninsula University of Technology (CPUT)',
      logo: 'https://static.wixstatic.com/media/9d2cc8_a49189c16829432dab8ce6a8c134432d~mv2.png/v1/fill/w_150,h_67,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/cput.png',
    },
    {
      name: 'College of Cape Town',
      logo: 'https://static.wixstatic.com/media/9d2cc8_bbd351165b3e4696a005362a13577452~mv2.png/v1/fill/w_88,h_80,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/college%20of%20cpt.png',
    },
    {
      name: 'False Bay College (FBC)',
      logo: 'https://static.wixstatic.com/media/9d2cc8_4199c020381144d28d6971239852f8b6~mv2.png/v1/fill/w_211,h_123,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fbc.png',
    },
    {
      name: 'Rosebank College',
      logo: 'https://static.wixstatic.com/media/9d2cc8_3b3d10372dbe4ad4a9d07ae8e657bb6c~mv2.png/v1/fill/w_165,h_75,al_c,q_85,enc_avif,quality_auto/rosebank.png',
    },
  ];

  const testimonials = [
    {
      type: 'student',
      name: 'Matric Student',
      school: 'Pinelands High School',
      quote:
        'I was consistently getting marks in the 50% range for Mathematics, but after receiving regular tutoring and support, I improved into the 80s. The lessons were well structured, patient and easy to understand, which really boosted my confidence. I’m extremely grateful for the dedication and would highly recommend these tutoring services to any student looking to improve academically.',
      improvement: '50% → 80%+',
      subject: 'Mathematics',
    },
    {
      type: 'student',
      name: 'AP Maths Student',
      school: 'Wynberg Girls High',
      quote:
        'I couldn’t be happier with the support I’ve received for AP Maths. I used to feel completely lost in class and wasn’t confident at all, but over time I’ve seen such a big change. My marks have improved, but more importantly, I actually understand the work now and go into tests feeling much more confident. The lessons are always clear, patient and encouraging.',
      improvement: 'High Distinction',
      subject: 'Advanced Programme (AP) Maths',
    },
    {
      type: 'parent',
      name: 'Parent of Grade 11 Student',
      school: 'Cape Town High School Parent',
      quote:
        'My daughter was really struggling with Grade 11 Physical Sciences, she went from barely passing to a low 70s in one term. Imraan has such a calm, patient way of explaining things, and he actually breaks problems down step by step instead of just giving her the answer. She’s so much more confident going into tests now. Highly recommend him to any parent looking for a tutor who actually cares.',
      improvement: 'Barely Passing → 70%+',
      subject: 'Physical Sciences (Grade 11)',
    },
    {
      type: 'parent',
      name: 'Parent of Matric Rewrite Students',
      school: 'Matric Exam Rewrites',
      quote:
        'I just wanted to say thank you for all your help and support tutoring my boys for their matric rewrites for both maths and physics. They both enjoyed your sessions and based on their feedback when they wrote their papers they actually understood the question and how to answer it. I am confident their results have improved. You are able to relate to them which is great and why they took to you so easily. My only regret is not finding you sooner.',
      improvement: 'Passed Matric Rewrites',
      subject: 'Matric Maths & Physics',
    },
    {
      type: 'parent',
      name: 'Parent of Max',
      school: 'Cape Town Learner',
      quote:
        'The best tutor ever. He took Max from a 30-40% mark to 61% with only 3 and a half lessons. I listen to him interacting with Max and Max is excited and so eager to work with him. He is really good. He wants to help kids and make a difference, an awesome young man and super respectful.',
      improvement: '30-40% → 61% in 3.5 lessons',
      subject: 'Mathematics',
    },
  ];

  const filteredTestimonials =
    activeTab === 'all'
      ? testimonials
      : testimonials.filter((t) => (activeTab === 'students' ? t.type === 'student' : t.type === 'parent'));

  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Proven Student & Parent Results</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Loved by Cape Town Students & Parents
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Real feedback from high schools and university students across Cape Town and nationwide who transformed their marks with Imraan Hartley.
          </p>

          {/* Testimonial Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Reviews ({testimonials.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'students'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Student Stories
            </button>
            <button
              onClick={() => setActiveTab('parents')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'parents'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Parent Feedback
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-7 shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.improvement}
                  </span>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">{item.name}</h4>
                  <p className="text-[11px] text-amber-400/90 font-medium">{item.school}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  {item.subject}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Schools Tutored Showcase */}
        <div className="mt-20 pt-12 border-t border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              Trusted Across Cape Town
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              High Schools & Academies Tutored
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Top Western Cape schools where Hartley Tutoring has consistently elevated student grades.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {schools.map((school, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-900 hover:border-slate-700 transition-all group"
              >
                <div className="h-12 w-full flex items-center justify-center p-1">
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="max-h-10 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                  {school.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tertiary Institutes Tutored Showcase */}
        <div className="mt-14 pt-8 border-t border-slate-900/80">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
              Higher Education
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Tertiary STEM Institutes Tutored
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {tertiaryInstitutes.map((inst, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-900 hover:border-slate-700 transition-all group"
              >
                <div className="h-12 w-full flex items-center justify-center p-1">
                  <img
                    src={inst.logo}
                    alt={inst.name}
                    className="max-h-10 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                  {inst.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
