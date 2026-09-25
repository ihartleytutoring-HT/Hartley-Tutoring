import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsAndSchoolsSection } from './components/TestimonialsAndSchoolsSection';
import { CurriculumBrowser } from './components/CurriculumBrowser';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { SubscriptionModal } from './components/SubscriptionModal';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { seedInitialCurriculum } from './services/curriculumService';

type ViewMode =
  | 'home'
  | 'services'
  | 'curriculum'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'student-portal'
  | 'admin-portal';

function MainApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  // Subscription modal control
  const [subscribeModalOpen, setSubscribeModalOpen] = useState<boolean>(false);
  const [preSelectedGradeId, setPreSelectedGradeId] = useState<string | undefined>(undefined);
  const [preSelectedSubjectId, setPreSelectedSubjectId] = useState<string | undefined>(undefined);
  const [preSelectedDuration, setPreSelectedDuration] = useState<number | undefined>(undefined);

  // Auto-seed sample curriculum on first boot if database is brand new
  useEffect(() => {
    seedInitialCurriculum().catch((err) => {
      console.warn('Initial curriculum seed check completed:', err);
    });
  }, []);

  const handleOpenSubscribe = (duration?: number, gradeId?: string, subjectId?: string) => {
    setPreSelectedDuration(duration);
    setPreSelectedGradeId(gradeId);
    setPreSelectedSubjectId(subjectId);
    setSubscribeModalOpen(true);
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSubscribe={() => handleOpenSubscribe()}
      />

      {/* Main Content Area based on current view */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              onOpenSubscribe={() => handleOpenSubscribe()}
              onExploreCurriculum={() => handleNavigate('curriculum')}
              onOpenContact={() => handleNavigate('contact')}
            />
            <ServicesSection
              onOpenSubscribe={() => handleOpenSubscribe()}
              onExploreCurriculum={() => handleNavigate('curriculum')}
            />
            <CurriculumBrowser
              onSelectSubscription={(gradeId, subjectId) =>
                handleOpenSubscribe(undefined, gradeId, subjectId)
              }
            />
            <AboutSection />
            <TestimonialsAndSchoolsSection />
            <PricingSection
              onOpenSubscribe={(duration) => handleOpenSubscribe(duration)}
            />
            <ContactSection />
          </>
        )}

        {currentView === 'services' && (
          <div className="py-6">
            <ServicesSection
              onOpenSubscribe={() => handleOpenSubscribe()}
              onExploreCurriculum={() => handleNavigate('curriculum')}
            />
            <PricingSection
              onOpenSubscribe={(duration) => handleOpenSubscribe(duration)}
            />
            <ContactSection />
          </div>
        )}

        {currentView === 'curriculum' && (
          <div className="py-6">
            <CurriculumBrowser
              onSelectSubscription={(gradeId, subjectId) =>
                handleOpenSubscribe(undefined, gradeId, subjectId)
              }
            />
            <PricingSection
              onOpenSubscribe={(duration) => handleOpenSubscribe(duration)}
            />
          </div>
        )}

        {currentView === 'about' && (
          <div className="py-6">
            <AboutSection />
            <TestimonialsAndSchoolsSection />
            <ContactSection />
          </div>
        )}

        {currentView === 'pricing' && (
          <div className="py-6">
            <PricingSection
              onOpenSubscribe={(duration) => handleOpenSubscribe(duration)}
            />
            <ContactSection />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="py-6">
            <ContactSection />
          </div>
        )}

        {currentView === 'student-portal' && (
          <StudentPortal
            onOpenSubscribe={() => handleOpenSubscribe()}
          />
        )}

        {currentView === 'admin-portal' && <AdminPortal />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSubscribe={() => handleOpenSubscribe()}
      />

      {/* Floating WhatsApp Contact Button */}
      <WhatsAppFloatingButton />

      {/* Multi-step Subscription Checkout Modal */}
      <SubscriptionModal
        isOpen={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
        preSelectedGradeId={preSelectedGradeId}
        preSelectedSubjectId={preSelectedSubjectId}
        preSelectedDuration={preSelectedDuration}
        onSuccess={() => {
          setCurrentView('student-portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
