import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'curriculum' | 'pricing' | 'about' | 'contact') => void;
  onOpenSubscribe: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSubscribe }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src="https://static.wixstatic.com/media/9d2cc8_fb65460968104dc5a824c9686eb63ae6~mv2.png/v1/fill/w_109,h_109,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/hartley_logo_badge.png"
                  alt="Hartley Tutoring Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-base text-white">Hartley Tutoring</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Premier high school and university mathematics and physical sciences tutoring founded by Imraan Hartley. Based in Penlyn Estate, Cape Town, serving learners nationwide.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-400 font-semibold">
                100% Pass Mastery System
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-xs">Navigation</p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Imraan Hartley
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('curriculum')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Curriculum & Syllabus
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Packages & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs & Curriculums */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-xs">Academic Streams</p>
            <ul className="space-y-2">
              <li>Grade 12 Matric Final Exam Drills (NSC & IEB)</li>
              <li>Grade 11 Mathematics & Physical Sciences</li>
              <li>Grade 10 Foundation FET Phase</li>
              <li>University Calculus, Linear Algebra & Physics</li>
              <li>Differential Equations & Organic Chemistry</li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-xs">Penlyn Estate Center</p>
            <p className="text-slate-300">
              12 Arlington Road, Penlyn Estate<br />
              Cape Town, Western Cape, 7780<br />
              South Africa
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/27681432025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: 068 143 2025</span>
              </a>
            </div>
            <div>
              <a
                href="mailto:ihartleytutoring@gmail.com"
                className="text-indigo-400 font-semibold hover:underline"
              >
                ihartleytutoring@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>&copy; {currentYear} Hartley Tutoring &bull; Imraan Hartley. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with rigor for South African students &amp; scholars.
          </p>
        </div>

      </div>
    </footer>
  );
};
